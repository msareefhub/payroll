import { Box, Grid, Stack, Typography } from '@mui/material';
import { Empty, Button, DatePicker, Flex, Spin } from 'antd';
import { TitleWrapper } from '../../common/CommonStyled';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { EmployeeDetailsEnum, UserTimeSheet } from '../../../utils/enum';

import { getEmpAttendanceReport, getEmpWeeklyLoginTotalHours } from '../../../api/common';
import {
  getCalculatedTime,
  getDayNameByDate,
  getTotalHours,
  getWeekEndDateFormat,
  getWeekStartDateFormat,
  getDateTimeToTime,
  getDateFormat
} from '../../../utils/utils';

// material-ui
dayjs.extend(customParseFormat);

// third-party
// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const ReportAreaChart = () => {
  const { userName, employeeDetails } = useSelector((state) => state.common);

  const [employeeLoginDetails, setEmployeeLoginDetails] = useState([]);
  const [employeeLoginTotalHours, setEmployeeLoginTotalHours] = useState('');
  const [options, setOptions] = useState(barChartOptions);
  const [infoMessage, setInfoMessage] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);

  const weekFormat = 'YYYY-MM-DD';

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value).endOf('week').format(weekFormat)}`;

  const [startWeekDate, setStartWeekDate] = useState(getWeekStartDateFormat(new Date(), 6));
  const [endWeekDate, setEndWeekDate] = useState(getWeekEndDateFormat(new Date()));

  const [weekDateRange, setWeekDateRange] = useState({
    employeeId: employeeId,
    startDate: startWeekDate,
    endDate: endWeekDate
  });

  const loadWeekReport = () => {
    setWeekDateRange({ employeeId: employeeId, startDate: startWeekDate, endDate: endWeekDate });
  };

  const onChange = (date, dateString) => {
    let weekDate = dateString.split('~');
    setStartWeekDate(getWeekEndDateFormat(new Date(weekDate[0])));
    setEndWeekDate(getWeekEndDateFormat(new Date(weekDate[1])));
  };

  function getEmployeeWeeklyDetails() {
    setPageLoader(true);

    getEmpAttendanceReport(weekDateRange['employeeId'], weekDateRange['startDate'], weekDateRange['endDate']).then((response) => {
      if (response.data.length) {
        setInfoMessage(false);
        setPageLoader(false);

        setEmployeeLoginDetails(response.data);

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories: response.data
              ?.filter((item) => getDayNameByDate(item?.date) !== 'Saturday' && getDayNameByDate(item?.date) !== 'Sunday')
              .map((item) => {
                return item?.date + ', ' + getDayNameByDate(item?.date);
              })
          },
          tooltip: {
            theme: 'light'
          }
        }));
      } else {
        setInfoMessage(true);
        setPageLoader(false);
      }
    });

    getEmpWeeklyLoginTotalHours(weekDateRange['employeeId'], weekDateRange['startDate'], weekDateRange['endDate']).then((response) => {
      if (response.data.length) {
        setEmployeeLoginTotalHours(response.data[0]?.Log_Hours);
      }
    });
  }

  useEffect(() => {
    getEmployeeWeeklyDetails();
    // eslint-disable-next-line
  }, [weekDateRange]);

  return (
    <div>
      <div id="chart">
        <Grid container rowSpacing={4.5}>
          <Grid item xs={12} md={5} lg={11.8}>
            <Grid item xs={12}>
              <TitleWrapper>
                <Typography variant="h5">Weekly Login Details</Typography>
              </TitleWrapper>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Stack spacing={2}>
                    <Typography variant="h4" color="gray[800]">
                      {userName.toString()} | {employeeDetails[EmployeeDetailsEnum.EMPLOYEE_CODE]}
                    </Typography>
                    <Typography variant="h6">
                      {getTotalHours(employeeLoginTotalHours)} of {UserTimeSheet.USER_LOGIN_HOURS * UserTimeSheet.WEEK_DAYS} Hour(s)
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: 3, pb: 0 }}>
                  <Flex gap={12}>
                    <DatePicker
                      onChange={onChange}
                      defaultValue={dayjs()}
                      format={customWeekStartEndFormat}
                      picker="week"
                      disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
                    />
                    <Button type="primary" onClick={() => loadWeekReport()}>
                      Submit
                    </Button>
                  </Flex>
                </Box>
              </Grid>

              {infoMessage && (
                <Grid item sx={{ p: 5 }} xs={12}>
                  <Empty />
                </Grid>
              )}

              {pageLoader && (
                <Grid item sx={{ p: 8 }} xs={12}>
                  <Spin tip="Loading" size="large">
                    <div className="content" />
                  </Spin>
                </Grid>
              )}

              {!pageLoader && !infoMessage && !!employeeLoginDetails.length && (
                <ReactApexChart
                  options={options}
                  series={[
                    {
                      name: 'Loged Hours',
                      data: employeeLoginDetails
                        .filter((item) => getDayNameByDate(item?.date) !== 'Saturday' && getDayNameByDate(item?.date) !== 'Sunday')
                        .map((data) => {
                          return data.date == getDateFormat(new Date())
                            ? getCalculatedTime(data.login_time)
                            : getDateTimeToTime(data?.Log_Hours);
                        })
                    }
                  ]}
                  type="bar"
                  height={220}
                />
              )}
            </MainCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ReportAreaChart;
