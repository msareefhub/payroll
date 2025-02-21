import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserLogin, UserRole } from '../../../utils/enum';
import { setEmployeeDetails, setRoleName, setUserName } from 'store/reducers/common';
import * as Yup from 'yup';

import { getLoginUser } from '../../../api/common';
//import { getLoginUser, updateLoginTime, checkEmpLoginStartTime } from '../../../api/common';
//import { getDateFormat, getTimeByCurrentDate } from '../../../utils/utils';

const AuthLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function getLoginUserByUserName(loginOtp) {
    const employeeId = JSON.parse(localStorage.getItem('appid'));
    const userName = JSON.parse(localStorage.getItem('userCode'));

    getLoginUser(employeeId, loginOtp, userName).then((response) => {
      if (response.data.length) {
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

        //code will remove letter
        // if (response.data[0]?.role_name === UserRole.EMPLOYEE) {
        //   checkEmpLoginStartTime(response.data[0]?.employee_id, getDateFormat(new Date())).then((checjkResponse) => {
        //     if (checjkResponse.data.length === 0) {
        //       updateLoginTime(response.data[0]?.employee_id, getDateFormat(new Date()), getTimeByCurrentDate());
        //     }
        //   });
        // }

        dispatch(setRoleName({ roleName: [`${response.data[0]?.role_name}`] }));
        dispatch(setUserName({ userName: [`${response.data[0]?.first_name} ${response.data[0]?.last_name}`] }));

        switch (response.data[0]?.role_name) {
          case UserRole.ADMIN:
            return navigate('/admin-dashboard');
          case UserRole.EMPLOYEE:
            return navigate('/employee-dashboard');
          default:
        }
      } else {
        navigate('/');
      }
    });
  }

  return (
    <>
      <Formik
        initialValues={{
          loginOtp: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          loginOtp: Yup.string().max(255).required('Login OTP is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            getLoginUserByUserName(values.loginOtp);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Enter OTP</InputLabel>
                  <OutlinedInput
                    id="login-otp"
                    type="email"
                    value={values.loginOtp}
                    name="loginOtp"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    fullWidth
                    inputProps={{ maxLength: UserLogin.OTP_MAX_LENGHT }}
                    error={Boolean(touched.loginOtp && errors.loginOtp)}
                  />
                  {touched.loginOtp && errors.loginOtp && (
                    <FormHelperText error id="standard-weight-helper-text-login-otp">
                      {errors.loginOtp}
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
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: 'black' }}
                  >
                    Proceed
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

export default AuthLogin;
