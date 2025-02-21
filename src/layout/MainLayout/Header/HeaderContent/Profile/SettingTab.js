import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { UserOutlined } from '@ant-design/icons';

const SettingTab = ({ handleToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleListItemClick = (event, url) => {
    navigate(url);
    handleToggle();
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton onClick={(event) => handleListItemClick(event, '/work-location')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Work Location" />
      </ListItemButton>

      <ListItemButton onClick={(event) => handleListItemClick(event, '/department')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Department" />
      </ListItemButton>

      <ListItemButton onClick={(event) => handleListItemClick(event, '/job-title')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Job Title" />
      </ListItemButton>

      <ListItemButton onClick={(event) => handleListItemClick(event, '/holiday-list')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Holiday List" />
      </ListItemButton>

      <ListItemButton onClick={(event) => handleListItemClick(event, '/company-announcement')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Company Announcement" />
      </ListItemButton>
    </List>
  );
};

SettingTab.propTypes = {
  handleToggle: PropTypes.func
};

export default SettingTab;
