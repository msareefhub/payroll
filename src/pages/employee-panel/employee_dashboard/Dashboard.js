// material-ui
import { Grid } from '@mui/material';

//common components
import UserProfile from '../../common/UserProfile';
import QuickLink from '../../common/QuickLink';
import Holiday from '../../common/Holiday';
import WeeklyHoursLogReport from '.././employee_login_details/WeeklyHoursLogReport';
import MonthlyHoursLogReport from '.././employee_login_details/MonthlyHoursLogReport';
import EmployeeAttendanceTab from '../employee_attendance/AttendanceStatusTab';
import CompanyAnnouncement from '../../common/CompanyAnnouncement';

// ==============================|| DASHBOARD TABS ||============================== //

export default function Dashboard() {
  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <UserProfile />
        <QuickLink />
        <Holiday />
        <CompanyAnnouncement />

        <EmployeeAttendanceTab />
      </Grid>

      <Grid>
        <WeeklyHoursLogReport />
        <MonthlyHoursLogReport />
      </Grid>
    </>
  );
}
