import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { addDepartment, updateDepartment } from '../../../api/common';

DepartmentModal.propTypes = {
  modalType: PropTypes.number,
  modalOpenState: PropTypes.func,
  modalData: PropTypes.any,
  setModelState: PropTypes.func,
  onSave: PropTypes.func
};

export default function DepartmentModal({ modalType, modalOpenState, modalData, setModelState, onSave }) {
  const [departmentInpt, setDepartmentInpt] = useState(modalType === 1 ? '' : modalData.department_name);

  const addDepartmentObj = {
    departmentName: departmentInpt
  };

  const updateDepartmentObj = {
    recordId: +modalData.id,
    departmentName: departmentInpt
  };

  const addDepartmentHandler = () => {
    modalType === 1
      ? addDepartment(addDepartmentObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        })
      : updateDepartment(updateDepartmentObj).then((response) => {
          if (response.data) {
            setModelState(false);
            onSave();
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Department' : 'Edit Department'}
      open={modalOpenState}
      onOk={() => {
        addDepartmentHandler();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="department">Department</label>
          <Input
            id="department"
            placeholder="Department"
            value={departmentInpt}
            onChange={(e) => {
              setDepartmentInpt(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>
    </Modal>
  );
}
