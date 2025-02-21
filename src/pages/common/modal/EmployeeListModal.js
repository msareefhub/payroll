import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Select, Input, Modal, DatePicker } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getDateFormat } from '../../../utils/utils';
import { Grid } from '@mui/material';
import { addEmployee, updateEmployee, getDepartmentList, getJobTitleList, getWorkLocationCity, getGenderList } from '../../../api/common';

HolidayListModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

const { TextArea } = Input;

export default function HolidayListModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const dateFormat = 'YYYY-MM-DD';

  const [firstNameInpt, setFirstNameInpt] = useState(modalType === 1 ? '' : modalData.first_name);
  const [lastNameInpt, setLastNameInpt] = useState(modalType === 1 ? '' : modalData.last_name);
  const [dateOfBirth, setDateOfBirth] = useState(getDateFormat(new Date()));
  const [selectedWorkLocation, setSelectedWorkLocation] = useState(modalType === 1 ? null : modalData.city_id);
  const [selectedDepartment, setSelectedDepartment] = useState(modalType === 1 ? null : modalData.department_id);
  const [selectedJobTitle, setSelectedJobTitle] = useState(modalType === 1 ? null : modalData.job_title_id);
  const [selectedGender, setSelectedGender] = useState(modalType === 1 ? null : modalData.gender_id);
  const [addressInpt, setAddressInpt] = useState(modalType === 1 ? '' : modalData.address);
  const [personalEmail, setPersonalEmail] = useState(modalType === 1 ? '' : modalData.personal_email);
  const [officeEmail, setOfficeEmail] = useState(modalType === 1 ? '' : modalData.office_email);
  const [primaryContact, setPrimaryContact] = useState(modalType === 1 ? '' : modalData.secondary_contact);
  const [secondaryContact, setSecondaryContact] = useState(modalType === 1 ? '' : modalData.last_name);
  const [employmentStart, setEmploymentStart] = useState(getDateFormat(new Date()));

  const [workLocationOptions, setWorkLocationOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [departmentOptions, setDepartmentOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [jobTitleOptions, setJobTitleOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [genderOptions, setGenderOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const workLocationHandleChange = (countryId) => {
    setSelectedWorkLocation(countryId);
  };

  const departmentHandleChange = (countryId) => {
    setSelectedDepartment(countryId);
  };

  const jobTitleHandleChange = (countryId) => {
    setSelectedJobTitle(countryId);
  };

  const genderHandleChange = (countryId) => {
    setSelectedGender(countryId);
  };

  const addHolidayObj = {
    firstName: firstNameInpt,
    lastName: lastNameInpt,
    dateOfBirth: dateOfBirth,
    jobTitleId: selectedJobTitle,
    departmentId: selectedDepartment,
    genderId: selectedGender,
    address: addressInpt,
    cityId: selectedWorkLocation,
    personalEmail: personalEmail,
    officeEmail: officeEmail,
    primaryContact: primaryContact,
    secondaryContact: secondaryContact,
    employmentStart: employmentStart
  };

  const updateHolidayObj = {
    employeeId: +modalData.id,
    firstName: firstNameInpt,
    lastName: lastNameInpt,
    dateOfBirth: dateOfBirth,
    jobTitleId: selectedJobTitle,
    departmentId: selectedDepartment,
    genderId: selectedGender,
    address: addressInpt,
    cityId: selectedWorkLocation,
    personalEmail: personalEmail,
    officeEmail: officeEmail,
    primaryContact: primaryContact,
    secondaryContact: secondaryContact,
    employmentStart: employmentStart
  };

  const dateOfBirthChangeHandler = (date, dateString) => {
    setDateOfBirth(dateString);
  };

  const dateOfJoiningChangeHandler = (date, dateString) => {
    setEmploymentStart(dateString);
  };

  const addHolidayHandler = () => {
    modalType === 1
      ? addEmployee(addHolidayObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateEmployee(updateHolidayObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  function getDrodpwnData() {
    getWorkLocationCity().then((response) => {
      if (response.data.length) {
        setWorkLocationOptions(
          response.data.map((item) => {
            return { label: item?.city_name, value: item?.id };
          })
        );
      }
    });

    getDepartmentList().then((response) => {
      if (response.data.length) {
        setDepartmentOptions(
          response.data.map((item) => {
            return { label: item?.department_name, value: item?.id };
          })
        );
      }
    });

    getJobTitleList().then((response) => {
      if (response.data.length) {
        setJobTitleOptions(
          response.data.map((item) => {
            return { label: item?.job_title, value: item?.id };
          })
        );
      }
    });

    getGenderList().then((response) => {
      if (response.data.length) {
        setGenderOptions(
          response.data.map((item) => {
            return { label: item?.gender_name, value: item?.id };
          })
        );
      }
    });
  }

  useEffect(() => {
    getDrodpwnData();
  }, []);

  return (
    <Modal
      title={modalType === 1 ? 'Add Employee' : 'Edit Employee'}
      open={modalOpenState}
      onOk={() => {
        addHolidayHandler();
      }}
      onCancel={() => {
        setModelState(false);
      }}
      width={800}
    >
      <ModalContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="first-name">First Name</label>
              <Input
                id="first-name"
                placeholder="First Name"
                value={firstNameInpt}
                onChange={(e) => {
                  setFirstNameInpt(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="last-name">Last Name</label>
              <Input
                id="last-name"
                placeholder="Last Name"
                value={lastNameInpt}
                onChange={(e) => {
                  setLastNameInpt(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="date-of-birth">Date of Birth</label>
              <DatePicker
                id="date-of-birth"
                onChange={dateOfBirthChangeHandler}
                defaultValue={dayjs(modalType === 1 ? getDateFormat(new Date()) : modalData.date_of_birth, dateFormat)}
                style={{ width: '100%' }}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="employment-start">Date of Joining</label>
              <DatePicker
                id="employment-start"
                onChange={dateOfJoiningChangeHandler}
                defaultValue={dayjs(modalType === 1 ? getDateFormat(new Date()) : modalData.employment_start, dateFormat)}
                style={{ width: '100%' }}
              />
            </ControlWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="work-location">Work Location</label>
              <Select
                id="work-location"
                placeholder="Select"
                defaultValue={selectedWorkLocation}
                onChange={workLocationHandleChange}
                options={workLocationOptions}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="department">Department</label>
              <Select
                id="department"
                placeholder="Select"
                defaultValue={selectedDepartment}
                onChange={departmentHandleChange}
                options={departmentOptions}
              />
            </ControlWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="job-title">Job Profile</label>
              <Select
                id="job-title"
                placeholder="Select"
                defaultValue={selectedJobTitle}
                onChange={jobTitleHandleChange}
                options={jobTitleOptions}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="gender">Gender</label>
              <Select
                id="gender"
                placeholder="Select"
                defaultValue={selectedGender}
                onChange={genderHandleChange}
                options={genderOptions}
              />
            </ControlWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ pt: 3 }}>
          <Grid item xs={2}>
            <label htmlFor="address">Address</label>
          </Grid>
          <Grid item xs={10}>
            <TextArea
              id="address"
              placeholder="Address"
              rows={4}
              value={addressInpt}
              onChange={(e) => {
                setAddressInpt(e.target.value);
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="personal-email">Personal Email</label>
              <Input
                id="personal-email"
                placeholder="Personal Email"
                value={personalEmail}
                onChange={(e) => {
                  setPersonalEmail(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="office-email">Office Email</label>
              <Input
                id="office-email"
                placeholder="Office Email"
                value={officeEmail}
                onChange={(e) => {
                  setOfficeEmail(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="primary-contact">Primary Contact</label>
              <Input
                id="primary-contact"
                placeholder="Primary Contact"
                value={primaryContact}
                onChange={(e) => {
                  setPrimaryContact(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>

          <Grid item xs={6}>
            <ControlWrapper>
              <label htmlFor="secondary-contact">Secondary Contact</label>
              <Input
                id="secondary-contact"
                placeholder="secondary Contact"
                value={secondaryContact}
                onChange={(e) => {
                  setSecondaryContact(e.target.value);
                }}
              />
            </ControlWrapper>
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  );
}
