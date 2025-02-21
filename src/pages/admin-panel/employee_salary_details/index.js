//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import SalaryDetails from '../../common/SalaryDetails';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeSalaryDetails = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <SalaryDetails />
      </Grid>
    </>
  );
};

export default EmployeeSalaryDetails;
