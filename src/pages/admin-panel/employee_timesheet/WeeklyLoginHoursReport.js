import { useState } from 'react';
import { TitleWrapper } from '../../common/CommonStyled';
import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Button, DatePicker, Flex, Spin, Empty } from 'antd';
import { UserTimeSheet } from '../../../utils/enum';

// material-ui
dayjs.extend(customParseFormat);

import {
  getWeekStartDateFormat,
  getWeekEndDateFormat,
  getDateTimeToTime,
  getDayNameByDate,
  getTotalHours,
  getShortDate
} from '../../../utils/utils';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getEmployee, getAllEmployeeWeeklyReport, getAllEmpWeeklyLoginTotalHours } from '../../../api/common';

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
  const weekFormat = 'YYYY-MM-DD';
  const [infoMessage, setInfoMessage] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [options, setOptions] = useState(barChartOptions);
  const [employeeDataDetails, setEmployeeDataDetails] = useState([]);
  const [employeeLoginDetails, setEmployeeLoginDetails] = useState([]);
  const [employeeLoginTotalHours, setEmployeeLoginTotalHours] = useState([]);
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value).endOf('week').format(weekFormat)}`;
  const [startWeekDate, setStartWeekDate] = useState(getWeekStartDateFormat(new Date(), 6));
  const [endWeekDate, setEndWeekDate] = useState(getWeekEndDateFormat(new Date()));

  const onChange = (date, dateString) => {
    let weekDate = dateString.split('~');
    setStartWeekDate(getWeekEndDateFormat(new Date(weekDate[0])));
    setEndWeekDate(getWeekEndDateFormat(new Date(weekDate[1])));
  };

  const loadWeekReport = () => {
    setPageLoader(true);

    getEmployee().then((response) => {
      if (response.data.length) {
        setEmployeeDataDetails(response.data);
      }
    });

    getAllEmployeeWeeklyReport(startWeekDate, endWeekDate).then((response) => {
      if (response.data.length) {
        setInfoMessage(false);
        setPageLoader(false);

        setEmployeeLoginDetails(response.data);

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            categories: employeeLoginDetails
              ?.filter((item) => getDayNameByDate(item?.date) !== 'Saturday' && getDayNameByDate(item?.date) !== 'Sunday')
              .map((item) => {
                return getShortDate(item.date);
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

    getAllEmpWeeklyLoginTotalHours(startWeekDate, endWeekDate).then((response) => {
      if (response.data.length) {
        setEmployeeLoginTotalHours(response.data);
      }
    });
  };

  return (
    <div>
      <div id="chart">
        <Grid container rowSpacing={2.5} columnSpacing={2.75}>
          <>
            <Grid item xs={12}>
              <TitleWrapper>
                <Typography variant="h5">Weekly Login Time Report</Typography>
              </TitleWrapper>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={11.9}>
              <MainCard sx={{ p: 4 }} content={false}>
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

          {!pageLoader &&
            !infoMessage &&
            !!employeeLoginDetails.length &&
            employeeDataDetails.map((item, index) => (
              <Grid item xs={12} md={5} lg={4} key={index}>
                {employeeLoginTotalHours
                  .filter((filterItem) => filterItem.employee_id === `${item.id}`)
                  .map((data, itemIndex) => {
                    return (
                      <MainCard sx={{ mt: 2 }} content={false} key={itemIndex}>
                        <Box sx={{ p: 3, pb: 0 }}>
                          <Stack spacing={2}>
                            <Typography variant="h4" color="gray[800]">
                              {item.first_name} {item.last_name} | {item.employee_code}
                            </Typography>
                            <Typography variant="h6">
                              {getTotalHours(data.Log_Hours)} of {UserTimeSheet.USER_LOGIN_HOURS * UserTimeSheet.WEEK_DAYS} Hour(s)
                            </Typography>
                          </Stack>
                        </Box>
                        <ReactApexChart
                          options={options}
                          series={[
                            {
                              name: 'Loged Hours',
                              data: employeeLoginDetails
                                .filter(
                                  (filterItem) =>
                                    filterItem.employee_id === `${item.id}` &&
                                    getDayNameByDate(filterItem?.date) !== 'Saturday' &&
                                    getDayNameByDate(filterItem?.date) !== 'Sunday'
                                )
                                .map((data) => {
                                  return getDateTimeToTime(data?.Log_Hours);
                                })
                            }
                          ]}
                          type="bar"
                          height={365}
                        />
                      </MainCard>
                    );
                  })}
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default ReportAreaChart;
