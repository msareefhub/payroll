import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconWrapper } from './CommonStyled';
import BankModal from '../common/modal/BankModal';
import { Box, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spin, Button, Flex, Divider, Modal, Empty } from 'antd';
import MainCard from 'components/MainCard';
import { getEmployeeBankDetails, removeBankDetails } from '../../api/common';
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
    id: 'account_type',
    align: 'left',
    disablePadding: true,
    label: 'Account Type'
  },
  {
    id: 'account_name',
    align: 'left',
    disablePadding: false,
    label: 'Account Name'
  },
  {
    id: 'account_no',
    align: 'left',
    disablePadding: false,
    label: 'Account No'
  },
  {
    id: 'bank_name',
    align: 'left',
    disablePadding: false,
    label: 'Bank Name'
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: false,
    label: 'Branch Name'
  },

  {
    id: 'bank_code',
    align: 'left',
    disablePadding: false,
    label: 'IFSC Code'
  },
  {
    id: 'swift_code',
    align: 'left',
    disablePadding: false,
    label: 'Swift Code'
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

BankDetails.propTypes = {
  employeeId: PropTypes.number
};

export default function BankDetails({ employeeId }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const { roleName } = useSelector((state) => state.common);

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const [infoMessage, setInfoMessage] = useState(false);
  const [modelType, setModelType] = useState(1);
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);

  const [employeeBankDetails, setEmployeeBankDetails] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState([]);

  const loadBankDetails = () => {
    setIsSubmit(true);
    setSelectedBankDetails([]);

    if (employeeId.length) {
      setInfoMessage(false);
      setPageLoader(true);

      getEmployeeBankDetails(employeeId).then((response) => {
        if (response.data.length) {
          setInfoMessage(false);

          setEmployeeBankDetails(response.data);

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setEmployeeBankDetails([]);
        }
      });
    }
  };

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: 'Are you sure remove bank details?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeBankDetails(recordId).then((response) => {
          if (response.data) {
            loadBankDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    loadBankDetails();
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

        {isSubmit && !pageLoader && !!employeeBankDetails.length ? (
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
                      {employeeBankDetails.map((item, index) => {
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
                            <TableCell align="left">{item.account_type}</TableCell>
                            <TableCell align="left">{item.account_name}</TableCell>
                            <TableCell align="left">{item.account_no}</TableCell>
                            <TableCell align="left">{item.bank_name}</TableCell>
                            <TableCell align="left">{item.branch_name}</TableCell>
                            <TableCell align="left">{item.ifsc_code}</TableCell>
                            <TableCell align="left">{item.swift_code}</TableCell>
                            <TableCell align="left" width="150">
                              <Flex align="center">
                                <IconWrapper
                                  onClick={() => {
                                    setModelType(2);
                                    setSelectedBankDetails(item);
                                    setIsEditBankModalOpen(true);
                                  }}
                                >
                                  <EditTwoTone />
                                </IconWrapper>

                                <Divider type="vertical" />

                                <IconWrapper
                                  onClick={() => {
                                    showDeleteConfirm(item.record_id);
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
        ) : (
          !pageLoader &&
          roleName[0] === UserRole.EMPLOYEE && (
            <Stack sx={{ mt: 2 }} alignItems={'center'}>
              <Button
                type="primary"
                onClick={() => {
                  setModelType(1);
                  setSelectedBankDetails([]);
                  setIsEditBankModalOpen(true);
                }}
              >
                Add Bank Details
              </Button>
            </Stack>
          )
        )}
      </Grid>
      {isEditBankModalOpen && (
        <BankModal
          employeeId={employeeId}
          modalType={modelType}
          modalOpenState={isEditBankModalOpen}
          modalData={selectedBankDetails}
          setModelState={setIsEditBankModalOpen}
          onSave={() => loadBankDetails()}
        />
      )}
    </>
  );
}
