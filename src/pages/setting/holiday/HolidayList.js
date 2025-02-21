import React, { useEffect, useState } from 'react';
import { IconWrapper } from '../../common/CommonStyled';
import PropTypes from 'prop-types';
import HolidayListModal from '../../common/modal/HolidayListModal';
import { Box, Grid, Table, Stack, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spin, Button, Flex, Divider, Modal, Empty } from 'antd';
import MainCard from 'components/MainCard';
import { getHolidaysList, removeHolidayList } from '../../../api/common';
import { getFullDate, getDayNameByDate } from '../../../utils/utils';

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
    id: 'holiday_name',
    align: 'left',
    disablePadding: false,
    label: 'Holiday Name'
  },
  {
    id: 'day',
    align: 'left',
    disablePadding: false,
    label: 'Day'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
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

export default function HolidayList() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const [isSubmit, setIsSubmit] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [modelType, setModelType] = useState(1);

  const [isAddHolidayListModalOpen, setIsAddHolidayListModalOpen] = useState(false);
  const [isEditHolidayListModalOpen, setIsEditHolidayListModalOpen] = useState(false);

  const [holidayList, setHolidayList] = useState([]);
  const [selectedHolidayList, setSelectedHolidayList] = useState([]);

  const holidayListDetails = () => {
    setIsSubmit(true);

    setInfoMessage(false);
    setPageLoader(true);

    getHolidaysList().then((response) => {
      if (response.data.length) {
        setInfoMessage(false);

        setHolidayList(response.data);

        setPageLoader(false);
      } else {
        setPageLoader(false);
        setInfoMessage(true);
        setHolidayList([]);
      }
    });
  };

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: 'Are you sure remove this holiday?',
      icon: <ExclamationCircleFilled style={{ fontSize: '32px' }} />,
      content: 'Make sure this action can not be undone.',
      okText: 'Submit',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        removeHolidayList(+recordId).then((response) => {
          if (response.data) {
            holidayListDetails();
          }
        });
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    holidayListDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid item sx={{ mt: 4, mb: 4 }} xs={12} md={7} lg={12}>
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
                setIsAddHolidayListModalOpen(true);
              }}
            >
              Add Holiday
            </Button>
          </Grid>
        </Stack>

        {isSubmit && !pageLoader && !!holidayList.length && (
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
                      {holidayList.map((item, index) => {
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
                            <TableCell align="left">{item.holiday_name}</TableCell>
                            <TableCell align="left">{getDayNameByDate(item.holiday_date)}</TableCell>
                            <TableCell align="left">{getFullDate(item.holiday_date)}</TableCell>
                            <TableCell align="left" width="150">
                              <Flex align="center">
                                <IconWrapper
                                  onClick={() => {
                                    setModelType(2);
                                    setSelectedHolidayList(item);
                                    setIsEditHolidayListModalOpen(true);
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
      {isAddHolidayListModalOpen && (
        <HolidayListModal
          modalType={modelType}
          modalOpenState={isAddHolidayListModalOpen}
          modalData={selectedHolidayList}
          setModelState={setIsAddHolidayListModalOpen}
          onSave={() => holidayListDetails()}
        />
      )}

      {isEditHolidayListModalOpen && (
        <HolidayListModal
          modalType={modelType}
          modalOpenState={isEditHolidayListModalOpen}
          modalData={selectedHolidayList}
          setModelState={setIsEditHolidayListModalOpen}
          onSave={() => holidayListDetails()}
        />
      )}
    </Grid>
  );
}
