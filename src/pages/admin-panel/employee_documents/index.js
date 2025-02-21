//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import EmployeeDocuments from './EmployeeDocuments';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeDocumentsDetails = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <EmployeeDocuments />
      </Grid>
    </>
  );
};

export default EmployeeDocumentsDetails;
