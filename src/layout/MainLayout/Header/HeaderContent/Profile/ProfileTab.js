import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { UserRole } from 'utils/enum';

const ProfileTab = ({ handleLogout, handleToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { roleName } = useSelector((state) => state.common);

  const handleListItemClick = (event, url) => {
    handleToggle();
    navigate(url);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton
        onClick={(event) => handleListItemClick(event, roleName[0] === UserRole.ADMIN ? '/admin-dashboard' : '/employee-dashboard')}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
  handleToggle: PropTypes.func
};

export default ProfileTab;
