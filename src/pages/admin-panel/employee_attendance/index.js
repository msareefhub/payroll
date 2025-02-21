//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployeeAttendanceTable from './EmployeeAttendanceTable';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeList = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <EmployeeAttendanceTable />
      </Grid>
    </>
  );
};

export default EmployeeList;
