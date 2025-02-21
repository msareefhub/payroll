import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getCountry, addWorkLocation, updateWorkLocation } from '../../../api/common';

WorkLocationModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

export default function WorkLocationModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const [workLocationInpt, setWorkLocationInpt] = useState(modalType === 1 ? '' : modalData.city_name);
  const [selectedCountry, setSelectedCountry] = useState(modalType === 1 ? null : modalData.country_id);

  const [countryListOptions, setCountryListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const getCountryDetails = () => {
    getCountry().then((response) => {
      if (response.data) {
        setCountryListOptions(
          response.data.map((item) => {
            return { label: item?.country_name, value: item?.id };
          })
        );
      }
    });
  };

  useEffect(() => {
    getCountryDetails();
    // eslint-disable-next-line
  }, []);

  const addWorkLocationObj = {
    cityName: workLocationInpt,
    countryId: +selectedCountry
  };

  const updateWorkLocationObj = {
    recordId: +modalData.id,
    cityName: workLocationInpt,
    countryId: +selectedCountry
  };

  const countryHandleChange = (countryId) => {
    setSelectedCountry(countryId);
  };

  const addWorkLocationHandler = () => {
    modalType === 1
      ? addWorkLocation(addWorkLocationObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateWorkLocation(updateWorkLocationObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Work Location' : 'Edit Work Location'}
      open={modalOpenState}
      onOk={() => {
        addWorkLocationHandler();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="country">Select Country</label>
          <Select
            id="country"
            placeholder="Select"
            defaultValue={selectedCountry}
            onChange={countryHandleChange}
            options={countryListOptions}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="work-location">Work Location</label>
          <Input
            id="work-location"
            placeholder="Work Location"
            value={workLocationInpt}
            onChange={(e) => {
              setWorkLocationInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
