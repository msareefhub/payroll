import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { TitleWrapper } from '../../common/CommonStyled';
import dayjs from 'dayjs';
//import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getEmpAttendanceReport,
  getEmpLeaveByMonth,
  updateLogInOutTime,
  getCurrentMonthHoliday,
  getLastUserLogin
} from '../../../api/common';
import {
  getTotalHours,
  getMonthStartDateFormat,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getCurrentMonthAndDate,
  getLastDateOfMonthByDate,
  getCalculatedTime,
  getDateFormat,
  getTimeFormat,
  getHoursMinuteFormat,
  getHoursMinuteFormatNew,
  getFullDate,
  getDayNameByDate,
  getTimeByCurrentDate,
  getYearAndMonthByDate
} from '../../../utils/utils';
import { EmployeeDetailsEnum, UserTimeSheet } from '../../../utils/enum';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';

// project import
import MainCard from 'components/MainCard';

// material-ui
import { Grid, Typography, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { Empty, DatePicker, Button, Flex, Spin, Tag, Modal, Input } from 'antd';
import { AssignmentInd, Hail } from '@mui/icons-material';

// third-party
//import NumberFormat from 'react-number-format';
// project import
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

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
    label: 'Action/Status'
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

const LeaveStatus = ({ status, title }) => {
  let color;

  switch (status) {
    case 'Half Day':
      color = 'warning';
      //title = 'Half Day';
      break;
    case 'Full Day':
      color = 'success';
      //title = 'Full Day';
      break;
    case 'Holiday':
      color = 'success';
      //title = 'Holiday';
      break;
    default:
      color = 'info';
    //title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

LeaveStatus.propTypes = {
  status: PropTypes.number,
  title: PropTypes.string
};

// ==============================|| ORDER TABLE ||============================== //

export default function EmployeeTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const monthFormat = 'YYYY-MM';
  const { employeeDetails } = useSelector((state) => state.common);
  const [pageLoader, setPageLoader] = useState(false);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [infoMessage, setInfoMessage] = useState(false);
  const [totalFullDay, setTotalFullDay] = useState([]);
  const [totalHalfDay, setTotalHalfDay] = useState([]);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [, setUserLastLoginTime] = useState([]);
  const [startMonthDate, setStartMonthDate] = useState(getMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate, setEndMonthDate] = useState(getMonthStartDateFormat(new Date(), getLastDateOfMonth()));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [logInTime, setLogInTime] = useState('');
  const [logOutTime, setLogOutTime] = useState('');

  const [currentMonthHoliday, setCurrentMonthHoliday] = useState(0);

  const [updateLogTimeDateObj, setUpdateLogTimeDateObj] = useState([
    { id: selectedRow, updatedLoginTime: logInTime, updatedLogoutTime: logOutTime }
  ]);

  let totalLeaveCount = 0;

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const [monthDateRange, setMonthDateRange] = useState({
    employeeId: employeeId,
    startDate: startMonthDate,
    endDate: endMonthDate
  });

  const updatedInOutTime = () => {
    setUpdateLogTimeDateObj({
      id: selectedRow,
      updatedLoginTime: logInTime,
      updatedLogoutTime: logOutTime
    });

    updateLogInOutTime(updateLogTimeDateObj).then((response) => {
      setIsModalOpen(false);

      if (response.data) {
        getEmpAttendance();
      }
    });
  };

  const loadMonthReport = () => {
    setMonthDateRange({ employeeId: employeeId, startDate: startMonthDate, endDate: endMonthDate });
  };

  const onChange = (date, dateString) => {
    const lastDateofMonth = getLastDateOfMonthByDate(`${dateString}-1`);
    setStartMonthDate(`${dateString}-01`);
    setEndMonthDate(`${dateString}-${lastDateofMonth}`);
  };

  const getEmpAttendance = () => {
    setPageLoader(true);

    getEmpAttendanceReport(monthDateRange['employeeId'], monthDateRange['startDate'], monthDateRange['endDate']).then((response) => {
      if (response.data.length) {
        setPageLoader(false);
        setInfoMessage(false);

        setEmployeeLeaveDetails(response.data);

        response.data.forEach((item) => {
          getLastUserLogin(monthDateRange['employeeId'], item.date).then((getLastUserLoginResponse) => {
            console.log(getLastUserLoginResponse);

            if (getLastUserLoginResponse.data.length) {
              setUserLastLoginTime(getLastUserLoginResponse.data);
            }
          });
        });

        setTotalFullDay(
          response.data
            .filter((item) => getTotalHours(item?.Log_Hours) >= 6)
            .map((item) => {
              return item.length;
            })
        );

        setTotalHalfDay(
          response.data
            .filter((item) => getTotalHours(item?.Log_Hours) < 6)
            .map((item) => {
              return item.length;
            })
        );
      } else {
        setInfoMessage(true);
        setPageLoader(false);
        setEmployeeLeaveDetails([]);
        setTotalFullDay(0);
        setTotalHalfDay(0);
      }
    });

    getEmpLeaveByMonth(monthDateRange['employeeId'], startMonthDate, endMonthDate).then((response) => {
      if (response.data.length) {
        setTotalLeaveDay(
          response.data.map((item) => {
            totalLeaveCount += Number(item.leave_day);
            return totalLeaveCount;
          })
        );
      } else {
        setTotalLeaveDay(2);
      }
    });

    getCurrentMonthHoliday(getYearAndMonthByDate(endMonthDate)).then((response) => {
      if (response.data.length) {
        setCurrentMonthHoliday(response.data.length);
      } else {
        setCurrentMonthHoliday(0);
      }
    });
  };

  useEffect(() => {
    getEmpAttendance();
    // eslint-disable-next-line
  }, [monthDateRange]);

  return (
    <>
      <>
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Monthly Attendance Details</Typography>
          </TitleWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Flex gap={12}>
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

      {!pageLoader && !infoMessage && !!employeeLeaveDetails.length && (
        <>
          <Grid item xs={12}>
            <TitleWrapper>
              <Typography variant="h5">Attendance Dashboard</Typography>
            </TitleWrapper>
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
              title="Full Working days"
              count={String(totalFullDay.length)}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Half Working Days"
              count={String(totalHalfDay.length)}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#faad14' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <AnalyticEcommerce
              title="Leaves"
              count={String(totalLeaveDay.length ? totalLeaveDay[totalLeaveDay.length - 1] : 0)}
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
              <Grid item xs={12}>
                <TitleWrapper>
                  <Typography variant="h5">Monthly Attendance</Typography>
                </TitleWrapper>
              </Grid>
              <Grid item />
            </Grid>

            <MainCard sx={{ mt: 2 }} content={false}>
              <Box>
                {infoMessage ? (
                  <Empty />
                ) : (
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
                              <TableCell align="left">{getFullDate(row?.record_date)}</TableCell>
                              <TableCell align="left">
                                {getDayNameByDate(row?.record_date) == 'Monday' ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Tag color="#009688" style={{ fontSize: '14px' }}>
                                      {getDayNameByDate(row?.record_date)}
                                    </Tag>
                                  </Stack>
                                ) : (
                                  getDayNameByDate(row?.record_date)
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {row?.is_updated == '1' &&
                                getHoursMinuteFormatNew(row?.record_date, row?.login_time, row?.last_logout_time) <
                                  UserTimeSheet.USER_FULL_DAY_HOURS ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Dot color={'warning'} />
                                    <Tag color={'#FF9800'} style={{ fontSize: '14px' }}>
                                      {getTimeFormat(row?.updated_login_time)}
                                    </Tag>
                                  </Stack>
                                ) : row?.holiday_name.length ? (
                                  '-'
                                ) : (
                                  getTimeFormat(row?.login_time)
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {row?.date == getDateFormat(new Date()) &&
                                getTimeByCurrentDate() >= row.start_shift &&
                                getTimeByCurrentDate() <= row.end_shift ? (
                                  <Tag color="#009688" style={{ fontSize: '14px' }}>
                                    In Office
                                  </Tag>
                                ) : row?.holiday_name.length ? (
                                  '-'
                                ) : (
                                  getTimeFormat(row?.last_logout_time)
                                )}
                              </TableCell>

                              <TableCell align="left">
                                {row?.date == getDateFormat(new Date()) &&
                                getTimeByCurrentDate() >= row.start_shift &&
                                getTimeByCurrentDate() <= row.end_shift ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Dot
                                      color={
                                        getTotalHours(getHoursMinuteFormat(getCalculatedTime(row?.login_time))) >=
                                        UserTimeSheet.USER_FULL_DAY_HOURS
                                          ? 'success'
                                          : 'warning'
                                      }
                                    />
                                    <Tag
                                      color={
                                        getTotalHours(getHoursMinuteFormat(getCalculatedTime(row?.login_time))) >=
                                        UserTimeSheet.USER_FULL_DAY_HOURS
                                          ? '#009688'
                                          : '#FF9800'
                                      }
                                      style={{ fontSize: '14px' }}
                                    >
                                      {getHoursMinuteFormat(getCalculatedTime(row?.login_time))}
                                    </Tag>
                                  </Stack>
                                ) : row?.holiday_name.length ? (
                                  '-'
                                ) : (
                                  getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {row?.holiday_name.length
                                  ? LeaveStatus({
                                      status: 'Holiday',
                                      title: 'Holiday'
                                    })
                                  : LeaveStatus({
                                      status:
                                        getTotalHours(getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)) >=
                                        UserTimeSheet.USER_FULL_DAY_HOURS
                                          ? 'Full Day'
                                          : 'Half Day',
                                      title:
                                        getTotalHours(getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)) >=
                                        UserTimeSheet.USER_FULL_DAY_HOURS
                                          ? 'Full Day'
                                          : 'Half Day'
                                    })}
                              </TableCell>
                              <TableCell align="left">
                                {row?.holiday_name.length ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Tag color="#009688" style={{ fontSize: '14px' }}>
                                      {row?.holiday_name}
                                    </Tag>
                                  </Stack>
                                ) : (
                                  getTotalHours(getHoursMinuteFormatNew(row?.date, row?.login_time, row?.last_logout_time)) <
                                    UserTimeSheet.USER_FULL_DAY_HOURS && (
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setSelectedRow(row?.log_id);
                                        setLogInTime(row?.is_updated == 1 ? row?.updated_login_time : row?.login_time);
                                        setLogOutTime(row?.is_updated == 1 ? row?.updated_logout_time : row?.logout_time);
                                      }}
                                    >
                                      Update
                                    </Button>
                                  )
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
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
