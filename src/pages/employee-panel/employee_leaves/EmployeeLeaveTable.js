import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { TitleWrapper } from '../../common/CommonStyled';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//import { Link as RouterLink } from 'react-router-dom';
import { addLeave, getEmployeeLeaves, updateLeave, removeLeave, getLeaveType } from '../../../api/common';
import { getDateFormat, getFullDate, getCurrentMonthAndDate, getDaysCountByTwoDates } from '../../../utils/utils';

// material-ui
import { Box, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';
import { AssignmentInd, Hail } from '@mui/icons-material';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Alert, Select, DatePicker, Button, Flex, Divider, Space, Modal, Spin, Empty } from 'antd';
import { EmployeeDetailsEnum, LeaveType, LeaveApprovalType } from '../../../utils/enum';

const { confirm } = Modal;

// project import
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const leaveHeadCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
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
    id: 'leave_to',
    align: 'left',
    disablePadding: false,
    label: 'Leave To'
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

const { RangePicker } = DatePicker;

// ==============================|| ORDER TABLE - HEADER ||============================== //

function LeaveTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {leaveHeadCells.map((headCell) => (
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

LeaveTableHead.propTypes = {
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
    case '3':
      color = 'warning';
      title = 'Cancelled';
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
  let totalApprovedLeaveCount = 0;
  let totalPendingLeaveCount = 0;
  let totalRejectedLeaveCount = 0;

  let totalCasualLeaveCount = 0;
  let totalSickLeaveCount = 0;
  let totalPaidLeaveCount = 0;

  const [casualLeaveCount, setCasualLeaveCount] = useState([]);
  const [sickLeaveCount, setSickLeaveCount] = useState([]);
  const [paidLeaveCount, setPaidLeaveCount] = useState([]);

  const [defaultCasualLeaveCount, setDefaultCasualLeaveCount] = useState(0);
  const [defaultSickLeaveCount, setDefaultSickLeaveCount] = useState(0);

  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const yearFormat = 'YYYY';
  const dateFormat = 'YYYY-MM-DD';
  const { employeeDetails } = useSelector((state) => state.common);

  const [isSubmit, setIsSubmit] = useState(false);
  const [isUpdateSubmit, setIsUpdateSubmit] = useState(false);
  const [leaveId, setLeaveId] = useState(0);
  const [updateLeaveFrom, setUpdateLeaveFrom] = useState('');
  const [updateLeaveTo, setUpdateLeaveTo] = useState('');
  const [leaveMessageType, setLeaveMessageType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [leaveBalanceExceed, setLeaveBalanceExceed] = useState(false);
  const [leaveDateRangeBalanceExceed, setLeaveDateRangeBalanceExceed] = useState(false);
  const [leaveUpdateBalanceExceed, setLeaveUpdateBalanceExceed] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [seetingLeaveType, setSeetingLeaveType] = useState([]);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [totalApprovedLeaveDay, setTotalApprovedLeaveDay] = useState([]);
  const [totalPendingLeaveDay, setTotalPendingLeaveDay] = useState([]);
  const [totalRejectedLeaveDay, setTotalRejectedLeaveDay] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [leaveDate, setLeaveDate] = useState([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);
  const [leaveDateObj, setLeaveDateObj] = useState([
    { employeeId: 0, leaveId: 1, leaveType: 0, leaveFrom: getDateFormat(new Date()), leaveTo: getDateFormat(new Date()) }
  ]);
  const [updateLeaveDateObj, setUpdateLeaveDateObj] = useState([{ id: 0, leaveId: 1, leaveType: 0, leaveFrom: '', leaveTo: '' }]);
  const [leaveYear, setLeaveYear] = useState(String(new Date().getFullYear()));
  const [defaultSelectedLeaveType, setDefaultSelectedLeaveType] = useState('Select');

  const [selectedLeaveType, setSelectedLeaveType] = useState(0);
  const [updatedSelectedLeaveType, setUpdatedSelectedLeaveType] = useState(0);
  const [leaveTypeListOptions, setLeaveTypeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const [yearDateRange, setYearDateRange] = useState({
    employeeId: employeeId,
    year: leaveYear
  });

  const loadMonthReport = () => {
    setYearDateRange({ employeeId: yearDateRange['employeeId'], year: leaveYear });
  };

  const onDateChange = (date, dateString) => {
    setLeaveYear(dateString);
  };

  const onDateRangeChange = (date, dateString) => {
    setLeaveDate([dayjs(String(dateString[0], dateFormat)), dayjs(String(dateString[1], dateFormat))]);

    let daysCountOfDateRange = getDaysCountByTwoDates(new Date(dateString[0]), new Date(dateString[1]));

    let requestCasualLeaveLeaveDays = 0;
    let requestSickLeaveCountLeaveDays = 0;

    if (selectedLeaveType == 1) {
      requestCasualLeaveLeaveDays = daysCountOfDateRange + Number(casualLeaveCount[casualLeaveCount.length - 1] ?? 0);
    } else if (selectedLeaveType == 2) {
      requestSickLeaveCountLeaveDays = daysCountOfDateRange + Number(sickLeaveCount[sickLeaveCount.length - 1] ?? 0);
    }

    if (requestCasualLeaveLeaveDays > defaultCasualLeaveCount) {
      setInfoMessage(false);
      setIsSubmit(false);
      setLeaveDateRangeBalanceExceed(true);

      setSelectedLeaveType(0);
      setDefaultSelectedLeaveType('Select');
      setLeaveDate([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);
    }

    if (requestSickLeaveCountLeaveDays > defaultSickLeaveCount) {
      setInfoMessage(false);
      setIsSubmit(false);
      setLeaveDateRangeBalanceExceed(true);

      setSelectedLeaveType(0);
      setDefaultSelectedLeaveType('Select');
      setLeaveDate([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);
    }

    setLeaveDateObj({
      employeeId: employeeId,
      leaveId: 1,
      leaveType: selectedLeaveType,
      leaveFrom: dateString[0],
      leaveTo: dateString[1]
    });
  };

  const leaveTypeHandleChange = (leaveTypeId) => {
    setSelectedLeaveType(leaveTypeId);
    setDefaultSelectedLeaveType(leaveTypeId);
    setSuccessMessage(false);
    setLeaveDateRangeBalanceExceed(false);

    if (leaveTypeId === LeaveType.CASUAL_LEAVE && casualLeaveCount[casualLeaveCount.length - 1] == defaultCasualLeaveCount) {
      setLeaveBalanceExceed(true);
    } else if (leaveTypeId === LeaveType.SICK_LEAVE && sickLeaveCount[sickLeaveCount.length - 1] == defaultSickLeaveCount) {
      setLeaveBalanceExceed(true);
    } else {
      setLeaveBalanceExceed(false);
    }

    setLeaveDateObj({
      employeeId: employeeId,
      leaveId: 1,
      leaveType: leaveTypeId,
      leaveFrom: getDateFormat(new Date()),
      leaveTo: getDateFormat(new Date())
    });
  };

  const updateLeaveTypeHandleChange = (leaveTypeId) => {
    setUpdatedSelectedLeaveType(leaveTypeId);

    if (leaveTypeId === LeaveType.CASUAL_LEAVE && casualLeaveCount[casualLeaveCount.length - 1] == defaultCasualLeaveCount) {
      setLeaveUpdateBalanceExceed(true);
    } else if (leaveTypeId === LeaveType.SICK_LEAVE && sickLeaveCount[sickLeaveCount.length - 1] == defaultSickLeaveCount) {
      setLeaveUpdateBalanceExceed(true);
    } else {
      setLeaveUpdateBalanceExceed(false);
    }

    setUpdateLeaveDateObj({
      id: +leaveId,
      leaveId: 1,
      leaveType: +leaveTypeId,
      leaveFrom: updateLeaveFrom,
      leaveTo: updateLeaveTo
    });
  };

  const onUpdateDateRangeChange = (date, dateString) => {
    let daysCountOfDateRange = getDaysCountByTwoDates(new Date(dateString[0]), new Date(dateString[1]));

    let requestCasualLeaveLeaveDays = 0;
    let requestSickLeaveCountLeaveDays = 0;

    if (selectedLeaveType == 1) {
      requestCasualLeaveLeaveDays = daysCountOfDateRange + Number(casualLeaveCount[casualLeaveCount.length - 1] ?? 0);
    } else if (selectedLeaveType == 2) {
      requestSickLeaveCountLeaveDays = daysCountOfDateRange + Number(sickLeaveCount[sickLeaveCount.length - 1] ?? 0);
    }

    if (requestCasualLeaveLeaveDays > defaultCasualLeaveCount) {
      setInfoMessage(false);
      setIsSubmit(false);
      setLeaveDateRangeBalanceExceed(true);

      setSelectedLeaveType(0);
      setDefaultSelectedLeaveType('Select');
      setLeaveDate([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);
    }

    if (requestSickLeaveCountLeaveDays > defaultSickLeaveCount) {
      setInfoMessage(false);
      setIsSubmit(false);
      setLeaveDateRangeBalanceExceed(true);

      setSelectedLeaveType(0);
      setDefaultSelectedLeaveType('Select');
      setLeaveDate([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);
    }

    setUpdateLeaveFrom(dateString[0]);
    setUpdateLeaveTo(dateString[1]);

    setUpdateLeaveDateObj({
      id: +leaveId,
      leaveId: 1,
      leaveType: +updatedSelectedLeaveType,
      leaveFrom: dateString[0],
      leaveTo: dateString[1]
    });
  };

  const applyLeave = () => {
    setIsSubmit(true);

    selectedLeaveType.length &&
      addLeave(leaveDateObj).then((response) => {
        if (response.data) {
          setIsSubmit(false);
          setSelectedLeaveType(0);
          setDefaultSelectedLeaveType('Select');
          setLeaveDate([dayjs(String(new Date(), dateFormat)), dayjs(String(new Date(), dateFormat))]);

          setSuccessMessage(true);
          setLeaveMessageType(1);
        } else {
          setLeaveMessageType(0);
          setErrorMessage(true);
        }
      });
  };

  const updatedLeaveSave = () => {
    setIsUpdateSubmit(true);

    updatedSelectedLeaveType.length &&
      updateLeave(updateLeaveDateObj).then((response) => {
        setIsModalOpen(false);

        if (response.data) {
          setIsUpdateSubmit(false);

          setLeaveMessageType(2);
          setSuccessMessage(true);
        } else {
          setLeaveMessageType(0);
          setErrorMessage(true);
        }
      });
  };

  function getLeaveDetails() {
    setPageLoader(true);

    getEmployeeLeaves(yearDateRange['employeeId'], yearDateRange['year']).then((response) => {
      if (response.data.length) {
        setInfoMessage(false);
        setPageLoader(false);

        setEmployeeLeaveDetails(response.data);

        setLeaveDateObj({
          employeeId: employeeId,
          leaveId: 1,
          leaveType: selectedLeaveType,
          leaveFrom: new Date(),
          leaveTo: new Date()
        });

        setTotalLeaveDay(
          response.data.map((item) => {
            totalLeaveCount += Number(item.leave_day);
            return totalLeaveCount;
          })
        );

        setTotalApprovedLeaveDay(
          response.data
            .filter((item) => item.status == LeaveApprovalType.APPROVED)
            .map((item) => {
              totalApprovedLeaveCount += Number(item.leave_day);
              return totalApprovedLeaveCount;
            })
        );

        setTotalPendingLeaveDay(
          response.data
            .filter((item) => item.status == LeaveApprovalType.PENDING)
            .map((item) => {
              totalPendingLeaveCount += Number(item.leave_day);
              return totalPendingLeaveCount;
            })
        );

        setTotalRejectedLeaveDay(
          response.data
            .filter((item) => item.status == LeaveApprovalType.REJECT)
            .map((item) => {
              totalRejectedLeaveCount += Number(item.leave_day);
              return totalRejectedLeaveCount;
            })
        );

        setCasualLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.CASUAL_LEAVE)
            .map((item) => {
              totalCasualLeaveCount += Number(item.leave_day);
              return totalCasualLeaveCount;
            })
        );

        setSickLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.SICK_LEAVE)
            .map((item) => {
              totalSickLeaveCount += Number(item.leave_day);
              return totalSickLeaveCount;
            })
        );

        setPaidLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.PAID_LEAVE)
            .map((item) => {
              totalPaidLeaveCount += Number(item.leave_day);
              return totalPaidLeaveCount;
            })
        );
      } else {
        setInfoMessage(true);
        setPageLoader(false);
      }
    });

    getLeaveType().then((response) => {
      if (response.data.length) {
        setSeetingLeaveType(response.data);

        setDefaultCasualLeaveCount(response.data[0]?.default_leave);
        setDefaultSickLeaveCount(response.data[1]?.default_leave);

        setLeaveTypeListOptions(
          response.data.map((item) => {
            return { label: `${item?.type}`, value: item?.id };
          })
        );
      }
    });
  }

  const showDeleteConfirm = (leaveId) => {
    confirm({
      title: 'Are you sure cancel this Leave?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeLeave(leaveId).then((response) => {
          if (response.data) {
            getLeaveDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    getLeaveDetails();
    // eslint-disable-next-line
  }, [yearDateRange, successMessage]);

  return (
    <>
      <>
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Yearly Leave Details</Typography>
          </TitleWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Flex gap={12}>
                <Select
                  defaultValue={defaultSelectedLeaveType}
                  style={{
                    width: 200
                  }}
                  value={defaultSelectedLeaveType}
                  onChange={leaveTypeHandleChange}
                  options={leaveTypeListOptions}
                />

                {!leaveBalanceExceed && (
                  <>
                    <RangePicker
                      onChange={onDateRangeChange}
                      defaultValue={leaveDate}
                      value={leaveDate}
                      format={dateFormat}
                      disabledDate={(current) => current.isBefore(getCurrentMonthAndDate(new Date()))}
                    />

                    <Button type="primary" onClick={applyLeave} disabled={!selectedLeaveType.length && !isSubmit}>
                      Apply Leave
                    </Button>
                  </>
                )}
              </Flex>

              <Flex gap={12}>
                <DatePicker
                  onChange={onDateChange}
                  defaultValue={dayjs(String(new Date().getFullYear(), yearFormat))}
                  disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
                  picker="year"
                />
                <Button type="primary" onClick={() => loadMonthReport()}>
                  Submit
                </Button>
              </Flex>
            </Grid>
          </MainCard>
        </Grid>
      </>

      {!infoMessage && errorMessage && (
        <Grid item sx={{ mb: 2 }} xs={12}>
          <Alert
            message="Error Message"
            description="Your leave request not completed. Try Again."
            type="error"
            showIcon
            closable
            afterClose={() => setErrorMessage(false)}
          />
        </Grid>
      )}

      {isSubmit && !infoMessage && selectedLeaveType === 0 && (
        <Grid item sx={{ mb: 2 }} xs={12}>
          <Alert
            message="Warning Message"
            description="Please select leave type first."
            type="warning"
            showIcon
            closable
            afterClose={() => {
              setIsSubmit(false);
              setInfoMessage(false);
            }}
          />
        </Grid>
      )}

      {!infoMessage && leaveBalanceExceed && (
        <Grid item sx={{ mb: 2 }} xs={12}>
          <Alert
            message="Warning Message"
            description="Not sufficient balance leave in your account."
            type="warning"
            showIcon
            closable
            afterClose={() => {
              setIsSubmit(false);
              setLeaveBalanceExceed(false);
            }}
          />
        </Grid>
      )}

      {!infoMessage && leaveDateRangeBalanceExceed && (
        <Grid item sx={{ mb: 2 }} xs={12}>
          <Alert
            message="Warning Message"
            description="Not sufficient leave balance in selected date range."
            type="warning"
            showIcon
            closable
            afterClose={() => {
              setIsSubmit(false);
              setLeaveBalanceExceed(false);
            }}
          />
        </Grid>
      )}

      {infoMessage && (
        <Grid item sx={{ mt: 2 }} xs={12}>
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

      {!infoMessage && successMessage && (
        <Grid item sx={{ mb: 2 }} xs={12}>
          <Alert
            message="Success Message"
            description={
              leaveMessageType === 1
                ? 'Leave requested to reporting manager for approval.'
                : 'Updated leave requested to reporting manager for approval.'
            }
            type="success"
            showIcon
            closable
            afterClose={() => setSuccessMessage(false)}
          />
        </Grid>
      )}

      {!pageLoader && !infoMessage && !!employeeLeaveDetails.length && (
        <>
          <Grid item xs={12}>
            <Typography variant="h5">Leave Dashboard</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Total Leave"
              count={totalLeaveDay[totalLeaveDay.length - 1] ?? 0}
              tabIcon={<Hail style={{ fontSize: '3rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AnalyticEcommerce
              title="Approved Leave"
              count={totalApprovedLeaveDay[totalApprovedLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '3rem', color: '#4CAF50' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Pending Leave"
              count={totalPendingLeaveDay[totalPendingLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '3rem', color: '#faad14' }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce
              title="Rejected Leave"
              count={totalRejectedLeaveDay[totalRejectedLeaveDay.length - 1] ?? 0}
              tabIcon={<AssignmentInd style={{ fontSize: '3rem', color: '#F44336' }} />}
            />
          </Grid>

          <Grid item xs={12} md={7} lg={12}>
            <MainCard content={false}>
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
                              {(item.id === LeaveType.CASUAL_LEAVE ? casualLeaveCount[casualLeaveCount.length - 1] : 0) ||
                                (item.id === LeaveType.SICK_LEAVE ? sickLeaveCount[sickLeaveCount.length - 1] : 0) ||
                                (item.id === LeaveType.PAID_LEAVE ? paidLeaveCount[paidLeaveCount.length - 1] ?? 0 : 0)}
                            </TableCell>
                            <TableCell align="left">
                              {(item.id === LeaveType.CASUAL_LEAVE
                                ? casualLeaveCount.length
                                  ? item.default_leave - casualLeaveCount[casualLeaveCount.length - 1]
                                  : item.default_leave
                                : 0) ||
                                (item.id === LeaveType.SICK_LEAVE
                                  ? sickLeaveCount.length
                                    ? item.default_leave - sickLeaveCount[sickLeaveCount.length - 1]
                                    : item.default_leave
                                  : 0) ||
                                (item.id === LeaveType.PAID_LEAVE ? (paidLeaveCount.length ? 0 : item.default_leave) : 0)}
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
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item sx={{ mt: 2 }}>
                <Typography variant="h5">Yealry Leave details - {yearDateRange['year']}</Typography>
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
                    <LeaveTableHead order={order} orderBy={orderBy} />
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
                            <TableCell align="left">{row.type}</TableCell>
                            <TableCell align="left">{getFullDate(row.leave_from)}</TableCell>
                            <TableCell align="left">{getFullDate(row.leave_to)}</TableCell>
                            <TableCell align="left">{row.leave_day === '1' ? `${row.leave_day} day` : `${row.leave_day} days`}</TableCell>
                            <TableCell align="left">{LeaveStatus({ status: row.status })}</TableCell>
                            <TableCell align="left">
                              <Space split={<Divider type="vertical" />}>
                                {row.status === '0' && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      setIsModalOpen(true);

                                      setLeaveId(row.id);
                                      setUpdateLeaveFrom(row.leave_from);
                                      setUpdateLeaveTo(row.leave_to);
                                    }}
                                  >
                                    Update
                                  </Button>
                                )}

                                {row.status === '0' && (
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      showDeleteConfirm(row.id);
                                    }}
                                    danger
                                  >
                                    Cancel
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

          <Modal
            title="Leave Update"
            open={isModalOpen}
            onOk={() => {
              updatedLeaveSave();
            }}
            okText="Update"
            onCancel={() => {
              setIsUpdateSubmit(false);
              setIsModalOpen(false);
            }}
            width={750}
          >
            <Grid item sx={{ minHeight: '80px', mt: 5, mb: 5 }} xs={12} sm={6} md={4} lg={12}>
              <Flex gap={12}>
                <>
                  <div>Leave Date: </div>

                  <Select
                    defaultValue={'Select'}
                    style={{
                      width: 200
                    }}
                    onChange={updateLeaveTypeHandleChange}
                    options={leaveTypeListOptions}
                  />

                  {!leaveUpdateBalanceExceed && (
                    <RangePicker
                      key={updateLeaveFrom}
                      onChange={onUpdateDateRangeChange}
                      defaultValue={[dayjs(String(updateLeaveFrom, dateFormat)), dayjs(String(updateLeaveTo, dateFormat))]}
                      format={dateFormat}
                      disabledDate={(current) => current.isBefore(getCurrentMonthAndDate(new Date()))}
                    />
                  )}
                </>
              </Flex>

              <Flex gap={12}>
                {isUpdateSubmit && updatedSelectedLeaveType === 0 && (
                  <Grid item sx={{ mt: 2 }} xs={12}>
                    <Alert
                      message="Warning Message"
                      description="Please select leave type first."
                      type="warning"
                      showIcon
                      closable
                      afterClose={() => {
                        setIsUpdateSubmit(false);
                        setInfoMessage(false);
                      }}
                    />
                  </Grid>
                )}

                {leaveUpdateBalanceExceed && (
                  <Grid item sx={{ mt: 2 }} xs={12}>
                    <Alert
                      message="Warning Message"
                      description="Not sufficient balance leave in your account."
                      type="warning"
                      showIcon
                      closable
                      afterClose={() => {
                        setIsSubmit(false);
                        setLeaveUpdateBalanceExceed(false);
                      }}
                    />
                  </Grid>
                )}
              </Flex>
            </Grid>
          </Modal>
        </>
      )}
    </>
  );
}
