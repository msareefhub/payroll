import React, { useEffect, useState } from 'react';
import { TitleWrapper } from '../../common/CommonStyled';
import { Grid, Typography } from '@mui/material';
import { Select, Button, Flex } from 'antd';
import MainCard from 'components/MainCard';
import SpecialAllowance from '../../common/SpecialAllowance';
import { getEmployee } from '../../../api/common';

export default function EmployeeSpecialAllowance() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [currentEmployee, setCurrentEmployee] = useState(0);
  const [employeeListOptions, setEmployeeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const employeeNameHandleChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const loadEmployeeDetails = () => {
    setIsSubmit(true);
    setCurrentEmployee(selectedEmployee);
  };

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data) {
        setEmployeeListOptions(
          response.data.map((item) => {
            return { label: `${item?.first_name} ${item?.last_name}`, value: item?.id };
          })
        );
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Grid item xs={12} md={7} lg={12}>
        <Grid item xs={12} md={7} lg={12}>
          <TitleWrapper>
            <Typography variant="h5">Special Allowances Details List</Typography>
          </TitleWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Flex gap={12}>
              <Select
                defaultValue={'Select'}
                style={{
                  width: 250
                }}
                onChange={employeeNameHandleChange}
                options={employeeListOptions}
              />
              <Button type="primary" onClick={() => loadEmployeeDetails()}>
                Submit
              </Button>
            </Flex>
          </MainCard>
        </Grid>

        {isSubmit && <SpecialAllowance employeeId={currentEmployee} />}
      </Grid>
    </>
  );
}
