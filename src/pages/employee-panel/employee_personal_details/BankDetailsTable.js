import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
//import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Empty, Spin } from 'antd';
import { EmployeeDetailsEnum } from '../../../utils/enum';
import { getEmployeeBankDetails } from '../../../api/common';

// material-ui
import { Box, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
//import NumberFormat from 'react-number-format';
// project import
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
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

// ==============================|| ORDER TABLE - STATUS ||============================== //

const LeaveStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case '0':
      color = 'warning';
      title = 'Pending';
      break;
    case '1':
      color = 'success';
      title = 'Approved';
      break;
    case '2':
      color = 'warning';
      title = 'Reject';
      break;
    default:
      color = 'info';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

LeaveStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function EmployeeTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const { employeeDetails } = useSelector((state) => state.common);

  const [infoMessage, setInfoMessage] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [employeeBankDetails, setEmployeeBankDetails] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  function getDocumentsList() {
    setPageLoader(true);

    getEmployeeBankDetails(employeeId).then((response) => {
      if (response.data.length) {
        setInfoMessage(false);
        setPageLoader(false);

        setEmployeeBankDetails(response.data);
      } else {
        setInfoMessage(true);
        setPageLoader(false);
      }
    });
  }

  useEffect(() => {
    getDocumentsList();
    // eslint-disable-next-line
  }, []);

  const isItemSelected = isSelected(112);

  return (
    <>
      {infoMessage && (
        <Grid item sx={{ mt: 2, mb: 2 }} xs={12}>
          <Empty />
        </Grid>
      )}

      {pageLoader && (
        <Grid item sx={{ p: 5 }} xs={12}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Grid>
      )}

      {!pageLoader && !infoMessage && !!employeeBankDetails.length && (
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
                  return (
                    <TableRow
                      key={index}
                      hover
                      role="checkbox"
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{item.account_type}</TableCell>
                      <TableCell align="left">{item.account_name}</TableCell>
                      <TableCell align="left">{item.account_no}</TableCell>
                      <TableCell align="left">{item.bank_name}</TableCell>
                      <TableCell align="left">{item.branch_name}</TableCell>
                      <TableCell align="left">{item.ifsc_code}</TableCell>
                      <TableCell align="left">{item.swift_code}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
}
