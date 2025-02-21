import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Modal } from 'antd';
import { ControlWrapper, ModalContainer } from '../CommonStyled';
import { getDocuments, updateDocumentDetails, getCountry, getCity, adddocuments } from '../../../api/common';

DocumentModal.propTypes = {
  employeeId: PropTypes.number,
  modalType: PropTypes.number,
  modalOpenState: PropTypes.boolean,
  modalData: PropTypes.any,
  setModelState: PropTypes.boolean,
  onSave: PropTypes.any
};

export default function DocumentModal({ employeeId, modalType, modalOpenState, modalData, setModelState, onSave }) {
  const [selectedDocument, setSelectedDocument] = useState(modalType === 1 ? null : modalData.document_type);
  const [selectedCountry, setSelectedCountry] = useState(modalType === 1 ? null : modalData.country_of_issue);
  const [selectedCity, setSelectedCity] = useState(modalType === 1 ? null : modalData.place_of_issue);
  const [documentNumberInpt, setDocumentNumberInpt] = useState(modalType === 1 ? null : modalData.document_number);

  const [documentNameListOptions, setDocumentNameListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [countryListOptions, setCountryListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [cityListOptions, setCityListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const documentNameHandleChange = (documentType) => {
    setSelectedDocument(documentType);
  };

  const countryHandleChange = (countryType) => {
    setSelectedCountry(countryType);
  };

  const cityNameHandleChange = (cityType) => {
    setSelectedCity(cityType);
  };

  const documentUpdateObj = {
    employeeId: modalType === 1 ? +employeeId : +modalData.document_id,
    documentType: selectedDocument,
    documentNumber: documentNumberInpt,
    countryOfIssue: selectedCountry,
    placeOfIssue: selectedCity
  };

  const documentUpdateHandler = () => {
    modalType === 1
      ? adddocuments(documentUpdateObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        })
      : updateDocumentDetails(documentUpdateObj).then((response) => {
          if (response.data) {
            setModelState(false);
          }
        });
  };

  const getEmployeeDetails = () => {
    getDocuments().then((response) => {
      if (response.data) {
        setDocumentNameListOptions(
          response.data.map((item) => {
            return { label: item?.document_name, value: item?.id };
          })
        );
      }
    });

    getCountry().then((response) => {
      if (response.data) {
        setCountryListOptions(
          response.data.map((item) => {
            return { label: item?.country_name, value: item?.id };
          })
        );
      }
    });

    getCity().then((response) => {
      if (response.data) {
        setCityListOptions(
          response.data.map((item) => {
            return { label: item?.city_name, value: item?.id };
          })
        );
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      title={modalType === 1 ? 'Add Documents' : 'Edit Document'}
      open={modalOpenState}
      onOk={() => {
        documentUpdateHandler();
        onSave();
      }}
      onCancel={() => {
        setModelState(false);
      }}
    >
      <ModalContainer>
        <ControlWrapper>
          <label htmlFor="document-type">Document Type</label>
          <Select
            id="document-type"
            defaultValue={selectedDocument}
            placeholder="Select"
            onChange={documentNameHandleChange}
            options={documentNameListOptions}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="document-number">Document Number</label>
          <Input
            id="document-number"
            placeholder="Document Number"
            value={documentNumberInpt}
            onChange={(e) => {
              setDocumentNumberInpt(e.target.value);
            }}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="country">Country of Issue</label>
          <Select
            id="country"
            placeholder="Select"
            defaultValue={selectedCountry}
            onChange={countryHandleChange}
            options={countryListOptions}
          />
        </ControlWrapper>

        <ControlWrapper>
          <label htmlFor="country">Place of Issue</label>
          <Select id="city" placeholder="Select" defaultValue={selectedCity} onChange={cityNameHandleChange} options={cityListOptions} />
        </ControlWrapper>
      </ModalContainer>

      <p></p>
    </Modal>
  );
}
