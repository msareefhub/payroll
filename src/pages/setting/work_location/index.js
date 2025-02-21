//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import WorkLocation from './WorkLocation';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const WorkLocationMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <WorkLocation />
      </Grid>
    </>
  );
};

export default WorkLocationMain;
