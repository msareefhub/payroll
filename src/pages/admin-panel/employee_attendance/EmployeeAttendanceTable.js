import { AssignmentInd, Hail } from '@mui/icons-material';
import { TitleWrapper } from '../../common/CommonStyled';
import { Box, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Alert, Button, DatePicker, Flex, Select, Spin, Empty, Tag, Modal, Input } from 'antd';
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  getEmployee,
  getEmpAttendanceReport,
  getEmpLeaveByMonth,
  updateAdminLogInOutTime,
  getCurrentMonthHoliday
} from '../../../api/common';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';
import {
  getMonthStartDateFormat,
  getTotalHours,
  getYearMonthNameByDate,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getCurrentMonthAndDate,
  getHoursMinuteFormat,
  getHoursMinuteFormatNew,
  getLastDateOfMonthByDate,
  getTimeFormat,
  getDateFormat,
  getCalculatedTime,
  getFullDate,
  getDayNameByDate,
  getTimeByCurrentDate,
  getYearAndMonthByDate
} from '../../../utils/utils';
import { UserTimeSheet } from '../../../utils/enum';

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'dya',
    align: 'left',
    disablePadding: false,
    label: 'Day'
  },
  {
    id: 'login_time',
    align: 'left',
    disablePadding: false,
    label: 'In Time'
  },
  {
    id: 'logout_time',
    align: 'left',
    disablePadding: false,
    label: 'Out Time'
  },
  {
    id: 'login_hours',
    align: 'left',
    disablePadding: false,
    label: 'Working Hours'
  },
  {
    id: 'attendance_status',
    align: 'left',
    disablePadding: false,
    label: 'Attendance Type'
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
    label: 'Action'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

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

// ==============================|| ORDER TABLE - STATUS ||============================== //

const LeaveStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'Half Day':
      color = 'warning';
      title = 'Half Day';
      break;
    case 'Full Day':
      color = 'success';
      title = 'Full Day';
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

export default function EmployeeTable() {
  let totalLeaveCount = 0;

  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const monthFormat = 'YYYY-MM';

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [totalFullDay, setTotalFullDay] = useState([]);
  const [totalHalfDay, setTotalHalfDay] = useState([]);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [employeeListOptions, setEmployeeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [startMonthDate, setStartMonthDate] = useState(getMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate, setEndMonthDate] = useState(getMonthStartDateFormat(new Date(), getLastDateOfMonth()));
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [logInTime, setLogInTime] = useState('');
  const [logOutTime, setLogOutTime] = useState('');

  const [currentMonthHoliday, setCurrentMonthHoliday] = useState(0);

  const [updateLogTimeDateObj, setUpdateLogTimeDateObj] = useState([
    { id: selectedRow, updatedLoginTime: logInTime, updatedLogoutTime: logOutTime }
  ]);

  const [monthDateRange, setMonthDateRange] = useState({
    employeeId: selectedEmployee,
    startDate: startMonthDate,
    endDate: endMonthDate
  });

  const updatedInOutTime = () => {
    setUpdateLogTimeDateObj({
      id: selectedRow,
      updatedLoginTime: logInTime,
      updatedLogoutTime: logOutTime
    });

    updateAdminLogInOutTime(updateLogTimeDateObj).then((response) => {
      setIsModalOpen(false);

      if (response.data) {
        loadMonthReport();
      }
    });
  };

  const loadMonthReport = () => {
    setIsSubmit(true);

    setMonthDateRange({ employeeId: selectedEmployee, startDate: startMonthDate, endDate: endMonthDate });

    if (selectedEmployee.length) {
      setPageLoader(true);

      getEmpAttendanceReport(selectedEmployee, startMonthDate, endMonthDate).then((response) => {
        if (response.data.length) {
          setIsSubmit(false);
          setInfoMessage(false);

          setEmployeeLeaveDetails(response.data);

          setTotalFullDay(
            response.data
              .filter((item) => getTotalHours(item.Log_Hours) >= 6)
              .map((item) => {
                return item.length;
              })
          );

          setTotalHalfDay(
            response.data
              .filter((item) => getTotalHours(item.Log_Hours) < 6)
              .map((item) => {
                return item.length;
              })
          );

          getEmpLeaveByMonth(selectedEmployee, startMonthDate, endMonthDate).then((response) => {
            if (response.data.length) {
              setTotalLeaveDay(
                response.data.map((item) => {
                  totalLeaveCount += Number(item.leave_day);
                  return totalLeaveCount;
                })
              );
            } else {
              setTotalLeaveDay(0);
            }
          });

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setEmployeeLeaveDetails([]);
          setTotalFullDay([]);
          setTotalHalfDay([]);
        }
      });
    }
  };

  const onChange = (date, dateString) => {
    const lastDateofMonth = getLastDateOfMonthByDate(`${dateString}-1`);

    setStartMonthDate(`${dateString}-01`);
    setEndMonthDate(`${dateString}-${lastDateofMonth}`);
  };

  function getEmployeeDetails() {
    getEmployee().then((response) => {
      if (response.data.length) {
        setEmployeeListOptions(
          response.data.map((item) => {
            return { label: `${item?.first_name} ${item?.last_name}`, value: item?.id };
          })
        );
      }
    });

    getCurrentMonthHoliday(getYearAndMonthByDate(endMonthDate)).then((response) => {
      if (response.data.length) {
        setCurrentMonthHoliday(response.data.length);
      } else {
        setCurrentMonthHoliday(0);
      }
    });
  }

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, [monthDateRange]);

  const handleChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  return (
    <>
      <>
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Attendance Report By Month</Typography>
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
                defaultValue={dayjs(getCurrentMonthAndDate(new Date()), monthFormat)}
                picker="month"
                disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
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
        <Grid item xs={12}>
          <Empty />
        </Grid>
      )}

      {pageLoader && (
        <Grid item sx={{ mt: 8 }} xs={12}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Grid>
      )}

      {!pageLoader && !!employeeLeaveDetails.length && (
        <>
          <Grid item xs={12}>
            <Typography variant="h5">Overall Attendance Status</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Attendance"
              count={String(
                totalFullDay.length +
                  totalHalfDay.length / 1 +
                  (totalLeaveDay.length ? totalLeaveDay[totalLeaveDay.length - 1] : 0) +
                  currentMonthHoliday
              )}
              tabIcon={<Hail style={{ fontSize: '4rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Full Working Day"
              count={totalFullDay.length}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Half Working Days"
              count={totalHalfDay.length}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#faad14' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Leaves"
              count={totalLeaveDay.length ? totalLeaveDay[totalLeaveDay.length - 1] : 0}
              tabIcon={<Hail style={{ fontSize: '4rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Holidays"
              count={String(currentMonthHoliday)}
              tabIcon={<Hail style={{ fontSize: '4rem', color: '#4CAF50' }} />}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4">{getYearMonthNameByDate(monthDateRange['startDate'], ',')}</Typography>
                <span>Employee Attendance Report</span>
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
                            <TableCell align="left">{getFullDate(row.date)}</TableCell>
                            <TableCell align="left">
                              {getDayNameByDate(row.date) == 'Monday' ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Tag color="#009688" style={{ fontSize: '14px' }}>
                                    {getDayNameByDate(row.date)}
                                  </Tag>
                                </Stack>
                              ) : (
                                getDayNameByDate(row.date)
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {row.is_updated == '1' ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Dot color={'warning'} />
                                  <Tag color={'#FF9800'} style={{ fontSize: '14px' }}>
                                    {getTimeFormat(row.updated_login_time)}
                                  </Tag>
                                </Stack>
                              ) : (
                                getTimeFormat(row.login_time)
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {row.date == getDateFormat(new Date()) &&
                              getTimeByCurrentDate() >= row.start_shift &&
                              getTimeByCurrentDate() <= row.end_shift ? (
                                <Tag color="#009688" style={{ fontSize: '14px' }}>
                                  In Office
                                </Tag>
                              ) : (
                                getTimeFormat(row.last_logout_time)
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {row.date == getDateFormat(new Date()) &&
                              getTimeByCurrentDate() >= row.start_shift &&
                              getTimeByCurrentDate() <= row.end_shift ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Dot
                                    color={
                                      getTotalHours(getHoursMinuteFormat(getCalculatedTime(row.login_time))) >=
                                      UserTimeSheet.USER_FULL_DAY_HOURS
                                        ? 'success'
                                        : 'warning'
                                    }
                                  />
                                  <Tag
                                    color={
                                      getTotalHours(getHoursMinuteFormat(getCalculatedTime(row.login_time))) >=
                                      UserTimeSheet.USER_FULL_DAY_HOURS
                                        ? '#009688'
                                        : '#FF9800'
                                    }
                                    style={{ fontSize: '14px' }}
                                  >
                                    {getHoursMinuteFormat(getCalculatedTime(row.login_time))}
                                  </Tag>
                                </Stack>
                              ) : (
                                getHoursMinuteFormatNew(row.date, row.login_time, row.last_logout_time)
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {LeaveStatus({
                                status:
                                  getTotalHours(getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)) >=
                                  UserTimeSheet.USER_FULL_DAY_HOURS
                                    ? 'Full Day'
                                    : 'Half Day'
                              })}
                            </TableCell>
                            <TableCell align="left">
                              {row.is_updated == '1' &&
                                getTotalHours(getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)) <
                                  UserTimeSheet.USER_FULL_DAY_HOURS && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      setIsModalOpen(true);
                                      setSelectedRow(row.log_id);
                                      setLogInTime(row.updated_login_time);
                                      setLogOutTime(row.updated_logout_time);

                                      setUpdateLogTimeDateObj({
                                        id: selectedRow,
                                        updatedLoginTime: row.updated_login_time,
                                        updatedLogoutTime: row.updated_logout_time
                                      });
                                    }}
                                  >
                                    Approve
                                  </Button>
                                )}
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

          <Modal
            title="Login Time Update"
            open={isModalOpen}
            onOk={() => {
              updatedInOutTime();
            }}
            okText="Submit"
            onCancel={() => {
              //setIsUpdateSubmit(false);
              setIsModalOpen(false);
            }}
            width={350}
          >
            <Grid item sx={{ minHeight: '80px', mt: 5, mb: 5 }} xs={12} sm={6} md={4} lg={12}>
              <Flex gap={12}>
                <>
                  <div>
                    Login Time:
                    <Input
                      placeholder="Login Time"
                      value={logInTime}
                      onChange={(e) => {
                        setLogInTime(e.target.value);

                        setUpdateLogTimeDateObj({
                          id: selectedRow,
                          updatedLoginTime: e.target.value,
                          updatedLogoutTime: logOutTime
                        });
                      }}
                    />
                  </div>

                  <div>
                    Logout Time:
                    <Input
                      placeholder="Login Time"
                      value={logOutTime}
                      onChange={(e) => {
                        setLogOutTime(e.target.value);

                        setUpdateLogTimeDateObj({
                          id: selectedRow,
                          updatedLoginTime: logInTime,
                          updatedLogoutTime: e.target.value
                        });
                      }}
                    />
                  </div>
                </>
              </Flex>
            </Grid>
          </Modal>
        </>
      )}
    </>
  );
}
