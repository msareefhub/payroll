import { useState, useEffect } from 'react';
import { getCompanyAnnouncement } from '../../api/common';

// material-ui
import { Grid, Card, CardHeader, CardContent, Typography, Divider } from '@mui/material';

// ant-design
import { Tag } from 'antd';

const CompanyAnnouncement = () => {
  const [companyAnnouncement, setCompanyAnnouncement] = useState([]);

  const getCompanyAnnouncementDetails = () => {
    getCompanyAnnouncement().then((response) => {
      if (response.data.length) {
        setCompanyAnnouncement(response.data);
      }
    });
  };

  useEffect(() => {
    getCompanyAnnouncementDetails();
  }, []);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ height: 500 }}>
          <CardHeader title="Company Announcement" />
          <div style={{ overflowY: 'auto', maxHeight: '450px', marginRight: '10px' }}>
            {companyAnnouncement.map((item, index) => {
              return (
                <CardContent key={index}>
                  <Tag color="blue"> {item.announcement_date}</Tag>

                  <Grid item sx={{ mt: 1 }}>
                    <Typography variant="title" color="text.primary">
                      {item.title}
                    </Typography>
                  </Grid>

                  <Divider sx={{ mb: 1 }} />

                  <Typography variant="body2" color="text.secondary">
                    {item.message}
                  </Typography>
                </CardContent>
              );
            })}
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CompanyAnnouncement;
