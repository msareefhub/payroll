// material-ui
import { Grid } from '@mui/material';
import DashboardTabs from './DashboardTabs';

//common components
import UserProfile from '../../common/UserProfile';
import UserLoginStatus from '../../common/UserLoginStatus';
import QuickLink from '../../common/QuickLink';
import Holiday from '../../common/Holiday';
import CompanyAnnouncement from '../../common/CompanyAnnouncement';

export default function Dashboard() {
  return (
    <>
      <DashboardTabs />

      <Grid container sx={{ ml: 0, mt: 0 }} rowSpacing={4.5} columnSpacing={2.75}>
        <UserProfile />
        <QuickLink />
        <Holiday />
        <CompanyAnnouncement />
      </Grid>

      <UserLoginStatus />
    </>
  );
}
