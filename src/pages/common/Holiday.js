import { useState, useEffect } from 'react';
import { getHolidaysList } from '../../api/common';
import { getFullDate, getDayNameByDate } from '../../utils/utils';

// material-ui
import { Grid, Card, CardHeader, CardContent, Typography, Divider } from '@mui/material';

const Holiday = () => {
  const [holidaysList, setHolidaysList] = useState([]);

  const getListOfHolidays = () => {
    getHolidaysList().then((response) => {
      if (response.data.length) {
        setHolidaysList(response.data);
      }
    });
  };

  useEffect(() => {
    getListOfHolidays();
  }, []);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ height: 500 }}>
          <CardHeader title="Holidays" />
          <CardContent style={{ overflowY: 'auto', maxHeight: '450px', marginRight: '10px' }}>
            {holidaysList.map((item, index) => {
              return (
                <Grid item sx={{ width: '100%' }} key={index}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <div>
                      <Typography variant="subtitle1" color="text.primary">
                        {item.holiday_name}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" textAlign="left">
                        {getDayNameByDate(item.holiday_date)}
                      </Typography>
                    </div>
                    <Typography variant="subtitle1" color="text.secondary">
                      {getFullDate(item.holiday_date)}
                    </Typography>
                  </Grid>

                  <Divider sx={{ mt: 0.5, mb: 0.5 }} />
                </Grid>
              );
            })}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Holiday;
