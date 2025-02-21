import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconWrapper } from './CommonStyled';
import DocumentModal from '../common/modal/DocumentModal';
import { Box, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spin, Button, Flex, Divider, Modal, Empty } from 'antd';
import MainCard from 'components/MainCard';
import { getEmployeeDocuments, removeDocument } from '../../api/common';
import { UserRole } from '../../utils/enum';

// assets
import { EditTwoTone, DeleteTwoTone, ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
  },
  {
    id: 'employee_code',
    align: 'left',
    disablePadding: false,
    label: 'Employee Code'
  },
  {
    id: 'employee_name',
    align: 'left',
    disablePadding: false,
    label: 'Employee Name'
  },
  {
    id: 'document_name',
    align: 'left',
    disablePadding: false,
    label: 'Document Name'
  },
  {
    id: 'document_number',
    align: 'left',
    disablePadding: false,
    label: 'Document Number'
  },
  {
    id: 'country_issue',
    align: 'left',
    disablePadding: true,
    label: 'Country of Issue'
  },
  {
    id: 'place_issue',
    align: 'left',
    disablePadding: true,
    label: 'Place of Issue'
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: true,
    label: 'Action'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

Documents.propTypes = {
  employeeId: PropTypes.number
};

export default function Documents({ employeeId }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const { roleName } = useSelector((state) => state.common);

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [modelType, setModelType] = useState(1);
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);

  const [employeeDocumentDetails, setEmployeeDocumentDetails] = useState([]);
  const [selectedDocumentDetails, setSelectedDocumentDetails] = useState([]);

  const loadEmployeeDocumentDetails = () => {
    setIsSubmit(true);
    setSelectedDocumentDetails([]);

    if (employeeId.length) {
      setInfoMessage(false);
      setPageLoader(true);

      getEmployeeDocuments(employeeId).then((response) => {
        if (response.data.length) {
          setInfoMessage(false);

          setEmployeeDocumentDetails(response.data);

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setEmployeeDocumentDetails([]);
        }
      });
    }
  };

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: 'Are you sure remove this document?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeDocument(recordId).then((response) => {
          if (response.data) {
            loadEmployeeDocumentDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    loadEmployeeDocumentDetails();
    // eslint-disable-next-line
  }, [employeeId]);

  return (
    <>
      <Grid sx={{ mt: 0, mb: 4 }} item xs={12} md={7} lg={12}>
        {infoMessage && (
          <Grid item xs={12}>
            <Empty />
          </Grid>
        )}

        {pageLoader && (
          <Grid item sx={{ pt: 4, pb: 4 }} xs={12}>
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          </Grid>
        )}

        {!pageLoader && roleName[0] === UserRole.EMPLOYEE && (
          <Stack sx={{ mt: employeeDocumentDetails.length ? 0 : 2 }} alignItems={employeeDocumentDetails.length ? 'end' : 'center'}>
            <Button
              type="primary"
              onClick={() => {
                setModelType(1);
                setSelectedDocumentDetails([]);
                setIsEditDocumentModalOpen(true);
              }}
            >
              Add Documents
            </Button>
          </Stack>
        )}

        {isSubmit && !pageLoader && !!employeeDocumentDetails.length && (
          <Grid item sx={{ mt: 2 }} xs={12} md={7} lg={12}>
            <MainCard content={false}>
              <Box>
                <TableContainer
                  sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                  }}
                >
                  <Table
                    aria-labelledby="tableTitle"
                    sx={{
                      '& .MuiTableCell-root:first-of-type': {
                        pl: 2
                      },
                      '& .MuiTableCell-root:last-of-type': {
                        pr: 3
                      }
                    }}
                  >
                    <OrderTableHead order={order} orderBy={orderBy} />

                    <TableBody>
                      {employeeDocumentDetails.map((item, index) => {
                        const isItemSelected = isSelected(112);

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                          >
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{item.employee_code}</TableCell>
                            <TableCell align="left">{`${item.first_name} ${item.last_name}`}</TableCell>
                            <TableCell align="left">{item.document_name}</TableCell>
                            <TableCell align="left">{item.document_number}</TableCell>
                            <TableCell align="left">{item.country_name}</TableCell>
                            <TableCell align="left">{item.city_name}</TableCell>
                            <TableCell align="left" width="150">
                              <Flex align="center">
                                <IconWrapper
                                  onClick={() => {
                                    setModelType(2);
                                    setSelectedDocumentDetails(item);
                                    setIsEditDocumentModalOpen(true);
                                  }}
                                >
                                  <EditTwoTone />
                                </IconWrapper>

                                <Divider type="vertical" />

                                <IconWrapper
                                  onClick={() => {
                                    showDeleteConfirm(item.document_id);
                                  }}
                                >
                                  <DeleteTwoTone style={{ color: 'red' }} />
                                </IconWrapper>
                              </Flex>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </MainCard>
          </Grid>
        )}
      </Grid>
      {isEditDocumentModalOpen && (
        <DocumentModal
          employeeId={employeeId}
          modalType={modelType}
          modalOpenState={isEditDocumentModalOpen}
          modalData={selectedDocumentDetails}
          setModelState={setIsEditDocumentModalOpen}
          onSave={() => loadEmployeeDocumentDetails()}
        />
      )}
    </>
  );
}
