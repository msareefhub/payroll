import { Grid } from '@mui/material';

// project import
import WeeklyHoursLogReport from './WeeklyHoursLogReport';
import MonthlyHoursLogReport from './MonthlyHoursLogReport';

const DashboardDefault = () => {
  return (
    <Grid>
      <WeeklyHoursLogReport />
      <MonthlyHoursLogReport />
    </Grid>
  );
};

export default DashboardDefault;
