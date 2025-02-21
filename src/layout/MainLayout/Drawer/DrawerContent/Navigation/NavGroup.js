import { Box, List, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginUserById } from '../../../../../api/common';
//import { getLoginUserById, updateLoginTime, checkEmpLoginStartTime } from '../../../../../api/common';
import { setEmployeeDetails, setRoleName, setUserName } from 'store/reducers/common';
//import { getDateFormat, getTimeByCurrentDate } from '../../../../../utils/utils';
//import { UserRole } from '../../../../../utils/enum';

import NavItem from './NavItem';

// material-ui
// project import
// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;
  const { roleName } = useSelector((state) => state.common);

  if (roleName[0] == null) {
    const getEmployeeId = JSON.parse(localStorage.getItem('appid'));

    getLoginUserById(getEmployeeId).then((response) => {
      if (response.data.length) {
        //setStatus({ success: true });
        //setSubmitting(true);

        //response.data);

        localStorage.setItem('appid', JSON.stringify(response.data[0]?.employee_id));

        dispatch(
          setEmployeeDetails({
            employeeDetails: [
              response.data[0]?.employee_id,
              response.data[0]?.employee_code,
              response.data[0]?.employment_start,
              response.data[0]?.office_email,
              response.data[0]?.profile_image,
              response.data[0]?.job_title,
              response.data[0]?.date_of_birth,
              response.data[0]?.gender_name,
              response.data[0]?.personal_email,
              response.data[0]?.primary_contact,
              response.data[0]?.secondary_contact,
              response.data[0]?.city_name
            ]
          })
        );

        // if (response.data[0]?.role_name === UserRole.EMPLOYEE) {
        //   checkEmpLoginStartTime(response.data[0]?.employee_id, getDateFormat(new Date())).then((checjkResponse) => {
        //     if (checjkResponse.data.length === 0) {
        //       updateLoginTime(response.data[0]?.employee_id, getDateFormat(new Date()), getTimeByCurrentDate());
        //     }
        //   });
        // }

        dispatch(setRoleName({ roleName: [`${response.data[0]?.role_name}`] }));
        dispatch(setUserName({ userName: [`${response.data[0]?.first_name} ${response.data[0]?.last_name}`] }));

        // switch (response.data[0]?.role_name) {
        //   case 'Admin':
        //     return navigate('/admin-dashboard');
        //   case 'Employee':
        //     return navigate('/employee-dashboard');
        //   default:
        // }
      } else {
        navigate('/');

        //setStatus({ success: false });
        //setErrors({ submit: response.data.error });
        //setSubmitting(false);
      }
    });

    // dispatch(
    //   setEmployeeDetails({
    //     employeeDetails: [getEmployeeId, 1001, '2020-02-24', 'mohsin@gmail.com', 'img_01.jpg', 'Co-Founder', '1985-10-05', 1]
    //   })
    // );

    // dispatch(setRoleName({ roleName: [`Admin`] }));
    // dispatch(setUserName({ userName: [`Mohsin Seikh`] }));
  }

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.role) {
      // case 'collapse':
      //   return (
      //     <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
      //       collapse - only available in paid version
      //     </Typography>
      //   );
      case roleName[0]:
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
      // return (
      //   <Typography key={menuItem.id} variant="h6" color="error" align="center">
      //     Fix - Group Collapse or Items
      //   </Typography>
      // );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
