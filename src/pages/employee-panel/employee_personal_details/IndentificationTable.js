import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
//import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin, Empty } from 'antd';
import { EmployeeDetailsEnum } from '../../../utils/enum';
import { getEmployeeDocuments } from '../../../api/common';

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
    id: 'document_type',
    align: 'left',
    disablePadding: false,
    label: 'Document Type'
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
  const [employeeDocumetsList, setEmployeeDocumetsList] = useState([]);

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  function getDocumentsList() {
    setPageLoader(true);

    getEmployeeDocuments(employeeId).then((response) => {
      if (response.data.length) {
        setInfoMessage(false);
        setPageLoader(false);

        setEmployeeDocumetsList(response.data);
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

      {!pageLoader && !infoMessage && !!employeeDocumetsList.length && (
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
                {employeeDocumetsList.map((item, index) => {
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
                      <TableCell align="left">{item.document_name}</TableCell>
                      <TableCell align="left">{item.document_number}</TableCell>
                      <TableCell align="left">{item.country_name}</TableCell>
                      <TableCell align="left">{item.city_name}</TableCell>
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
