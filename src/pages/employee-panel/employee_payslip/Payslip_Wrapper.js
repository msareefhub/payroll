// project import
import { useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { TitleWrapper } from '../../common/CommonStyled';
import PaySlip from '../../common/PaySlip';
import generatePDF from 'react-to-pdf';
import { getCurrentMonthHoliday } from '../../../api/common';
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
import { EmployeeDetailsEnum } from '../../../utils/enum';

// project import
import MainCard from 'components/MainCard';

// material-ui
import { Grid, Typography } from '@mui/material';
import { DatePicker, Button, Flex, Tooltip } from 'antd';

export default function Payslip_Wrapper() {
  const monthFormat = 'YYYY-MM';
  const [isPaySlip, setIsPaySlip] = useState(false);
  const { employeeDetails } = useSelector((state) => state.common);
  const [currentMonthHoliday, setCurrentMonthHoliday] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [startMonthDate, setStartMonthDate] = useState(getPreviousMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate, setEndMonthDate] = useState(getPreviousMonthStartDateFormat(new Date(), getPayLastDateOfMonthByDate(new Date())));

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const loadMonthReport = () => {
    setIsSubmit(true);
    getHolidaysByMonth();
  };

  const onChange = (date, dateString) => {
    const lastDateofMonth = getLastDateOfMonthByDate(`${dateString}-1`);

    setStartMonthDate(`${dateString}-1`);
    setEndMonthDate(`${dateString}-${lastDateofMonth}`);

    setIsPaySlip(false);
    setIsSubmit(false);
  };

  const savePdfOptions = {
    filename: !!employeeDetails.length && `${`${EmployeeDetailsEnum.EMPLOYEE_CODE}_${getYearMonthNameByDate(startMonthDate, '_')}.pdf`}`,
    page: {
      margin: 10
    }
  };

  const getTargetElement = () => document.getElementById('printpayslip');
  const downloadPdf = () => generatePDF(getTargetElement, savePdfOptions);

  const getHolidaysByMonth = () => {
    getCurrentMonthHoliday(getYearAndMonthByDate(endMonthDate)).then((response) => {
      if (response.data.length) {
        setCurrentMonthHoliday(response.data.length);
      } else {
        setCurrentMonthHoliday(0);
      }
    });
  };

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
              {isPaySlip && isSubmit && (
                <Tooltip title="Print Payslip">
                  <PrinterTwoTone onClick={downloadPdf} style={{ fontSize: '32px' }} />
                </Tooltip>
              )}
            </Grid>
          </MainCard>
        </Grid>
      </>

      {isSubmit && (
        <PaySlip
          employeeId={employeeId}
          currentMonthHoliday={currentMonthHoliday}
          startDate={startMonthDate}
          endDate={endMonthDate}
          setPaySlipFound={setIsPaySlip}
        />
      )}
    </>
  );
}
