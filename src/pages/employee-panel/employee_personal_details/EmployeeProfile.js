import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
//import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
//import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getEmployee } from '../../../api/common';

import avatar1 from 'assets/images/users/img_1.jpg';

export default function EmployeeGrid() {
  const [employeeDetails, setEmployeeDetails] = useState([]);

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data.length) {
        setEmployeeDetails(response.data);
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <Grid container xs={12} sx={{ mb: 2 }}>
      {employeeDetails.map((employee, index) => {
        return (
          <Grid key={index} item xs={12} sm={6} md={4} lg={2.5}>
            <Card sx={{ maxWidth: 250 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: grey[900] }} aria-label="recipe">
                    {`${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={`${employee.first_name} ${employee.last_name}`}
                subheader={`Joinined: ${moment(employee.employment_start).format('YYYY-MM-DD')}`}
              />
              <CardMedia component="img" height="200px" image={avatar1} alt={`${employee.first_name} ${employee.last_name}`} />
              {/* <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {employee.address}
                </Typography>
              </CardContent> */}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
