//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployeeSpecialAllowance from './EmployeeSpecialAllowance';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const SpecialAllowanceMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <EmployeeSpecialAllowance />
      </Grid>
    </>
  );
};

export default SpecialAllowanceMain;
