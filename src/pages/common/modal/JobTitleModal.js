import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { addJobTitle, updateJobTitle } from '../../../api/common';

JobTitleModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

export default function JobTitleModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const [jobTitleInpt, setjobTitleInpt] = useState(modalType === 1 ? '' : modalData.job_title);

  const addJobTitleObj = {
    jobTitleName: jobTitleInpt
  };

  const updateJobTitleObj = {
    recordId: +modalData.id,
    jobTitleName: jobTitleInpt
  };

  const addJobTitleHandler = () => {
    modalType === 1
      ? addJobTitle(addJobTitleObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateJobTitle(updateJobTitleObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Job Title' : 'Edit Job Title'}
      open={modalOpenState}
      onOk={() => {
        addJobTitleHandler();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="JobTitle">Job Title</label>
          <Input
            id="JobTitle"
            placeholder="Job Title"
            value={jobTitleInpt}
            onChange={(e) => {
              setjobTitleInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
