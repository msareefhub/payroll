//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import Department from './Department';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DepartmentMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <Department />
      </Grid>
    </>
  );
};

export default DepartmentMain;
