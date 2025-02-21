//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployeeBank from './EmployeeBank';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeBankDetails = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <EmployeeBank />
      </Grid>
    </>
  );
};

export default EmployeeBankDetails;
