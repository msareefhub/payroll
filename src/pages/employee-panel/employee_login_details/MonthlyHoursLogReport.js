import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { TitleWrapper } from '../../common/CommonStyled';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Empty, Button, DatePicker, Flex, Spin } from 'antd';
import { EmployeeDetailsEnum, UserTimeSheet } from '../../../utils/enum';
import MainCard from 'components/MainCard';

// material-ui
import {
  getDateTimeToTime,
  getDayNameByDate,
  getTotalHours,
  getShortDate,
  getMonthStartDateFormat,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  getCurrentMonthAndDate,
  getLastDateOfMonthByDate
} from '../../../utils/utils';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getEmpAttendanceReport, getEmpWeeklyLoginTotalHours } from '../../../api/common';
import { useSelector } from 'react-redux';

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
  const monthFormat = 'YYYY-MM';

  const { userName, employeeDetails } = useSelector((state) => state.common);
  const [employeeLoginDetails, setEmployeeLoginDetails] = useState([]);
  const [employeeLoginTotalHours, setEmployeeLoginTotalHours] = useState('');
  const [options, setOptions] = useState(barChartOptions);
  const [infoMessage, setInfoMessage] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [startMonthDate, setStartMonthDate] = useState(getMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate, setEndMonthDate] = useState(getMonthStartDateFormat(new Date(), getLastDateOfMonth()));

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const loadmonthlyReport = () => {
    setPageLoader(true);

    getEmpAttendanceReport(employeeId, startMonthDate, endMonthDate).then((response) => {
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
                return getShortDate(item?.date);
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

    getEmpWeeklyLoginTotalHours(employeeId, startMonthDate, endMonthDate).then((response) => {
      if (response.data.length) {
        setEmployeeLoginTotalHours(response.data[0]?.Log_Hours);
      }
    });
  };

  const onChange = (date, dateString) => {
    const lastDateofMonth = getLastDateOfMonthByDate(`${dateString}-1`);
    setStartMonthDate(`${dateString}-01`);
    setEndMonthDate(`${dateString}-${lastDateofMonth}`);
  };

  useEffect(() => {
    loadmonthlyReport();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div id="chart">
        <Grid container rowSpacing={4.5}>
          <Grid item xs={12} md={5} lg={11.8} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TitleWrapper>
                <Typography variant="h5">Monthly Login Details</Typography>
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
                      {getTotalHours(employeeLoginTotalHours)} of{' '}
                      {UserTimeSheet.USER_LOGIN_HOURS * getLastDateOfMonthByDate(startMonthDate)} Hour(s)
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Flex gap={12}>
                    <DatePicker
                      onChange={onChange}
                      defaultValue={dayjs(getCurrentMonthAndDate(new Date()), monthFormat)}
                      picker="month"
                      disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
                    />
                    <Button type="primary" onClick={() => loadmonthlyReport()}>
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
                          return getDateTimeToTime(data?.Log_Hours);
                        })
                    }
                  ]}
                  type="bar"
                  height={250}
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
