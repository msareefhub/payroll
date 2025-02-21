import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { addBankDetails, updateBankDetails } from '../../../api/common';

DocumentModal.propTypes = {
  employeeId: PropTypes.number,
  modalType: PropTypes.number,
  modalOpenState: PropTypes.boolean,
  modalData: PropTypes.any,
  setModelState: PropTypes.boolean,
  onSave: PropTypes.any
};

export default function DocumentModal({ employeeId, modalType, modalOpenState, modalData, setModelState, onSave }) {
  const [accountTypeInput, setAccountTypeInput] = useState(modalType === 1 ? 'Saving' : modalData.account_type);
  const [accountNameInput, setAccountNameInput] = useState(modalType === 1 ? null : modalData.account_name);
  const [accountNoInput, setAccountNoInput] = useState(modalType === 1 ? null : modalData.account_no);
  const [bankNameInput, setBankNameInput] = useState(modalType === 1 ? null : modalData.account_name);
  const [branchNameInput, setBranchNameInput] = useState(modalType === 1 ? null : modalData.branch_name);
  const [ifscCodeInput, setIfscCodeInput] = useState(modalType === 1 ? null : modalData.ifsc_code);
  const [swiftCodeInput, setSwiftCodeInput] = useState(modalType === 1 ? null : modalData.swift_code);

  const bankDetailsObj = {
    employeeId: +employeeId,
    accountType: accountTypeInput,
    accountName: accountNameInput,
    accountNo: accountNoInput,
    bankName: bankNameInput,
    branchName: branchNameInput,
    ifscCode: ifscCodeInput,
    swiftCode: swiftCodeInput
  };

  const saveModalData = () => {
    modalType === 1
      ? addBankDetails(bankDetailsObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        })
      : updateBankDetails(bankDetailsObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        });
  };

  return (
    <Modal
      title={modalType === 1 ? 'Add Bank Details' : 'Edit Bank Details'}
      open={modalOpenState}
      onOk={() => {
        saveModalData();
        onSave();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="accountType">Account Type</label>
          <Input
            id="accountType"
            placeholder="Account Type"
            value={accountTypeInput}
            disabled
            onChange={(e) => {
              setAccountTypeInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="accountName">Account Name</label>
          <Input
            id="accountName"
            placeholder="Account Name"
            value={accountNameInput}
            onChange={(e) => {
              setAccountNameInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="accountNo">Account No</label>
          <Input
            id="accountNo"
            placeholder="Account No"
            value={accountNoInput}
            onChange={(e) => {
              setAccountNoInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="bankName">Bank Name</label>
          <Input
            id="bankName"
            placeholder="Bank Name"
            value={bankNameInput}
            onChange={(e) => {
              setBankNameInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="branchName">Branch Name</label>
          <Input
            id="branchName"
            placeholder="Branch Name"
            value={branchNameInput}
            onChange={(e) => {
              setBranchNameInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="ifscCode">IFSC Code</label>
          <Input
            id="ifscCode"
            placeholder="IFSC Code"
            value={ifscCodeInput}
            onChange={(e) => {
              setIfscCodeInput(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="swiftCode">Swift Code</label>
          <Input
            id="swiftCode"
            placeholder="Swift Code"
            value={swiftCodeInput}
            onChange={(e) => {
              setSwiftCodeInput(e.target.value);
            }}
          />
        </ControlWrapper>
      </ModalContainer>

      <p></p>
    </Modal>
  );
}
