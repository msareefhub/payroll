// project import
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { TitleWrapper } from '../../common/CommonStyled';
import PaySlip from '../../common/PaySlip';
import generatePDF from 'react-to-pdf';
import { getEmployee, getCurrentMonthHoliday } from '../../../api/common';
import {
  getYearMonthNameByDate,
  getPreviousMonthAndDate,
  getPreviousMonthStartDateFormat,
  getLastDateOfMonthByDate,
  getFirstDateOfMonth,
  getPayLastDateOfMonthByDate,
  getYearAndMonthByDate
} from '../../../utils/utils';
import { PrinterTwoTone } from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';

// material-ui
import { Grid, Typography } from '@mui/material';
import { DatePicker, Button, Flex, Select, Tooltip, Alert } from 'antd';

export default function Payslip_Wrapper() {
  const monthFormat = 'YYYY-MM';
  const [currentMonthHoliday, setCurrentMonthHoliday] = useState(0);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [infoMessage, setInfoMessage] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(0);
  const [startMonthDate, setStartMonthDate] = useState(getPreviousMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate, setEndMonthDate] = useState(getPreviousMonthStartDateFormat(new Date(), getPayLastDateOfMonthByDate(new Date())));
  const [employeeListOptions, setEmployeeListOptions] = useState([
    {
      value: '',
      label: ''
    }
  ]);

  const loadMonthReport = () => {
    if (selectedEmployee.length) {
      setIsSubmit(true);
      setInfoMessage(false);

      getHolidaysByMonth();
    } else {
      setIsSubmit(false);
      setInfoMessage(true);
    }
  };

  const onChange = (date, dateString) => {
    const lastDateofMonth = getLastDateOfMonthByDate(`${dateString}-1`);

    setStartMonthDate(`${dateString}-1`);
    setEndMonthDate(`${dateString}-${lastDateofMonth}`);
    setIsSubmit(false);
  };

  const savePdfOptions = {
    filename: `${
      !!employeeLeaveDetails.length && `${employeeLeaveDetails[0].employee_code}_${getYearMonthNameByDate(startMonthDate, '_')}.pdf`
    }`,
    page: {
      margin: 10
    }
  };

  const getTargetElement = () => document.getElementById('printpayslip');
  const downloadPdf = () => generatePDF(getTargetElement, savePdfOptions);

  const employeeNameHandleChange = (employeeId) => {
    setIsSubmit(false);
    setSelectedEmployee(employeeId);
  };

  const getEmployeeDetails = () => {
    getEmployee().then((response) => {
      if (response.data) {
        setEmployeeLeaveDetails(response.data);

        setEmployeeListOptions(
          response.data.map((item) => {
            return { label: `${item?.first_name} ${item?.last_name}`, value: item?.id };
          })
        );
      }
    });
  };

  const getHolidaysByMonth = () => {
    getCurrentMonthHoliday(getYearAndMonthByDate(endMonthDate)).then((response) => {
      if (response.data.length) {
        setCurrentMonthHoliday(response.data.length);
      } else {
        setCurrentMonthHoliday(0);
      }
    });
  };

  useEffect(() => {
    getEmployeeDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <>
        <Grid item xs={12}>
          <TitleWrapper>
            <Typography variant="h5">Payslip By Month</Typography>
          </TitleWrapper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={12}>
          <MainCard sx={{ p: 4 }} content={false}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Flex gap={12}>
                <Select
                  defaultValue={'Select'}
                  style={{
                    width: 250
                  }}
                  onChange={employeeNameHandleChange}
                  options={employeeListOptions}
                />

                <DatePicker
                  onChange={onChange}
                  defaultValue={dayjs(getPreviousMonthAndDate(new Date()), monthFormat)}
                  picker="month"
                  disabledDate={(current) => current.isBefore('2024') || current.isAfter(getPreviousMonthAndDate(new Date()))}
                />
                <Button type="primary" onClick={() => loadMonthReport()}>
                  Submit
                </Button>
              </Flex>
              {isSubmit && !!selectedEmployee.length && (
                <Tooltip title="Print Payslip">
                  <PrinterTwoTone onClick={downloadPdf} style={{ fontSize: '32px' }} />
                </Tooltip>
              )}
            </Grid>
          </MainCard>
        </Grid>
      </>

      {infoMessage && selectedEmployee === 0 && (
        <Grid item xs={12}>
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

      {isSubmit && !!selectedEmployee.length && (
        <PaySlip
          employeeId={selectedEmployee}
          currentMonthHoliday={currentMonthHoliday}
          startDate={startMonthDate}
          endDate={endMonthDate}
        />
      )}
    </>
  );
}
