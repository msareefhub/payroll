import { useEffect, useState } from 'react';
import { TitleWrapper } from '../../common/CommonStyled';
import { getEmployee } from '../../../api/common';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { AssignmentInd } from '@mui/icons-material';

// material-ui
import { Grid, Typography } from '@mui/material';

// ==============================|| DASHBOARD TABS ||============================== //

export default function DashboardTabs() {
  const [totalEmployee, setTotalEmployee] = useState(0);

  const [totalIndiaEmployeeCount, setTotalIndiaEmployeeCount] = useState(0);
  const [totalBelgiumEmployeeCount, setTotalBelgiumEmployeeCount] = useState(0);
  const [totalLondonEmployeeCount, setTotalLondonEmployeeCount] = useState(0);

  let totalIndiaCount = 0;
  let totalBelgiumCount = 0;
  let totalLondonCount = 0;

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data.length) {
        setTotalEmployee(response.data.length);

        response.data.map((users) => {
          if (users.country_name === 'India') {
            totalIndiaCount++;
            setTotalIndiaEmployeeCount(totalIndiaCount);
          }

          if (users.country_name === 'Belgium') {
            totalBelgiumCount++;
            setTotalBelgiumEmployeeCount(totalBelgiumCount);
          }

          if (users.country_name === 'United Kingdom') {
            totalLondonCount++;
            setTotalLondonEmployeeCount(totalLondonCount);
          }
        });
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <TitleWrapper>
          <Typography variant="h5">Dashboard</Typography>
        </TitleWrapper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Employees"
          count={String(totalEmployee)}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="London Employees"
          count={String(totalLondonEmployeeCount)}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Belgium Employees"
          count={String(totalBelgiumEmployeeCount)}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="India Employees"
          count={String(totalIndiaEmployeeCount)}
          tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
        />
      </Grid>
    </>
  );
}
