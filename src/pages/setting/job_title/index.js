//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import JobTitle from './JobTitle';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const JobTitleMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <JobTitle />
      </Grid>
    </>
  );
};

export default JobTitleMain;
