import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { TitleWrapper } from '../../common/CommonStyled';
import { Link as RouterLink } from 'react-router-dom';
import { getEmployee, getEmployeeLeaves, updateLeaveStatus, getLeaveType } from '../../../api/common';
import { getDayNameByDate, getFullDate } from '../../../utils/utils';

// material-ui
import { Box, Grid, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';
import { Alert, Select, DatePicker, Button, Flex, Divider, Modal, Space, Spin, Empty } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { AssignmentInd, Hail } from '@mui/icons-material';

const { confirm } = Modal;

// project import
import Dot from 'components/@extended/Dot';

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
  },
  {
    id: 'employee_name',
    align: 'left',
    disablePadding: false,
    label: 'Employee Name'
  },
  {
    id: 'employee_code',
    align: 'left',
    disablePadding: false,
    label: 'Employee Code'
  },
  {
    id: 'leave_title',
    align: 'left',
    disablePadding: true,
    label: 'Leave Type'
  },
  {
    id: 'leave_from',
    align: 'left',
    disablePadding: false,
    label: 'Leave From'
  },
  {
    id: 'leave_start_day',
    align: 'left',
    disablePadding: false,
    label: 'Leave Start Day'
  },
  {
    id: 'leave_to',
    align: 'left',
    disablePadding: false,
    label: 'Leave To'
  },
  {
    id: 'leave_end_day',
    align: 'left',
    disablePadding: false,
    label: 'Leave End Day'
  },
  {
    id: 'leave_day',
    align: 'left',
    disablePadding: false,
    label: 'No. of Day(s)'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Leave Status'
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Leave Action'
  }
];

const leaveTypeHeadCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
  },
  {
    id: 'type',
    align: 'left',
    disablePadding: true,
    label: 'Leave Type'
  },
  {
    id: 'default_leave',
    align: 'left',
    disablePadding: false,
    label: 'Assigned Leave'
  },
  {
    id: 'taken_leave',
    align: 'left',
    disablePadding: false,
    label: 'Taken Leave'
  },
  {
    id: 'balance_leave',
    align: 'left',
    disablePadding: false,
    label: 'Balance Leave'
  }
];

function LeaveTypeTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {leaveTypeHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

LeaveTypeTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};
// ==============================|| ORDER TABLE - STATUS ||============================== //

const LeaveStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case '0':
      color = 'warning';
      title = 'Pending';
      break;
    case '1':
      color = 'success';
      title = 'Approved';
      break;
    case '2':
      color = 'warning';
      title = 'Reject';
      break;
    default:
      color = 'info';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

LeaveStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function EmployeeLeaveTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const yearFormat = 'YYYY';

  let totalCasualLeaveCount = 0;
  let totalSickLeaveCount = 0;
  let totalPaternityLeaveCount = 0;
  let totalMaternityLeaveCount = 0;
  let totalCompensatoryOffCount = 0;
  let totalPrivilegeLeaveCount = 0;
  let totalEarnedLeaveCount = 0;

  const [casualLeaveCount, setCasualLeaveCount] = useState([]);
  const [sickLeaveCount, setSickLeaveCount] = useState([]);
  const [paternityLeaveCount, setPaternityLeaveCount] = useState([]);
  const [maternityLeaveCount, setMaternityLeaveCount] = useState([]);
  const [compensatoryOffCount, setCompensatoryOffCount] = useState([]);
  const [privilegeLeaveCount, setPrivilegeLeaveCount] = useState([]);
  const [earnedLeaveCount, setEarnedLeaveCount] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [seetingLeaveType, setSeetingLeaveType] = useState([]);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [totalApprovedLeaveDay, setTotalApprovedLeaveDay] = useState([]);
  const [totalPendingLeaveDay, setTotalPendingLeaveDay] = useState([]);
  const [totalRejectedLeaveDay, setTotalRejectedLeaveDay] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [employeeListOptions, setEmployeeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [leaveYear, setLeaveYear] = useState(String(new Date().getFullYear()));
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [yearDateRange, setYearDateRange] = useState({
    employeeId: selectedEmployee,
    year: leaveYear
  });

  let totalLeaveCount = 0;
  let totalApprovedLeaveCount = 0;
  let totalPendingLeaveCount = 0;
  let totalRejectedLeaveCount = 0;

  const loadMonthReport = () => {
    setIsSubmit(true);
    setPageLoader(true);

    setYearDateRange({ employeeId: selectedEmployee, year: leaveYear });

    if (selectedEmployee.length) {
      getEmployeeLeaves(selectedEmployee, leaveYear).then((response) => {
        setPageLoader(true);

        if (response.data.length) {
          setIsSubmit(false);
          setInfoMessage(false);

          setEmployeeLeaveDetails(response.data);

          setTotalLeaveDay(
            response.data.map((item) => {
              totalLeaveCount += Number(item.leave_day);
              return totalLeaveCount;
            })
          );

          setTotalApprovedLeaveDay(
            response.data
              .filter((item) => item.status == 1)
              .map((item) => {
                totalApprovedLeaveCount += Number(item.leave_day);
                return totalApprovedLeaveCount;
              })
          );

          setTotalPendingLeaveDay(
            response.data
              .filter((item) => item.status == 0)
              .map((item) => {
                totalPendingLeaveCount += Number(item.leave_day);
                return totalPendingLeaveCount;
              })
          );

          setTotalRejectedLeaveDay(
            response.data
              .filter((item) => item.status == 2)
              .map((item) => {
                totalRejectedLeaveCount += Number(item.leave_day);
                return totalRejectedLeaveCount;
              })
          );

          setCasualLeaveCount(
            response.data
              .filter((item) => item.leave_type == 1 && item.status == '1')
              .map((item) => {
                totalCasualLeaveCount += Number(item.leave_day);
                return totalCasualLeaveCount;
              })
          );

          setSickLeaveCount(
            response.data
              .filter((item) => item.leave_type == 2 && item.status == '1')
              .map((item) => {
                totalSickLeaveCount += Number(item.leave_day);
                return totalSickLeaveCount;
              })
          );

          setPaternityLeaveCount(
            response.data
              .filter((item) => item.leave_type == 3 && item.status == '1')
              .map((item) => {
                totalPaternityLeaveCount += Number(item.leave_day);
                return totalPaternityLeaveCount;
              })
          );

          setMaternityLeaveCount(
            response.data
              .filter((item) => item.leave_type == 4 && item.status == '1')
              .map((item) => {
                totalMaternityLeaveCount += Number(item.leave_day);
                return totalMaternityLeaveCount;
              })
          );

          setCompensatoryOffCount(
            response.data
              .filter((item) => item.leave_type == 5 && item.status == '1')
              .map((item) => {
                totalCompensatoryOffCount += Number(item.leave_day);
                return totalCompensatoryOffCount;
              })
          );

          setPrivilegeLeaveCount(
            response.data
              .filter((item) => item.leave_type == 6 && item.status == '1')
              .map((item) => {
                totalPrivilegeLeaveCount += Number(item.leave_day);
                return totalPrivilegeLeaveCount;
              })
          );

          setEarnedLeaveCount(
            response.data
              .filter((item) => item.leave_type == 7 && item.status == '1')
              .map((item) => {
                totalEarnedLeaveCount += Number(item.leave_day);
                return totalEarnedLeaveCount;
              })
          );

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setEmployeeLeaveDetails([]);
        }
      });

      getLeaveType().then((response) => {
        if (response.data) {
          setSeetingLeaveType(response.data);
        }
      });
    }
  };

  const onChange = (date, dateString) => {
    setLeaveYear(dateString);
  };

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data) {
        setEmployeeListOptions(
          response.data.map((item) => {
            return { label: `${item?.first_name} ${item?.last_name}`, value: item?.id };
          })
        );
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, [yearDateRange]);

  const handleChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const showLeaveStatusConfirm = (leaveId, status, officeEmail, firstName, lastName, employeeCode, leaveType, leaveFrom, leaveTo) => {
    confirm({
      title: status === 1 ? 'Are you sure approve this leave?' : 'Are you sure reject this leave?',
      icon:
        status === 1 ? (
          <CheckCircleFilled style={{ color: '#009688', fontSize: '32px' }} />
        ) : (
          <ExclamationCircleFilled style={{ fontSize: '32px' }} />
        ),
      content: status === 1 ? 'Make sure to approve this leave.' : 'Make sure to reject this leave.',
      okText: status === 1 ? 'Approve' : 'Reject',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        const leaveUpdateObj = {
          leaveId: +leaveId,
          leaveStatus: String(status),
          officeEmail: officeEmail,
          employeeName: `${firstName} ${lastName}`,
          employeeCode: employeeCode,
          leaveType: leaveType,
          leaveFrom: leaveFrom,
          leaveTo: leaveTo,
          leaveStatusName: status == 1 ? 'Approved' : 'Rejected'
        };

        updateLeaveStatus(leaveUpdateObj).then((response) => {
          if (response.data) {
            loadMonthReport();
          }
        });
      },
      onCancel() {}
    });
  };

  return (
    <>
      <>
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Yearly Leave Report</Typography>
          </TitleWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Flex gap={12}>
              <Select
                defaultValue={'Select'}
                style={{
                  width: 250
                }}
                onChange={handleChange}
                options={employeeListOptions}
              />
              <DatePicker
                onChange={onChange}
                defaultValue={dayjs(String(new Date().getFullYear()), yearFormat)}
                disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
                picker="year"
              />
              <Button type="primary" onClick={() => loadMonthReport()}>
                Submit
              </Button>
            </Flex>
          </MainCard>
        </Grid>
      </>

      {isSubmit && selectedEmployee === 0 && (
        <Grid item xs={12}>
          <Alert
            message="Warning Message"
            description="Please select employee from the list."
            type="warning"
            showIcon
            closable
            afterClose={() => setInfoMessage(false)}
          />
        </Grid>
      )}

      {infoMessage && (
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Empty />
        </Grid>
      )}

      {!isSubmit && pageLoader && (
        <Grid item sx={{ mt: 8 }} xs={12}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Grid>
      )}

      {!pageLoader && !infoMessage && !!employeeLeaveDetails.length && (
        <>
          <Grid item xs={12}>
            <Typography variant="h5">Overall Leave Status</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Total Leave"
              count={totalLeaveDay[totalLeaveDay.length - 1] ?? 0}
              tabIcon={<Hail style={{ fontSize: '4rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AnalyticEcommerce
              title="Approved Leave"
              count={totalApprovedLeaveDay[totalApprovedLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Pending Leave"
              count={totalPendingLeaveDay[totalPendingLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#faad14' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Rejected Leave"
              count={totalRejectedLeaveDay[totalRejectedLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item sx={{ mt: 3 }}>
                <Typography variant="h4">Employee Yealry Leave Report - {yearDateRange['year']}</Typography>
              </Grid>
              <Grid item />
            </Grid>

            <MainCard sx={{ mt: 2 }} content={false}>
              <Box>
                <TableContainer
                  sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                  }}
                >
                  <Table
                    aria-labelledby="tableTitle"
                    sx={{
                      '& .MuiTableCell-root:first-of-type': {
                        pl: 2
                      },
                      '& .MuiTableCell-root:last-of-type': {
                        pr: 3
                      }
                    }}
                  >
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                      {employeeLeaveDetails.map((row, index) => {
                        const isItemSelected = isSelected(112);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                          >
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell component="th" id={labelId} scope="row" align="left">
                              <Link color="secondary" component={RouterLink} to="">
                                {row.employee_code}
                              </Link>
                            </TableCell>
                            <TableCell align="left">
                              {row.first_name} {row.last_name}
                            </TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                            <TableCell align="left">{getFullDate(row.leave_from)}</TableCell>
                            <TableCell align="left">{getDayNameByDate(row.leave_from)}</TableCell>
                            <TableCell align="left">{getFullDate(row.leave_to)}</TableCell>
                            <TableCell align="left">{getDayNameByDate(row.leave_to)}</TableCell>
                            <TableCell align="left">{row.leave_day === '1' ? `${row.leave_day} day` : `${row.leave_day} days`}</TableCell>
                            <TableCell align="left">{LeaveStatus({ status: row.status })}</TableCell>
                            <TableCell align="left">
                              <Space split={<Divider type="vertical" />}>
                                {(row.status === '0' || row.status === '2') && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      showLeaveStatusConfirm(
                                        row.id,
                                        1,
                                        row.office_email,
                                        row.first_name,
                                        row.last_name,
                                        row.employee_code,
                                        row.type,
                                        row.leave_from,
                                        row.leave_to
                                      );
                                    }}
                                  >
                                    Approve
                                  </Button>
                                )}

                                {row.status != '2' && row.status != '3' && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      showLeaveStatusConfirm(
                                        row.id,
                                        2,
                                        row.office_email,
                                        row.first_name,
                                        row.last_name,
                                        row.employee_code,
                                        row.type,
                                        row.leave_from,
                                        row.leave_to
                                      );
                                    }}
                                    danger
                                  >
                                    Reject
                                  </Button>
                                )}
                              </Space>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={7} lg={12}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box>
                <TableContainer
                  sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                  }}
                >
                  <Table
                    aria-labelledby="tableTitle"
                    sx={{
                      '& .MuiTableCell-root:first-of-type': {
                        pl: 2
                      },
                      '& .MuiTableCell-root:last-of-type': {
                        pr: 3
                      }
                    }}
                  >
                    <LeaveTypeTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                      {seetingLeaveType.map((item, index) => {
                        const isItemSelected = isSelected(112);

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                          >
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{item.type}</TableCell>
                            <TableCell align="left">{item.default_leave}</TableCell>
                            <TableCell align="left">
                              {(item.id === '1' ? casualLeaveCount[casualLeaveCount.length - 1] : 0) ||
                                (item.id === '2' ? sickLeaveCount[sickLeaveCount.length - 1] : 0) ||
                                (item.id === '3' ? paternityLeaveCount[paternityLeaveCount.length - 1] : 0) ||
                                (item.id === '4' ? maternityLeaveCount[maternityLeaveCount.length - 1] : 0) ||
                                (item.id === '5' ? compensatoryOffCount[compensatoryOffCount.length - 1] : 0) ||
                                (item.id === '6' ? privilegeLeaveCount[privilegeLeaveCount.length - 1] : 0) ||
                                (item.id === '7' ? earnedLeaveCount[earnedLeaveCount.length - 1] : 0)}
                            </TableCell>
                            <TableCell align="left">
                              {(item.id === '1'
                                ? casualLeaveCount.length
                                  ? item.default_leave - casualLeaveCount[casualLeaveCount.length - 1]
                                  : item.default_leave
                                : 0) ||
                                (item.id === '2'
                                  ? sickLeaveCount.length
                                    ? item.default_leave - sickLeaveCount[sickLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === '3'
                                  ? paternityLeaveCount.length
                                    ? item.default_leave - paternityLeaveCount[paternityLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === '4'
                                  ? maternityLeaveCount.length
                                    ? item.default_leave - maternityLeaveCount[maternityLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === '5'
                                  ? compensatoryOffCount.length
                                    ? item.default_leave - compensatoryOffCount[compensatoryOffCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === '6'
                                  ? privilegeLeaveCount.length
                                    ? item.default_leave - privilegeLeaveCount[privilegeLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === '7'
                                  ? earnedLeaveCount.length
                                    ? item.default_leave - earnedLeaveCount[earnedLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </MainCard>
          </Grid>
        </>
      )}
    </>
  );
}
