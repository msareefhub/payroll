import { useSelector } from 'react-redux';
import { UserRole } from 'utils/enum';

// material-ui
import { Grid, Card, Typography, CardHeader, Link, CardContent } from '@mui/material';

export default function QuickLink() {
  const { roleName } = useSelector((state) => state.common);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ height: 500 }}>
          <CardHeader title="Quick Link" />
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary">
              <>› </>
              <Link href={roleName[0] === UserRole.ADMIN ? '/employee-payslip' : '/pay-slip'}>Payroll Details</Link>
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              <>› </>
              <Link href="/employee-leave">Leave Details</Link>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
