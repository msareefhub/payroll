//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import UserLoginStatus from '../../common/UserLoginStatus';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeList = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <UserLoginStatus />
      </Grid>
    </>
  );
};

export default EmployeeList;
