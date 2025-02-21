import * as React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Loadable from '../../../components/Loadable';
import { lazy } from 'react';
import { EmployeeDetailsEnum } from '../../../utils/enum';

// material-ui
import { Tabs, Typography, Box, Tab } from '@mui/material';
import Card from '@mui/material/Card';

const PersonalView = Loadable(lazy(() => import('./PersonalView')));
const EmployeesDetails = Loadable(lazy(() => import('./EmployeesDetails')));
const Documents = Loadable(lazy(() => import('../../common/Documents')));
const BankDetails = Loadable(lazy(() => import('../../common/BankDetails')));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function PersonalDetailsTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { employeeDetails } = useSelector((state) => state.common);

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  return (
    <Card>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Personal View" {...a11yProps(0)} />
            <Tab label="Employment" {...a11yProps(1)} />
            <Tab label="Documents" {...a11yProps(2)} />
            <Tab label="Bank Details" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <PersonalView />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EmployeesDetails />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Documents employeeId={employeeId} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <BankDetails employeeId={employeeId} />
        </CustomTabPanel>
      </Box>
    </Card>
  );
}
