//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import Payslip_Wrapper from './Payslip_Wrapper';

const Payslip = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <Payslip_Wrapper />
      </Grid>
    </>
  );
};

export default Payslip;
