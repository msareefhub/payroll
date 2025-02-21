//import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project import
import CompanyAnnouncement from './CompanyAnnouncement';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const CompanyAnnouncementMain = () => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2.75}>
        <CompanyAnnouncement />
      </Grid>
    </>
  );
};

export default CompanyAnnouncementMain;
