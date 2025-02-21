import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getEmployee } from '../../../api/common';
import { getFullDate } from '../../../utils/utils';

//import { useDispatch } from 'react-redux';
//import { setEmployeeEditStatus, setCurrentEmployeeId } from 'store/reducers/common';

// material-ui
import { Box, Link, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { Avatar, Divider, Spin } from 'antd';

// third-party
//import NumberFormat from 'react-number-format';
// project import
import Dot from 'components/@extended/Dot';

// function createData(trackingNo, name, fat, carbs, protein) {
//   return { trackingNo, name, fat, carbs, protein };
// }

// const rows = [
//   createData(84564564, 'Camera Lens', 40, 2, 40570),
//   createData(98764564, 'Laptop', 300, 0, 180139),
//   createData(98756325, 'Mobile', 355, 1, 90989),
//   createData(98652366, 'Handset', 50, 1, 10239),
//   createData(13286564, 'Computer Accessories', 100, 1, 83348),
//   createData(86739658, 'TV', 99, 0, 410780),
//   createData(13256498, 'Keyboard', 125, 2, 70999),
//   createData(98753263, 'Mouse', 89, 2, 10570),
//   createData(98753275, 'Desktop', 185, 1, 98063),
//   createData(98753291, 'Chair', 100, 0, 14001)
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

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
    label: 'Date Of Birth'
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
  }
  // {
  //   id: 'delete',
  //   align: 'left',
  //   disablePadding: false,
  //   label: 'Delete'
  // }
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

const OrderStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function EmployeeTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  function getEmployeeDetails() {
    setPageLoader(true);

    getEmployee().then((response) => {
      if (response.data.length) {
        setPageLoader(false);
        setEmployeeDetails(response.data);
      }
    });
  }

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <Box>
      {pageLoader && (
        <Grid item sx={{ pt: 8, pb: 8 }} xs={12}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Grid>
      )}

      {!pageLoader && (
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
              {employeeDetails.map((row, index) => {
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
                    <TableCell component="th" id={labelId} scope="row" align="left">
                      <Link color="secondary" component={RouterLink} to="">
                        {row.employee_code}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      {
                        <>
                          <Avatar src={require(`../../../assets/images/users/${row?.profile_image}`)} />
                          <Divider type="vertical" />
                          <span>{`${row?.first_name} ${row?.last_name}`}</span>
                        </>
                      }
                    </TableCell>
                    <TableCell align="left">{row.department_name}</TableCell>
                    <TableCell align="left">{row.job_title}</TableCell>
                    <TableCell align="left">{getFullDate(row.employment_start)}</TableCell>
                    <TableCell align="left">{getFullDate(row.date_of_birth)}</TableCell>
                    <TableCell align="left">{row.office_email}</TableCell>
                    <TableCell align="left">{row.primary_contact}</TableCell>
                    <TableCell align="left">{`${row.city_name}, ${row.country_name}`}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
