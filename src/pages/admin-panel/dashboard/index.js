// material-ui
import { Grid } from '@mui/material';

// component import
import Dashboard from './Dashboard';

export default function DashboardDefault() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Dashboard />
    </Grid>
  );
}
