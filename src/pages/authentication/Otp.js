// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthOtp from './auth-forms/AuthOtp';
import AuthOtpWrapper from './AuthOtpWrapper';

import CompanyLogo from '../../assets/images/login/login-logo.png';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthOtpWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <img src={CompanyLogo} alt="Van Kukil" />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Enter OTP</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthOtp />
      </Grid>
    </Grid>
  </AuthOtpWrapper>
);

export default Login;
