import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { Avatar, Grid, Card, Box, Typography, CardHeader, CardContent } from '@mui/material';

import { getFullDate } from '../../utils/utils';
import { EmployeeDetailsEnum } from '../../utils/enum';

const UserProfileSection = ({ employeeInfo, className }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Typography variant={className} color="text.secondary" sx={{ fontSize: 16, color: 'black' }}>
        {employeeInfo}
      </Typography>
    </Box>
  );
};

const ProfileTitle = ({ title, value }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e5e5'
      }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        {title}:
      </Typography>
      <span>{value}</span>
    </Box>
  );
};

UserProfileSection.propTypes = {
  employeeInfo: PropTypes.string,
  className: PropTypes.string
};

ProfileTitle.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string
};

export default function UserProfile() {
  const { userName, employeeDetails } = useSelector((state) => state.common);

  return (
    <>
      {!!employeeDetails.length && (
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Grid item sx={{ width: '100%' }}>
            <Card sx={{ height: 500 }}>
              <CardHeader title={`Welcome`} />
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={require(`../../assets/images/users/${employeeDetails[EmployeeDetailsEnum.PROFILE_IMAGE].toString()}`)}
                  sx={{ width: 150, height: 150 }}
                />
              </CardContent>

              <CardContent sx={{ padding: 0 }}>
                <UserProfileSection employeeInfo={userName.toString()} className="overline" />
                <UserProfileSection employeeInfo={employeeDetails[EmployeeDetailsEnum.JOb_TILE].toString()} className="caption" />
              </CardContent>

              <CardContent sx={{ textAlign: 'center' }}>
                <ProfileTitle title="Employee Code" value={employeeDetails[EmployeeDetailsEnum.EMPLOYEE_CODE].toString()} />
                <ProfileTitle
                  title="Date of Joining"
                  value={getFullDate(employeeDetails[EmployeeDetailsEnum.EMPLOYMENT_START].toString())}
                />
                <ProfileTitle title="Office E-Mail" value={employeeDetails[EmployeeDetailsEnum.OFFICE_EMAIL].toString()} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
