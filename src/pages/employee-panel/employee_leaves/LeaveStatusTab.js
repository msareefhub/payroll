import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//import { Link as RouterLink } from 'react-router-dom';
import { getEmployeeLeaves } from '../../../api/common';

// material-ui
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';
import { DatePicker, Button, Flex } from 'antd';
import { AssignmentInd, Hail } from '@mui/icons-material';

// ==============================|| ORDER TABLE ||============================== //

export default function EmployeeTable() {
  const yearFormat = 'YYYY';
  const { employeeDetails } = useSelector((state) => state.common);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [totalApprovedLeaveDay, setTotalApprovedLeaveDay] = useState([]);
  const [totalPendingLeaveDay, setTotalPendingLeaveDay] = useState([]);
  const [totalRejectedLeaveDay, setTotalRejectedLeaveDay] = useState([]);
  const [totalCancelledLeaveDay, setTotalCancelledLeaveDay] = useState([]);

  const [leaveYear, setLeaveYear] = useState(String(new Date().getFullYear()));

  const [yearDateRange, setYearDateRange] = useState({
    employeeId: employeeDetails[0],
    year: leaveYear
  });

  const loadMonthReport = () => {
    setYearDateRange({ employeeId: yearDateRange['employeeId'], year: leaveYear });
  };

  const onChange = (date, dateString) => {
    setLeaveYear(dateString);
  };

  let totalLeaveCount = 0;
  let totalApprovedLeaveCount = 0;
  let totalPendingLeaveCount = 0;
  let totalRejectedLeaveCount = 0;
  let totalCancelledLeaveCount = 0;

  function getLeaveDetails() {
    getEmployeeLeaves(yearDateRange['employeeId'], yearDateRange['year']).then((response) => {
      if (response.data.length) {
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

        setTotalCancelledLeaveDay(
          response.data
            .filter((item) => item.status == 3)
            .map((item) => {
              totalCancelledLeaveCount += Number(item.leave_day);
              return totalCancelledLeaveCount;
            })
        );
      }
    });
  }

  useEffect(() => {
    getLeaveDetails();
    // eslint-disable-next-line
  }, [yearDateRange]);

  return (
    <>
      <>
        <Grid item xs={12}>
          <Typography variant="h5">Employee Leave Report By Month</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Flex gap={12}>
              <DatePicker
                onChange={onChange}
                defaultValue={dayjs(String(new Date().getFullYear(), yearFormat))}
                disabledDate={(current) => current.isBefore('2023')}
                picker="year"
              />
              <Button type="primary" onClick={() => loadMonthReport()}>
                Submit
              </Button>
            </Flex>
          </MainCard>
        </Grid>
      </>

      <Grid item xs={12}>
        <Typography variant="h5">Overall Leave Status</Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce
          title="Total Leave"
          count={totalLeaveDay[totalLeaveDay.length - 1] ?? 0}
          tabIcon={<Hail style={{ fontSize: '4rem', color: '#F44336' }} />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <AnalyticEcommerce
          title="Total Approved Leave"
          count={totalApprovedLeaveDay[totalApprovedLeaveDay.length - 1] ?? 0}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce
          title="Total Pending Leave"
          count={totalPendingLeaveDay[totalPendingLeaveDay.length - 1] ?? 0}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#faad14' }} />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce
          title="Total Cancelled Leave"
          count={totalCancelledLeaveDay[totalCancelledLeaveDay.length - 1] ?? 0}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#F44336' }} />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <AnalyticEcommerce
          title="Total Rejected Leave"
          count={totalRejectedLeaveDay[totalRejectedLeaveDay.length - 1] ?? 0}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#F44336' }} />}
        />
      </Grid>
    </>
  );
}
