import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Input, Modal, DatePicker } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getDateFormat, getCurrentYear, getNextYear } from '../../../utils/utils';
import { addHolidaylist, updateHolidayList } from '../../../api/common';

HolidayListModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

export default function HolidayListModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const dateFormat = 'YYYY-MM-DD';

  const [holidayNameInpt, setHolidayNameInpt] = useState(modalType === 1 ? '' : modalData.holiday_name);

  const [holidayDate, setHolidayDate] = useState(getDateFormat(new Date()));

  const addHolidayObj = {
    holidayName: holidayNameInpt,
    holidayDate: holidayDate
  };

  const updateHolidayObj = {
    recordId: +modalData.id,
    holidayName: holidayNameInpt,
    holidayDate: holidayDate
  };

  const dateChangeHandler = (date, dateString) => {
    setHolidayDate(dateString);
  };

  const addHolidayHandler = () => {
    modalType === 1
      ? addHolidaylist(addHolidayObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateHolidayList(updateHolidayObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Holiday' : 'Edit Holiday'}
      open={modalOpenState}
      onOk={() => {
        addHolidayHandler();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="date">Date</label>
          <DatePicker
            onChange={dateChangeHandler}
            defaultValue={dayjs(modalType === 1 ? getDateFormat(new Date()) : modalData.holiday_date, dateFormat)}
            disabledDate={(current) => current.isBefore(getCurrentYear()) || current.isAfter(getNextYear())}
            style={{ width: '100%' }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="Holiday-title">Holiday Title</label>
          <Input
            id="HolidayName"
            placeholder="Holiday Title"
            value={holidayNameInpt}
            onChange={(e) => {
              setHolidayNameInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
