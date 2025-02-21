//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import HolidayList from './HolidayList';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const HolidayListMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <HolidayList />
      </Grid>
    </>
  );
};

export default HolidayListMain;
