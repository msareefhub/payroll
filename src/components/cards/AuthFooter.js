// material-ui
import { Container, Link, Stack, Typography, useMediaQuery } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          {`Copyright ©2020 - ${new Date().getFullYear()} - HR Payroll`}{' '}
        </Typography>

        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
          <>
            <Typography
              variant="subtitle2"
              color="secondary"
              component={Link}
              href="https://vankukil.com/contact-us"
              target="_blank"
              underline="hover"
            >
              Support
            </Typography>

            <Typography variant="subtitle2" color="secondary" component="span">
              Managed By{' '}
              <Typography component={Link} variant="subtitle2" href="https://vankukil.com" target="_blank" underline="hover">
                Vankukil
              </Typography>
            </Typography>
          </>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
