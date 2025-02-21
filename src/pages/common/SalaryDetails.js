import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TitleWrapper, IconWrapper } from './CommonStyled';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Alert, Select, Input, Divider, Button, Flex, Spin, Empty } from 'antd';
import MainCard from 'components/MainCard';
import { getEmployee, getCurrencyType, getEmployeeSalaryDetails, updateSalaryDetails } from '../../api/common';

// assets
import { EditTwoTone } from '@ant-design/icons';

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
    id: 'basic_salary',
    align: 'left',
    disablePadding: false,
    label: 'Basic Salary'
  },
  {
    id: 'gross_salary',
    align: 'left',
    disablePadding: false,
    label: 'Gross Salary'
  },
  {
    id: 'net_salary',
    align: 'left',
    disablePadding: false,
    label: 'Net Salary'
  },

  {
    id: 'currency_code',
    align: 'left',
    disablePadding: false,
    label: 'Currency Code'
  },
  {
    id: 'currency_name',
    align: 'left',
    disablePadding: false,
    label: 'Currency Name'
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

export default function SalaryDetails() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [isSubmit, setIsSubmit] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [basicSalaryInput, setBasicSalaryInput] = useState(0);
  const [grossSalaryInput, setGrossSalaryInput] = useState(0);
  const [netSalaryInput, setNetSalaryInput] = useState(0);
  const [currencyOption, setCurrencyOption] = useState('');

  const [employeeSalaryDetails, setEmployeeSalaryDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [selectedCurrencyType, setSelectedCurrencyType] = useState(0);
  const [employeeListOptions, setEmployeeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const [currencyListOptions, setCurrencyListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const salaryUpdateObj = {
    employeeId: Number(selectedEmployee),
    basicSalary: basicSalaryInput,
    grossSalary: grossSalaryInput,
    netSalary: netSalaryInput,
    currencyTypeId: selectedCurrencyType
  };

  const salaryUpdateHandler = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    updateSalaryDetails(salaryUpdateObj).then((response) => {
      if (response.data) {
        setIsEditable(false);

        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });

        loadEmployeeSalaryDetails();
      }
    });
  };

  const employeeNameHandleChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const currencyHandleChange = (currencyType) => {
    setSelectedCurrencyType(currencyType);
  };

  const loadEmployeeSalaryDetails = () => {
    setIsSubmit(true);

    if (selectedEmployee.length) {
      setInfoMessage(false);
      setPageLoader(true);

      getEmployeeSalaryDetails(selectedEmployee).then((response) => {
        if (response.data.length) {
          setInfoMessage(false);

          setEmployeeSalaryDetails(response.data);

          setBasicSalaryInput(response.data[0].basic_salary);
          setGrossSalaryInput(response.data[0].gross_salary);
          setNetSalaryInput(response.data[0].net_salary);
          setCurrencyOption(`${response.data[0].currency_code} - ${response.data[0].currency_name}`);
          setSelectedCurrencyType(response.data[0].id);

          setPageLoader(false);
        } else {
          setPageLoader(false);
          setInfoMessage(true);
          setEmployeeSalaryDetails([]);
        }
      });
    }
  };

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data) {
        setEmployeeListOptions(
          response.data.map((item) => {
            return { label: `${item?.first_name} ${item?.last_name}`, value: item?.id };
          })
        );
      }
    });

    getCurrencyType().then((response) => {
      if (response.data) {
        setCurrencyListOptions(
          response.data.map((item) => {
            return { label: `${item?.currency_code} - ${item?.currency_name}`, value: item?.id };
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
    <Grid item xs={12} md={7} lg={12}>
      <Grid item xs={12} md={7} lg={12}>
        <TitleWrapper>
          <Typography variant="h5">Employee Salary Details List</Typography>
        </TitleWrapper>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={12}>
        <MainCard sx={{ p: 4 }} content={false}>
          <Flex gap={12}>
            <Select
              defaultValue={'Select'}
              style={{
                width: 250
              }}
              onChange={employeeNameHandleChange}
              options={employeeListOptions}
            />
            <Button type="primary" onClick={() => loadEmployeeSalaryDetails()}>
              Submit
            </Button>
          </Flex>
        </MainCard>
      </Grid>

      {isSubmit && selectedEmployee === 0 && (
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Alert
            message="Warning Message"
            description="Please select employee from the list."
            type="warning"
            showIcon
            closable
            afterClose={() => setInfoMessage(false)}
          />
        </Grid>
      )}

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

      {isSubmit && !pageLoader && !!employeeSalaryDetails.length && (
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
                    {employeeSalaryDetails.map((item, index) => {
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
                          <TableCell align="left">
                            {isEditable ? (
                              <Input
                                placeholder="Basic Salary"
                                value={basicSalaryInput}
                                onChange={(e) => {
                                  setBasicSalaryInput(e.target.value);
                                }}
                              />
                            ) : (
                              item.basic_salary
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {isEditable ? (
                              <Input
                                placeholder="Gross Salary"
                                value={grossSalaryInput}
                                onChange={(e) => {
                                  setGrossSalaryInput(e.target.value);
                                }}
                              />
                            ) : (
                              item.gross_salary
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {isEditable ? (
                              <Input
                                placeholder="Net Salary"
                                value={netSalaryInput}
                                onChange={(e) => {
                                  setNetSalaryInput(e.target.value);
                                }}
                              />
                            ) : (
                              item.net_salary
                            )}
                          </TableCell>

                          <TableCell align="left">
                            {isEditable ? (
                              <Select
                                defaultValue={currencyOption}
                                onChange={currencyHandleChange}
                                options={currencyListOptions}
                                style={{
                                  width: 150
                                }}
                              />
                            ) : (
                              item.currency_code
                            )}
                          </TableCell>

                          <TableCell align="left">{item.currency_name}</TableCell>

                          <TableCell align="left" width="150">
                            {isEditable ? (
                              <Flex align="center">
                                <Button
                                  type="primary"
                                  loading={loadings[1]}
                                  onClick={() => salaryUpdateHandler(1)}
                                  style={{ backgroundColor: 'green' }}
                                >
                                  Update
                                </Button>

                                <Divider type="vertical" />

                                <Button type="primary" onClick={() => setIsEditable(!isEditable)} style={{ backgroundColor: 'red' }}>
                                  Cancel
                                </Button>
                              </Flex>
                            ) : (
                              <IconWrapper onClick={() => setIsEditable(!isEditable)}>
                                <EditTwoTone />
                              </IconWrapper>
                            )}
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
  );
}
