import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { addEmployee, getEmployeeDetailsById, updateEmployee } from '../../../api/common';
import { getDateFormat } from '../../../utils/utils';
import { Button, Select, MenuItem, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

import { useSelector, useDispatch } from 'react-redux';
import { setEmployeeEditStatus } from 'store/reducers/common';

import { DatePicker } from 'antd';

const AddEditEmployee = () => {
  let dateFormat = 'YYYY-MM-DD';
  let currentDate = getDateFormat(new Date());

  const dispatch = useDispatch();
  const { employeeEditStatus, currentEmployeeId } = useSelector((state) => state.common);

  const [employeeDefaultData, setEmployeeDefaultData] = useState({
    firstName: '',
    lastname: '',
    dob: currentDate,
    jobTitle: 2,
    department: 1,
    gender: 1,
    address: '',
    city: 2,
    personalemail: '',
    officeemail: '',
    primarycontact: '',
    secondarycontact: '',
    doj: currentDate
  });

  const loadEmployeeData = () => {
    if (employeeEditStatus === 'edit') {
      getEmployeeDetailsById(currentEmployeeId).then((response) => {
        if (response.data.length) {
          setEmployeeDefaultData({
            firstName: response.data[0]?.first_name,
            lastname: response.data[0]?.last_name,
            dob: response.data[0]?.date_of_birth,
            jobTitle: response.data[0]?.job_title_id,
            department: response.data[0]?.department_id,
            gender: response.data[0]?.gender_id,
            address: response.data[0]?.address,
            city: response.data[0]?.city_id,
            personalemail: response.data[0]?.personal_email,
            officeemail: response.data[0]?.office_email,
            primarycontact: response.data[0]?.primary_contact,
            secondarycontact: response.data[0]?.secondary_contact,
            doj: response.data[0]?.employment_start
          });
        }
      });
    }
  };

  useEffect(() => {
    loadEmployeeData();
    // eslint-disable-next-line
  }, [currentEmployeeId]);

  useEffect(() => {
    dispatch(setEmployeeEditStatus({ employeeEditStatus: 'add' }));
  }, [dispatch]);

  const getAddEditValue = (formValue, editValue) => {
    return employeeEditStatus === 'edit' ? editValue : formValue;
  };

  return (
    <>
      <Formik
        initialValues={{
          firstname: employeeDefaultData.firstName,
          lastname: employeeDefaultData.lastname,
          address: employeeDefaultData.address,
          officeemail: employeeDefaultData.officeemail,
          personalemail: employeeDefaultData.personalemail,
          primarycontact: employeeDefaultData.primarycontact,
          secondarycontact: employeeDefaultData.secondarycontact,
          jobTitle: employeeDefaultData.jobTitle,
          department: employeeDefaultData.department,
          gender: employeeDefaultData.gender,
          city: employeeDefaultData.city,
          dob: employeeDefaultData.dob,
          doj: employeeDefaultData.doj,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          address: Yup.string().max(255).required('Address is required'),
          officeemail: Yup.string().email('Must be a valid email').max(255).required('Office Email is required'),
          personalemail: Yup.string().email('Must be a valid email').max(255).required('Personal Email is required'),
          primarycontact: Yup.string().max(255).required('Contact Number is required'),
          secondarycontact: Yup.string().max(255).required('Contact Number is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            //setStatus({ success: false });
            //setSubmitting(false);

            if (employeeEditStatus === 'edit') {
              setFieldValue('firstname', employeeDefaultData.firstName);

              updateEmployee(
                currentEmployeeId,
                values.firstname,
                values.lastname,
                values.dob,
                values.jobTitle,
                values.department,
                values.gender,
                values.address,
                values.city,
                values.personalemail,
                values.officeemail,
                values.primarycontact,
                values.secondarycontact,
                values.doj
              );
            } else {
              addEmployee(
                values.firstname,
                values.lastname,
                values.dob,
                values.jobTitle,
                values.department,
                values.gender,
                values.address,
                values.city,
                values.personalemail,
                values.officeemail,
                values.primarycontact,
                values.secondarycontact,
                values.doj
              );
            }
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="firstname"
                    value={getAddEditValue(values.firstname, employeeDefaultData.firstName)}
                    name="firstname"
                    onBlur={(e) => {
                      setFieldValue('firstname', setEmployeeDefaultData({ firstName: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('firstname', setEmployeeDefaultData({ firstName: e.target.value }));
                    }}
                    placeholder="First Name"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="lastname"
                    value={getAddEditValue(values.lastname, employeeDefaultData.lastname)}
                    name="lastname"
                    onBlur={(e) => {
                      setFieldValue('lastname', setEmployeeDefaultData({ lastname: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('lastname', setEmployeeDefaultData({ lastname: e.target.value }));
                    }}
                    placeholder="Last Name"
                    inputProps={{}}
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="office-email">Office Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.officeemail && errors.officeemail)}
                    id="office-email"
                    type="email"
                    value={getAddEditValue(values.officeemail, employeeDefaultData.officeemail)}
                    name="officeemail"
                    onBlur={(e) => {
                      setFieldValue('officeemail', setEmployeeDefaultData({ officeemail: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('officeemail', setEmployeeDefaultData({ officeemail: e.target.value }));
                    }}
                    placeholder="Office Email"
                    inputProps={{}}
                  />
                  {touched.officeemail && errors.officeemail && (
                    <FormHelperText error id="helper-text-office-email">
                      {errors.officeemail}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-email">Personal Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.personalemail && errors.personalemail)}
                    id="personal-email"
                    type="email"
                    value={getAddEditValue(values.personalemail, employeeDefaultData.personalemail)}
                    name="personalemail"
                    onBlur={(e) => {
                      setFieldValue('personalemail', setEmployeeDefaultData({ personalemail: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('personalemail', setEmployeeDefaultData({ personalemail: e.target.value }));
                    }}
                    placeholder="Personal Email"
                    inputProps={{}}
                  />
                  {touched.personalemail && errors.personalemail && (
                    <FormHelperText error id="helper-text-personal-email">
                      {errors.personalemail}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="primary-contact">Primary Contact*</InputLabel>
                  <OutlinedInput
                    id="primary-contact"
                    type="primarycontact"
                    value={getAddEditValue(values.primarycontact, employeeDefaultData.primarycontact)}
                    name="primarycontact"
                    onBlur={(e) => {
                      setFieldValue('primarycontact', setEmployeeDefaultData({ primarycontact: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('primarycontact', setEmployeeDefaultData({ primarycontact: e.target.value }));
                    }}
                    placeholder="Primary Contact"
                    fullWidth
                    error={Boolean(touched.primarycontact && errors.primarycontact)}
                  />
                  {touched.primarycontact && errors.primarycontact && (
                    <FormHelperText error id="helper-text-primary-contact">
                      {errors.primarycontact}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="secondary-contact">Secondary Contact*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.secondarycontact && errors.secondarycontact)}
                    id="secondary-contact"
                    type="secondarycontact"
                    value={getAddEditValue(values.secondarycontact, employeeDefaultData.secondarycontact)}
                    name="secondarycontact"
                    onBlur={(e) => {
                      setFieldValue('secondarycontact', setEmployeeDefaultData({ secondarycontact: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFieldValue('secondarycontact', setEmployeeDefaultData({ secondarycontact: e.target.value }));
                    }}
                    placeholder="Secondary Contact"
                    inputProps={{}}
                  />
                  {touched.secondarycontact && errors.secondarycontact && (
                    <FormHelperText error id="helper-text-secondary-contact">
                      {errors.secondarycontact}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="address">Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                    id="address"
                    value={getAddEditValue(values.address, employeeDefaultData.address)}
                    name="address"
                    onBlur={(e) => {
                      setEmployeeDefaultData({ address: e.target.value });
                      setFieldValue('address', e.target.value);
                    }}
                    onChange={(e) => {
                      setEmployeeDefaultData({ address: e.target.value });
                      setFieldValue('address', e.target.value);
                    }}
                    placeholder="Full Address"
                    inputProps={{}}
                  />
                  {touched.address && errors.address && (
                    <FormHelperText error id="helper-text-address">
                      {errors.address}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="city">City*</InputLabel>
                  <Select
                    labelId="city"
                    id="city"
                    value={values.city}
                    label="city"
                    onChange={(e) => {
                      setEmployeeDefaultData({ city: e.target.value });
                      setFieldValue('city', e.target.value);
                    }}
                  >
                    <MenuItem value={2}>London</MenuItem>
                    <MenuItem value={3}>New Delhi</MenuItem>
                  </Select>
                  {touched.city && errors.city && (
                    <FormHelperText error id="helper-text-city">
                      {errors.city}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="dob">Date of Birth*</InputLabel>
                  <DatePicker
                    onChange={(value) => {
                      setFieldValue('dob', getDateFormat(value.$d));
                      //setEmployeeDefaultData({ dob: getDateFormat(value.$d) });
                    }}
                    defaultValue={dayjs(values.dob, dateFormat)}
                  />
                  {touched.dob && errors.dob && (
                    <FormHelperText error id="helper-text-dob">
                      {errors.dob}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="doj">Date of Joining*</InputLabel>
                  <DatePicker
                    onChange={(value) => {
                      setFieldValue('doj', getDateFormat(value.$d));
                      //setEmployeeDefaultData({ doj: value.$d });
                    }}
                    defaultValue={dayjs(values.doj, dateFormat)}
                  />
                  {touched.doj && errors.doj && (
                    <FormHelperText error id="helper-text-doj">
                      {errors.doj}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="job-title">Job Tile*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.jobTitle}
                    //value={getAddEditValue(values.jobTitle, employeeDefaultData.jobTitle)}
                    label="jobtitle"
                    onChange={(e) => {
                      setFieldValue('jobTitle', e.target.value);
                      //setEmployeeDefaultData({ jobTitle: e.target.value });
                    }}
                  >
                    <MenuItem value={2}>Software Engineer</MenuItem>
                    <MenuItem value={3}>Business Anylist</MenuItem>
                  </Select>
                  {touched.jobTitle && errors.jobTitle && (
                    <FormHelperText error id="helper-text-job-title">
                      {errors.jobTitle}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="department-value">Department*</InputLabel>
                  <Select
                    labelId="demo-simple-department-value"
                    id="demo-simple-department-value"
                    value={values.department}
                    //value={getAddEditValue(values.department, employeeDefaultData.department)}
                    label="departmentvalue"
                    onChange={(e) => {
                      setFieldValue('department', e.target.value);
                      //setEmployeeDefaultData({ department: e.target.value });
                    }}
                  >
                    <MenuItem value={1}>Software</MenuItem>
                    <MenuItem value={2}>Sales</MenuItem>
                    <MenuItem value={3}>Hr</MenuItem>
                  </Select>
                  {touched.department && errors.department && (
                    <FormHelperText error id="helper-text-department-value">
                      {errors.department}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="gender-value">Gender*</InputLabel>
                  <Select
                    labelId="gender-value"
                    id="gender-value"
                    value={getAddEditValue(values.gender, employeeDefaultData.gender)}
                    label="gendervalue"
                    onChange={(e) => {
                      setFieldValue('gender', e.target.value);
                      //setEmployeeDefaultData({ gender: e.target.value });
                    }}
                  >
                    <MenuItem value={1}>Male</MenuItem>
                    <MenuItem value={2}>Female</MenuItem>
                  </Select>
                  {touched.gender && errors.gender && (
                    <FormHelperText error id="helper-text-gender-value">
                      {errors.gender}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {employeeEditStatus === 'edit' ? 'Submit' : 'Add Employee'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddEditEmployee;
