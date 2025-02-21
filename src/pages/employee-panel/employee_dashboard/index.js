//import { useState } from 'react';

import { TitleWrapper } from '../../common/CommonStyled';

// material-ui
import { Box, Stack, Grid, Typography } from '@mui/material';

// project import
//import EmployeeProfile from './EmployeeProfile';
import Dashboard from './Dashboard';
//import MainCard from 'components/MainCard';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeDefault = () => {
  return (
    <Grid item xs={12} md={5} lg={3}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Employee Dashboad</Typography>
          </TitleWrapper>
        </Grid>
        <Grid item />
      </Grid>
      <Box sx={{ pt: 3, pb: 0 }}>
        <Stack spacing={2}>
          <Dashboard />
        </Stack>
      </Box>
    </Grid>
  );
};

export default EmployeeDefault;
