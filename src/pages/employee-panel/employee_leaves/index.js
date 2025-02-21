//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployeeLeaveTable from './EmployeeLeaveTable';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeList = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <EmployeeLeaveTable />
      </Grid>
    </>
  );
};

export default EmployeeList;
