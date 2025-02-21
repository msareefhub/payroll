import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getEmployeeAge } from '../../../utils/utils';

// material-ui
import { Grid, Box } from '@mui/material';

// project import
import Typography from '@mui/material/Typography';
import { getFullDate } from '../../../utils/utils';
import { EmployeeDetailsEnum } from '../../../utils/enum';

// ==============================|| DASHBOARD TABS ||============================== //

const UserProfile = ({ employeeInfo, className }) => {
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

UserProfile.propTypes = {
  employeeInfo: PropTypes.string,
  className: PropTypes.string
};

ProfileTitle.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string
};

export default function DashboardTabs() {
  const { userName, employeeDetails } = useSelector((state) => state.common);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={18}>
      <Grid item xs={12} sm={6} md={4} lg={6}>
        <ProfileTitle title="Employee Code" value={employeeDetails[EmployeeDetailsEnum.EMPLOYEE_CODE]} />
        <ProfileTitle title="Full Name" value={userName.toString()} />
        <ProfileTitle title="Personal E-Mail" value={employeeDetails[EmployeeDetailsEnum.PERSONAL_EMAIL]} />
        <ProfileTitle title="Gender" value={employeeDetails[EmployeeDetailsEnum.GENDER]} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={6}>
        <ProfileTitle title="Primary Contact" value={employeeDetails[EmployeeDetailsEnum.PRIMARY_CONTACT]} />
        <ProfileTitle title="Secondary Contact" value={employeeDetails[EmployeeDetailsEnum.SECONDARY_CONTACT]} />
        <ProfileTitle title="Date of Birth" value={getFullDate(employeeDetails[EmployeeDetailsEnum.DATE_OF_BIRTH])} />
        <ProfileTitle title="Age" value={getEmployeeAge(employeeDetails[EmployeeDetailsEnum.DATE_OF_BIRTH])} />
      </Grid>
    </Grid>
  );
}
