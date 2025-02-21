import React from 'react';
import { TitleWrapper } from './CommonStyled';
import { Box, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Spin, Empty, Tag, Divider, Avatar } from 'antd';
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getFullDate, getTimeFormat, checkUserLoginStatus } from '../../utils/utils';
import { getEmployee } from '../../api/common';

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'S No.'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Employee Code'
  },
  {
    id: 'login_time',
    align: 'left',
    disablePadding: false,
    label: 'Employee Name'
  },
  {
    id: 'logout_time',
    align: 'left',
    disablePadding: false,
    label: 'Shift Timing'
  },
  {
    id: 'login_hours',
    align: 'left',
    disablePadding: false,
    label: 'Current Login Status'
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
    case 'Half Day':
      color = 'warning';
      title = 'Half Day';
      break;
    case 'Full Day':
      color = 'success';
      title = 'Full Day';
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

export default function UserLoginStatus() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [employeeListDetails, setEmployeeListDetails] = useState([]);

  function getEmployeeDetails() {
    setInfoMessage(false);
    setPageLoader(true);

    getEmployee().then((response) => {
      if (response.data.length) {
        setInfoMessage(false);

        setEmployeeListDetails(response.data);

        setPageLoader(false);
      } else {
        setPageLoader(false);
        setInfoMessage(true);
        setEmployeeListDetails([]);
      }
    });
  }

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid item xs={12} md={7} lg={12}>
      <MainCard content={false}>
        <Grid item xs={12} md={7} lg={12}>
          <TitleWrapper>
            <Grid container xs={12} md={7} lg={12} alignItems="center" justifyContent="space-between">
              <Typography variant="h5">Current Login Status</Typography>
              <Typography variant="h6">
                <Tag color={'#009688'} style={{ fontSize: '14px', padding: '5px' }}>
                  {getFullDate(new Date())}
                </Tag>
              </Typography>
            </Grid>
          </TitleWrapper>
        </Grid>

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

        {!pageLoader && !!employeeListDetails.length && (
          <Grid item xs={12} md={7} lg={12}>
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
                      {employeeListDetails.map((row, index) => {
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
                            <TableCell align="left">{row?.employee_code}</TableCell>
                            <TableCell align="left">
                              {
                                <>
                                  <Avatar src={require(`../../assets/images/users/${row?.profile_image}`)} />
                                  <Divider type="vertical" />
                                  <span>{`${row?.first_name} ${row?.last_name}`}</span>
                                </>
                              }
                            </TableCell>
                            <TableCell align="left">
                              {
                                <>
                                  <Tag color={'#009688'} style={{ fontSize: '14px' }}>
                                    {getTimeFormat(row?.start_shift)}
                                  </Tag>
                                  <Divider type="vertical" />
                                  To
                                  <Divider type="vertical" />
                                  <Tag color={'#2196F3'} style={{ fontSize: '14px' }}>
                                    {getTimeFormat(row?.end_shift)}
                                  </Tag>
                                </>
                              }
                            </TableCell>
                            <TableCell align="left">
                              <Stack direction="row" spacing={1} alignItems="center">
                                {row?.is_login == 1 ? (
                                  <>
                                    <Dot color="success" />
                                    <Tag color="#009688" style={{ fontSize: '14px' }}>
                                      Active
                                    </Tag>
                                  </>
                                ) : checkUserLoginStatus(row.start_shift, row.end_shift) ? (
                                  <>
                                    <Dot color="warning" />
                                    <Tag color="#FF9800" style={{ fontSize: '14px' }}>
                                      Away
                                    </Tag>
                                  </>
                                ) : (
                                  <>
                                    <Dot color="info" />
                                    <Tag color="#9E9E9E" style={{ fontSize: '14px' }}>
                                      In-Active
                                    </Tag>
                                  </>
                                )}
                              </Stack>
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
      </MainCard>
    </Grid>
  );
}
