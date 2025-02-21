import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Input, Modal, DatePicker } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getDateFormat, getCurrentYear } from '../../../utils/utils';
import { addCompanyAnnouncement, updateCompanyAnnouncement } from '../../../api/common';

const { TextArea } = Input;

CompanyAnnouncementModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

export default function CompanyAnnouncementModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const dateFormat = 'YYYY-MM-DD';

  const [companyAnnouncementDate, setCompanyAnnouncementDate] = useState(getDateFormat(new Date()));
  const [titleInpt, setTitleInpt] = useState(modalType === 1 ? '' : modalData.title);
  const [messageInpt, setMessageInpt] = useState(modalType === 1 ? '' : modalData.message);

  const addCompanyAnnouncementObj = {
    date: companyAnnouncementDate,
    title: titleInpt,
    message: messageInpt
  };

  const updateCompanyAnnouncementObj = {
    recordId: +modalData.id,
    date: companyAnnouncementDate,
    title: titleInpt,
    message: messageInpt
  };

  const dateChangeHandler = (date, dateString) => {
    setCompanyAnnouncementDate(dateString);
  };

  const addCompanyAnnouncementHandler = () => {
    modalType === 1
      ? addCompanyAnnouncement(addCompanyAnnouncementObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateCompanyAnnouncement(updateCompanyAnnouncementObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  return (
    <Modal
      width={800}
      title={modalType === 1 ? 'Add Company Announcement' : 'Edit Company Announcement'}
      open={modalOpenState}
      onOk={() => {
        addCompanyAnnouncementHandler();
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
            defaultValue={dayjs(modalType === 1 ? getDateFormat(new Date()) : modalData.announcement_date, dateFormat)}
            disabledDate={(current) => current.isBefore(getCurrentYear())}
            style={{ width: '100%' }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            placeholder="Title"
            value={titleInpt}
            onChange={(e) => {
              setTitleInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="message">Message</label>
          <TextArea
            id="message"
            placeholder="Message"
            rows={6}
            value={messageInpt}
            onChange={(e) => {
              setMessageInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
