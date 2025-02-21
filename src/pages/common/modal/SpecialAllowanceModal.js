import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Input, DatePicker, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getDateFormat } from '../../../utils/utils';
import { addSpecialAllowance, updateSpecialAllowance } from '../../../api/common';

SpecialAllowanceModal.propTypes = {
  employeeId: PropTypes.number,
  modalType: PropTypes.number,
  modalOpenState: PropTypes.boolean,
  modalData: PropTypes.any,
  setModelState: PropTypes.boolean,
  onSave: PropTypes.any
};

export default function SpecialAllowanceModal({ employeeId, modalType, modalOpenState, modalData, setModelState, onSave }) {
  const dateFormat = 'YYYY-MM-DD';

  const [specialBonusInpt, setSpecialBonusInpt] = useState(modalType === 1 ? 0 : modalData.special_bonus);
  const [specialAllowanceInpt, setSpecialAllowanceInpt] = useState(modalType === 1 ? 0 : modalData.special_allowance);
  const [travelAllowanceInpt, setTravelAllowanceInpt] = useState(modalType === 1 ? 0 : modalData.travel_allowance);
  const [mobileAllowanceInpt, setMobileAllowanceInpt] = useState(modalType === 1 ? 0 : modalData.mobile_allowance);
  const [internetAllowanceInpt, setInternetAllowanceInpt] = useState(modalType === 1 ? 0 : modalData.internet_allowance);

  const [currentDate, setCurrentDate] = useState(new Date());

  const specialAllowanceObj = {
    employeeId: modalType === 1 ? +employeeId : modalData.record_id,
    payDate: currentDate,
    specialBonus: +specialBonusInpt,
    specialAllowance: +specialAllowanceInpt,
    travelAllowance: +travelAllowanceInpt,
    mobileAllowance: +mobileAllowanceInpt,
    internetAllowance: +internetAllowanceInpt
  };

  const dateChangeHandler = (date, dateString) => {
    setCurrentDate(dateString);
  };

  const addSpecialAllowanceHandler = () => {
    modalType === 1
      ? addSpecialAllowance(specialAllowanceObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        })
      : updateSpecialAllowance(specialAllowanceObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Special Allowances' : 'Edit Special Allowances'}
      open={modalOpenState}
      onOk={() => {
        addSpecialAllowanceHandler();
        onSave();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="travel-allowance">Date</label>
          <DatePicker
            onChange={dateChangeHandler}
            defaultValue={dayjs(modalType === 1 ? getDateFormat(new Date()) : modalData.pay_date, dateFormat)}
            disabledDate={(current) => current.isBefore('2024') || current.isAfter(`${new Date().getFullYear()}`)}
            style={{ width: '100%' }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="special-bonus">Special Bonus</label>
          <Input
            id="special-bonus"
            placeholder="Special Bonus"
            value={specialBonusInpt}
            onChange={(e) => {
              setSpecialBonusInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="special-allowance">Special Allowance</label>
          <Input
            id="special-allowance"
            placeholder="Special Bonus"
            value={specialAllowanceInpt}
            onChange={(e) => {
              setSpecialAllowanceInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="travel-allowance">Travel Allowance</label>
          <Input
            id="travel-allowance"
            placeholder="Travel Allowance"
            value={travelAllowanceInpt}
            onChange={(e) => {
              setTravelAllowanceInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="mobile-allowance">Mobile Allowance</label>
          <Input
            id="mobile-allowance"
            placeholder="Mobile Allowance"
            value={mobileAllowanceInpt}
            onChange={(e) => {
              setMobileAllowanceInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="internet-allowance">Internet Allowance</label>
          <Input
            id="internet-allowance"
            placeholder="Internet Allowance"
            value={internetAllowanceInpt}
            onChange={(e) => {
              setInternetAllowanceInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
