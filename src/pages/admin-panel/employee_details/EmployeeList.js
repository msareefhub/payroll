import React, { useEffect, useState } from 'react';
import { IconWrapper } from '../../common/CommonStyled';
import PropTypes from 'prop-types';
import EmployeeListModal from '../../common/modal/EmployeeListModal';
import { TitleWrapper } from '../../common/CommonStyled';
import MainCard from 'components/MainCard';
import { getEmployee, removeEmployeeList } from '../../../api/common';
import { getFullDate } from '../../../utils/utils';

// material-ui
import { Box, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, Typography, TableRow } from '@mui/material';

// antD-ui
import { Avatar, Spin, Button, Flex, Divider, Modal, Empty } from 'antd';

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
    id: 'first_name',
    align: 'left',
    disablePadding: true,
    label: 'Employee Name'
  },
  {
    id: 'department',
    align: 'left',
    disablePadding: false,
    label: 'Department'
  },
  {
    id: 'designation',
    align: 'left',
    disablePadding: false,
    label: 'Designation'
  },
  {
    id: 'date_of_joining',
    align: 'left',
    disablePadding: false,
    label: 'Date of Joining'
  },
  {
    id: 'date_of_birth',
    align: 'left',
    disablePadding: false,
    label: 'Date of Birth'
  },
  {
    id: 'office_email',
    align: 'left',
    disablePadding: false,
    label: 'Primary E-Mail'
  },
  {
    id: 'primary_contact',
    align: 'left',
    disablePadding: false,
    label: 'Primary Contact'
  },
  {
    id: 'location',
    align: 'left',
    disablePadding: false,
    label: 'Location'
  },
  {
    id: 'action',
    align: 'left',
    disablePadding: false,
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

export default function EmployeeList() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [modelType, setModelType] = useState(1);

  const [isAddEmployeeListModalOpen, setIsAddEmployeeListModalOpen] = useState(false);
  const [isEditEmployeeListModalOpen, setIsEditEmployeeListModalOpen] = useState(false);

  const [EmployeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeList, setSelectedEmployeeList] = useState([]);

  const EmployeeListDetails = () => {
    setIsSubmit(true);

    setInfoMessage(false);
    setPageLoader(true);

    getEmployee().then((response) => {
      if (response.data.length) {
        setInfoMessage(false);

        setEmployeeList(response.data);

        setPageLoader(false);
      } else {
        setPageLoader(false);
        setInfoMessage(true);
        setEmployeeList([]);
      }
    });
  };

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: 'Are you sure remove this employee?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeEmployeeList(+recordId).then((response) => {
          if (response.data) {
            EmployeeListDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    EmployeeListDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid item sx={{ mb: 4 }} xs={12} md={7} lg={12}>
      <Grid item sx={{ mb: 3 }} xs={12}>
        <TitleWrapper>
          <Typography variant="h5">Employees Details</Typography>
        </TitleWrapper>
      </Grid>

      <Grid item xs={12} md={7} lg={12}>
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
                setIsAddEmployeeListModalOpen(true);
              }}
            >
              Add Employee
            </Button>
          </Grid>
        </Stack>

        {isSubmit && !pageLoader && !!EmployeeList.length && (
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
                      {EmployeeList.map((item, index) => {
                        const isItemSelected = isSelected(112);
                        const labelId = `enhanced-table-checkbox-${index}`;

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
                            <TableCell component="th" id={labelId} scope="item" align="left">
                              {item.employee_code}
                            </TableCell>
                            <TableCell align="left">
                              {
                                <>
                                  <Avatar src={require(`../../../assets/images/users/${item?.profile_image}`)} />
                                  <Divider type="vertical" />
                                  <span>{`${item?.first_name} ${item?.last_name}`}</span>
                                </>
                              }
                            </TableCell>
                            <TableCell align="left">{item.department_name}</TableCell>
                            <TableCell align="left">{item.job_title}</TableCell>
                            <TableCell align="left">{getFullDate(item.employment_start)}</TableCell>
                            <TableCell align="left">{getFullDate(item.date_of_birth)}</TableCell>
                            <TableCell align="left">{item.office_email}</TableCell>
                            <TableCell align="left">{item.primary_contact}</TableCell>
                            <TableCell align="left">{`${item.city_name}, ${item.country_name}`}</TableCell>
                            <TableCell align="left" width="150">
                              <Flex align="center">
                                <IconWrapper
                                  onClick={() => {
                                    setModelType(2);
                                    setSelectedEmployeeList(item);
                                    setIsEditEmployeeListModalOpen(true);
                                  }}
                                >
                                  <EditTwoTone />
                                </IconWrapper>

                                <Divider type="vertical" />

                                <IconWrapper
                                  onClick={() => {
                                    showDeleteConfirm(item.id);
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
      {isAddEmployeeListModalOpen && (
        <EmployeeListModal
          modalType={modelType}
          modalOpenState={isAddEmployeeListModalOpen}
          modalData={selectedEmployeeList}
          setModelState={setIsAddEmployeeListModalOpen}
          onSave={() => EmployeeListDetails()}
        />
      )}

      {isEditEmployeeListModalOpen && (
        <EmployeeListModal
          modalType={modelType}
          modalOpenState={isEditEmployeeListModalOpen}
          modalData={selectedEmployeeList}
          setModelState={setIsEditEmployeeListModalOpen}
          onSave={() => EmployeeListDetails()}
        />
      )}
    </Grid>
  );
}
