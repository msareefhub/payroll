import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IconWrapper } from './CommonStyled';
import SpecialAllowanceModal from './modal/SpecialAllowanceModal';
import { Box, Grid, Table, Stack, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spin, Button, Flex, Divider, Modal, Empty } from 'antd';
import MainCard from 'components/MainCard';
import { getSpecialPayDetails, removeSpecialAllowance } from '../../api/common';

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
    id: 'pay_date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'special_bonus',
    align: 'left',
    disablePadding: true,
    label: 'Special Bonus'
  },
  {
    id: 'special_allowance',
    align: 'left',
    disablePadding: true,
    label: 'Special Allowance'
  },
  {
    id: 'travel_allowance',
    align: 'left',
    disablePadding: true,
    label: 'Travel Allowance'
  },
  {
    id: 'mobile_allowance',
    align: 'left',
    disablePadding: true,
    label: 'Mobile Allowance'
  },
  {
    id: 'internet_allowance',
    align: 'left',
    disablePadding: true,
    label: 'Internet Allowance'
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

SpecialAllowance.propTypes = {
  employeeId: PropTypes.number
};

export default function SpecialAllowance({ employeeId }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [modelType, setModelType] = useState(1);
  const [isAddSpecialAllowanceModalOpen, setIsAddSpecialAllowanceModalOpen] = useState(false);
  const [isEditSpecialAllowanceModalOpen, setIsEditSpecialAllowanceModalOpen] = useState(false);

  const [specialAllowance, setSpecialAllowance] = useState([]);
  const [selectedSpecialAllowance, setSelectedSpecialAllowance] = useState([]);

  const specialAllowanceDetails = () => {
    setIsSubmit(true);

    if (employeeId.length) {
      setInfoMessage(false);
      setPageLoader(true);

      getSpecialPayDetails(employeeId).then((response) => {
        if (response.data.length) {
          setInfoMessage(false);

          setSpecialAllowance(response.data);

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setSpecialAllowance([]);
        }
      });
    }
  };

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: 'Are you sure remove this Allowance?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeSpecialAllowance(recordId).then((response) => {
          if (response.data) {
            specialAllowanceDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    specialAllowanceDetails();
    // eslint-disable-next-line
  }, [employeeId]);

  return (
    <>
      <Grid item sx={{ mt: 4, mb: 4 }} xs={12} md={7} lg={12}>
        {infoMessage && (
          <Grid item xs={12}>
            <Empty />
          </Grid>
        )}

        {pageLoader && (
          <Grid item sx={{ mt: 8, mb: 8 }} xs={12}>
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          </Grid>
        )}

        <Stack alignItems={'end'}>
          <Grid item xs={12} md={7} lg={12}>
            <Button
              type="primary"
              onClick={() => {
                setModelType(1);
                setIsAddSpecialAllowanceModalOpen(true);
              }}
            >
              Add Allowances
            </Button>
          </Grid>
        </Stack>

        {isSubmit && !pageLoader && !!specialAllowance.length && (
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
                      {specialAllowance.map((item, index) => {
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
                            <TableCell align="left">{item.pay_date}</TableCell>
                            <TableCell align="left">{item.special_bonus}</TableCell>
                            <TableCell align="left">{item.special_allowance}</TableCell>
                            <TableCell align="left">{item.travel_allowance}</TableCell>
                            <TableCell align="left">{item.mobile_allowance}</TableCell>
                            <TableCell align="left">{item.internet_allowance}</TableCell>
                            <TableCell align="left" width="150">
                              <Flex align="center">
                                <IconWrapper
                                  onClick={() => {
                                    setModelType(2);
                                    setSelectedSpecialAllowance(item);
                                    setIsEditSpecialAllowanceModalOpen(true);
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
        )}
      </Grid>
      {isAddSpecialAllowanceModalOpen && (
        <SpecialAllowanceModal
          employeeId={employeeId}
          modalType={modelType}
          modalOpenState={isAddSpecialAllowanceModalOpen}
          modalData={selectedSpecialAllowance}
          setModelState={setIsAddSpecialAllowanceModalOpen}
          onSave={specialAllowanceDetails}
        />
      )}

      {isEditSpecialAllowanceModalOpen && (
        <SpecialAllowanceModal
          employeeId={employeeId}
          modalType={modelType}
          modalOpenState={isEditSpecialAllowanceModalOpen}
          modalData={selectedSpecialAllowance}
          setModelState={setIsEditSpecialAllowanceModalOpen}
          onSave={specialAllowanceDetails}
        />
      )}
    </>
  );
}
