import { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  getWeekStartDateFormat,
  getWeekEndDateFormat,
  getDayNameByDate,
  getDateTimeToTime,
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
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const { employeeDetails } = useSelector((state) => state.common);

  const [loadEmpDetails, setLoadEmpDetails] = useState(false);
  const [loadEmpLoginDetails, setLoadEmpLoginDetails] = useState(false);

  const [employeeDataDetails, setEmployeeDataDetails] = useState([]);
  const [employeeLoginDetails, setEmployeeLoginDetails] = useState([]);
  const [employeeLoginTotalHours, setEmployeeLoginTotalHours] = useState([]);
  const [weekDateRange] = useState({
    employeeId: employeeDetails[0],
    startWeek: getWeekStartDateFormat(new Date(), 6),
    endWeek: getWeekEndDateFormat(new Date(), 6)
  });

  const [options, setOptions] = useState(barChartOptions);
  //const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  function getEmployeeDetails() {
    getEmployee().then((response) => {
      if (response.data.length) {
        setEmployeeDataDetails(response.data);
        setLoadEmpDetails(true);
      }
    });
  }

  function getEmployeeWeeklyDetails() {
    getAllEmployeeWeeklyReport(weekDateRange['startWeek'], weekDateRange['endWeek']).then((response) => {
      if (response.data.length) {
        setEmployeeLoginDetails(response.data);
        setLoadEmpLoginDetails(true);

        setOptions((prevState) => ({
          ...prevState,
          colors: [info],
          xaxis: {
            categories: employeeLoginDetails
              ?.filter((item) => getDayNameByDate(item?.date) !== 'Saturday' && getDayNameByDate(item?.date) !== 'Sunday')
              .map((item) => {
                return getShortDate(item?.date);
              }),
            labels: {
              style: {
                colors: [secondary, secondary, secondary, secondary, secondary]
              }
            }
          },
          tooltip: {
            theme: 'light'
          }
        }));
      }
    });

    getAllEmpWeeklyLoginTotalHours(weekDateRange['startWeek'], weekDateRange['endWeek']).then((response) => {
      if (response.data.length) {
        setEmployeeLoginTotalHours(response.data);
      }
    });
  }

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, [loadEmpDetails]);

  useEffect(() => {
    getEmployeeWeeklyDetails();
    // eslint-disable-next-line
  }, [loadEmpLoginDetails]);

  return (
    <div>
      <div id="chart">
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {loadEmpLoginDetails &&
            employeeDataDetails?.map((item, index) => (
              <Grid item xs={12} md={5} lg={3} key={index}>
                <MainCard sx={{ mt: 2 }} content={false}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Stack spacing={2}>
                      <Typography variant="h4" color="gray[800]">
                        {item.first_name} {item.last_name} | {item.employee_code}
                      </Typography>
                      <Typography variant="h6">
                        {employeeLoginTotalHours
                          .filter((filterItem) => filterItem.employee_id === `${item.id}`)
                          .map((data) => {
                            return `${getTotalHours(data?.Log_Hours)} of 45 Hour(s)`;
                          })}{' '}
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
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default ReportAreaChart;
