import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { addEmployee, getDepartmentList, getJobTitleList, getWorkLocationCity } from '../../../api/common';
import { getDateFormat } from '../../../utils/utils';
import { Button, Select, MenuItem, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import { setEmployeeDetailsPageView } from 'store/reducers/common';

// project import
//import AnimateButton from 'components/@extended/AnimateButton';
import { DatePicker, Spin } from 'antd';
import Message from '../../components-overview/Messsage';

const AddEditEmployee = () => {
  let dateFormat = 'YYYY-MM-DD';
  let currentDate = getDateFormat(new Date());

  const dispatch = useDispatch();
  const { employeeDetailsPageView } = useSelector((state) => state.common);

  const [pageLoader, setPageLoader] = useState(false);

  const setEmployeePageViewMode = (viewMode) => {
    dispatch(setEmployeeDetailsPageView({ employeeDetailsPageView: viewMode }));
  };

  const [successMessage, setSuccessMessage] = useState(false);

  const [workLocationCity, setWorkLocationCity] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [jobTileList, setJobTileList] = useState([]);

  const [employeeDefaultData] = useState({
    firstName: '',
    lastname: '',
    dob: currentDate,
    jobTitle: -1,
    department: -1,
    gender: 1,
    address: '',
    city: -1,
    personalemail: '',
    officeemail: '',
    primarycontact: '',
    secondarycontact: '',
    doj: currentDate
  });

  function getDrodpwnData() {
    getWorkLocationCity().then((response) => {
      if (response.data.length) {
        setWorkLocationCity(response.data);
      }
    });

    getDepartmentList().then((response) => {
      if (response.data.length) {
        setDepartmentList(response.data);
      }
    });

    getJobTitleList().then((response) => {
      if (response.data.length) {
        setJobTileList(response.data);
      }
    });
  }

  useEffect(() => {
    getDrodpwnData();
  }, []);

  return (
    <>
      {successMessage && employeeDetailsPageView === 'addedemployee' ? (
        <>
          <Message messageType="success" titleMessage="Success Message" detailsMessage="Employee Record Added Successfully!" />

          <Grid container item xs={4} spacing={1} alignItems="start" justifyContent="start">
            <Grid item>
              <Button
                disableElevation
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => setEmployeePageViewMode('viewemployee')}
              >
                Show Employees
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
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
            secondarycontact: Yup.string().max(255).required('Contact Number is required'),
            jobTitle: Yup.string().max(255).required('Job Tile is required'),
            department: Yup.string().max(255).required('Department is required'),
            city: Yup.string().max(255).required('Work Location is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            setPageLoader(true);

            try {
              //setStatus({ success: false });
              //setSubmitting(false);

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
              ).then((response) => {
                if (response.data) {
                  setPageLoader(false);

                  setSuccessMessage(true);
                  setEmployeePageViewMode('addedemployee');
                }
              });
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleChange, handleBlur, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              {pageLoader && (
                <Grid item sx={{ mt: 3, mb: 3 }} xs={12}>
                  <Spin tip="Loading" size="large">
                    <div className="content" />
                  </Spin>
                </Grid>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                    <OutlinedInput
                      id="firstname-login"
                      type="firstname"
                      value={values.firstname}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.lastname && errors.lastname)}
                      id="lastname-signup"
                      type="lastname"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="office-email">Office Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.officeemail && errors.officeemail)}
                      id="office-email"
                      type="email"
                      value={values.officeemail}
                      name="officeemail"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">Personal Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.personalemail && errors.personalemail)}
                      id="personal-email"
                      type="email"
                      value={values.personalemail}
                      name="personalemail"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="primary-contact">Primary Contact*</InputLabel>
                    <OutlinedInput
                      id="primary-contact"
                      type="primarycontact"
                      value={values.primarycontact}
                      name="primarycontact"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="secondary-contact">Secondary Contact*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.secondarycontact && errors.secondarycontact)}
                      id="secondary-contact"
                      type="secondarycontact"
                      value={values.secondarycontact}
                      name="secondarycontact"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address">Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.address && errors.address)}
                      id="address"
                      value={values.address}
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
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

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="city">Work Loaction*</InputLabel>
                    <Select
                      labelId="city"
                      id="city"
                      value={values.city}
                      label="city"
                      onChange={(e) => {
                        //setEmployeeDefaultData({ city: e.target.value });
                        setFieldValue('city', e.target.value);
                      }}
                    >
                      <MenuItem value="-1">Select</MenuItem>

                      {workLocationCity.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.id}>
                            {item.city_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {touched.city && errors.city && (
                      <FormHelperText error id="helper-text-city">
                        {errors.city}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="dob">Date of Birth*</InputLabel>
                    <DatePicker
                      onChange={(value) => {
                        setFieldValue('dob', getDateFormat(value.$d));
                      }}
                      defaultValue={dayjs(values.dob, dateFormat)}
                      style={{ height: '42px' }}
                    />
                    {touched.dob && errors.dob && (
                      <FormHelperText error id="helper-text-dob">
                        {errors.dob}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="doj">Date of Joining*</InputLabel>
                    <DatePicker
                      onChange={(value) => {
                        setFieldValue('doj', getDateFormat(value.$d));
                      }}
                      defaultValue={dayjs(values.doj, dateFormat)}
                      style={{ height: '42px' }}
                    />
                    {touched.doj && errors.doj && (
                      <FormHelperText error id="helper-text-doj">
                        {errors.doj}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="department-value">Department*</InputLabel>
                    <Select
                      labelId="demo-simple-department-value"
                      id="demo-simple-department-value"
                      value={values.department}
                      label="departmentvalue"
                      onChange={(e) => {
                        setFieldValue('department', e.target.value);
                      }}
                      // onBlur={() => {
                      //   setTouched({ department: true });
                      // }}
                      error={Boolean(touched.department && errors.department)}
                    >
                      <MenuItem value="-1">Select</MenuItem>

                      {departmentList.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.id}>
                            {item.department_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {touched.department && errors.department && (
                      <FormHelperText error id="helper-text-department-value">
                        {errors.department}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="job-title">Job Tile*</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.jobTitle}
                      label="jobtitle"
                      onChange={(e) => {
                        setFieldValue('jobTitle', e.target.value);
                      }}
                    >
                      <MenuItem value="-1">Select</MenuItem>

                      {jobTileList.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.id}>
                            {item.job_title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {touched.jobTitle && errors.jobTitle && (
                      <FormHelperText error id="helper-text-job-title">
                        {errors.jobTitle}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="gender-value">Gender*</InputLabel>
                    <Select
                      labelId="gender-value"
                      id="gender-value"
                      value={values.gender}
                      label="gendervalue"
                      onChange={(e) => {
                        setFieldValue('gender', e.target.value);
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
                  <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      )}
    </>
  );
};

export default AddEditEmployee;
