// material-ui
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { Alert } from 'antd';

// ==============================|| COMPONENTS - MESSAGE ||============================== //

const Message = ({ messageType, titleMessage, detailsMessage }) => {
  return (
    <Grid item sx={{ mb: 4 }} xs={12} md={12}>
      <Alert message={titleMessage} description={detailsMessage} type={messageType} showIcon closable />
    </Grid>
  );
};

Message.propTypes = {
  messageType: PropTypes.string,
  titleMessage: PropTypes.string,
  detailsMessage: PropTypes.string
};

export default Message;
