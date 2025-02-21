import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPayslipDetails, getEmpLeaveByMonth, getSpecialPayDetails } from '../../api/common';
import {
  getTotalHours,
  getLastDateOfMonthByDate,
  getYearMonthNameByDate,
  getFullDate,
  getWordsByAmount,
  getNumberOfWeekendsInMonth,
  calculateSalary,
  getYearAndMonthByDate
} from '../../utils/utils';
import { LeaveType, UserTimeSheet, LeaveApprovalType } from '../../utils/enum';
import CompanyLogo from '../../assets/images/login/login-logo.png';

// project import
import MainCard from 'components/MainCard';

// material-ui
import { Grid, Typography } from '@mui/material';
import { Spin, Descriptions, Empty } from 'antd';

PaySlip.propTypes = {
  employeeId: PropTypes.number,
  currentMonthHoliday: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setPaySlipFound: PropTypes.boolean
};

export default function PaySlip({ employeeId, currentMonthHoliday, startDate, endDate, setPaySlipFound = false }) {
  let totalCasualLeaveCount = 0;
  let totalSickLeaveCount = 0;
  let totalPaidLeaveCount = 0;
  let totalExtraPayCount = 0;

  const [pageLoader, setPageLoader] = useState(false);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [infoMessage, setInfoMessage] = useState(false);
  const [totalFullDay, setTotalFullDay] = useState([]);
  const [specialAllowance, setSpecialAllowance] = useState([]);
  const [casualLeaveCount, setCasualLeaveCount] = useState([]);
  const [sickLeaveCount, setSickLeaveCount] = useState([]);
  const [paidLeaveCount, setPaidLeaveCount] = useState([]);

  const getNoPaidDaysByMonth = () => {
    let casualLeavesByMonth = casualLeaveCount.length ? casualLeaveCount[casualLeaveCount.length - 1] : 0;
    let sickLeavesByMonth = sickLeaveCount.length ? sickLeaveCount[sickLeaveCount.length - 1] : 0;
    let paidLeavesByMonth = paidLeaveCount.length ? paidLeaveCount[paidLeaveCount.length - 1] : 0;
    let companyLeavesByMonth = casualLeavesByMonth + sickLeavesByMonth;

    let workingDays = totalFullDay.length + paidLeavesByMonth;
    let weekendsByMonth = getNumberOfWeekendsInMonth(startDate);

    let paidDaysByMonth = workingDays + weekendsByMonth + currentMonthHoliday + companyLeavesByMonth;
    let totalPaidDaysByMonth = paidDaysByMonth - paidLeavesByMonth;

    return totalPaidDaysByMonth;
  };

  const items = [
    {
      key: '1',
      label: 'Employee ID',
      children: <Typography variant="h4">{!!employeeLeaveDetails.length && employeeLeaveDetails[0].employee_code}</Typography>
    },
    {
      key: '2',
      label: 'Employee Name',
      children: (
        <Typography variant="h4">
          {!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].first_name} ${employeeLeaveDetails[0].last_name}`}
        </Typography>
      )
    },
    {
      key: '3',
      label: 'Date of Joining',
      children: <>{!!employeeLeaveDetails.length && getFullDate(employeeLeaveDetails[0].employment_start)}</>
    },
    {
      key: '4',
      label: 'Date of Birth',
      children: <>{!!employeeLeaveDetails.length && getFullDate(employeeLeaveDetails[0].date_of_birth)}</>
    },
    {
      key: '5',
      label: 'Designation',
      children: <>{!!employeeLeaveDetails.length && employeeLeaveDetails[0].job_title}</>
    },
    {
      key: '6',
      label: 'Location',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].city_name}, ${employeeLeaveDetails[0].country_name}`}</>,
      span: 2
    },
    {
      key: '4',
      label: 'No of Days',
      children: <>{getLastDateOfMonthByDate(new Date(startDate))}</>
    },
    {
      key: '4',
      label: 'No of Paid Days',
      children: <>{getNoPaidDaysByMonth()}</>
    },
    {
      key: '5',
      label: 'Taken Leaves - CL | SL | PL',
      children: (
        <div>
          <span>{casualLeaveCount.length ? casualLeaveCount[casualLeaveCount.length - 1] : 0}</span> /{' '}
          <span>{sickLeaveCount.length ? sickLeaveCount[sickLeaveCount.length - 1] : 0}</span> /{' '}
          <span>{paidLeaveCount.length ? paidLeaveCount[paidLeaveCount.length - 1] : 0}</span>
        </div>
      )
    },
    {
      key: '7',
      label: 'Employment Type',
      children: <div style={{ fontSize: '20px' }}>Permanent</div>
    },
    {
      key: '8',
      label: 'National Insurance No.',
      children: 'NA'
    },
    {
      key: '9',
      label: 'PAN No.',
      children: <>{!!employeeLeaveDetails.length && employeeLeaveDetails[0].document_number}</>,
      span: 3
    },
    {
      key: '14',
      label: 'Bank Name',
      children: <>{!!employeeLeaveDetails.length && employeeLeaveDetails[0].bank_name}</>
    },
    {
      key: '15',
      label: 'Bank Account Name',
      children: <>{!!employeeLeaveDetails.length && employeeLeaveDetails[0].account_name}</>
    },
    {
      key: '16',
      label: 'Bank Account No.',
      children: <>{!!employeeLeaveDetails.length && employeeLeaveDetails[0].account_no}</>
    },
    {
      key: '10',
      label: 'Pay Period',
      children: (
        <Typography variant="h3">{`01 ${getYearMonthNameByDate(startDate, ', ')} to ${getLastDateOfMonthByDate(
          startDate
        )} ${getYearMonthNameByDate(startDate, ', ')}`}</Typography>
      ),
      span: 4
    },
    {
      key: '11',
      label: 'Basic Pay',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${employeeLeaveDetails[0].basic_salary}`}</>
    },
    {
      key: '12',
      label: 'Special Allowance',
      children: (
        <>
          {!!employeeLeaveDetails.length &&
            `${employeeLeaveDetails[0].currency_code} ${specialAllowance.length ? specialAllowance[specialAllowance.length - 1] : 0}`}
        </>
      )
    },
    {
      key: '13',
      label: 'Deduction',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</>
    },
    {
      key: '17',
      label: 'Total Pay',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${employeeLeaveDetails[0].basic_salary}`}</>
    },
    {
      key: '18',
      label: 'Income Tax',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</>
    },
    {
      key: '19',
      label: 'National Insurance',
      children: <>{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</>
    },
    {
      key: '21',
      label: 'Totals Year To Date',
      children: (
        <>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Taxable Gross Pay</Typography>
            <Typography variant="h5">{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Income Tax</Typography>
            <Typography variant="h5">{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Employee NIC</Typography>
            <Typography variant="h5">{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Employer NIC</Typography>
            <Typography variant="h5">{!!employeeLeaveDetails.length && `${employeeLeaveDetails[0].currency_code} ${'0.00'}`}</Typography>
          </Grid>
        </>
      )
    },
    {
      key: '22',
      label: 'NET PAY INR',
      children: (
        <>
          <Typography variant="h3">
            {!!employeeLeaveDetails.length &&
              `${employeeLeaveDetails[0].currency_code} ${calculateSalary(
                employeeLeaveDetails[0].net_salary,
                paidLeaveCount.length ? paidLeaveCount[paidLeaveCount.length - 1] : 0,
                specialAllowance.length ? specialAllowance[specialAllowance.length - 1] : 0
              )} /-`}
          </Typography>
          <Typography variant="h5">
            {!!employeeLeaveDetails.length &&
              `${getWordsByAmount(
                calculateSalary(
                  employeeLeaveDetails[0].net_salary,
                  paidLeaveCount.length ? paidLeaveCount[paidLeaveCount.length - 1] : 0,
                  specialAllowance.length ? specialAllowance[specialAllowance.length - 1] : 0
                )
              )} Only.`}
          </Typography>
        </>
      ),
      span: 5
    }
  ];

  const getEmpAttendance = () => {
    setPageLoader(true);

    getPayslipDetails(employeeId, startDate, endDate).then((response) => {
      if (response.data.length) {
        setPageLoader(false);
        setInfoMessage(false);
        setPaySlipFound(true);

        setEmployeeLeaveDetails(response.data);

        setTotalFullDay(
          response.data
            .filter((item) => getTotalHours(item.Log_Hours) >= UserTimeSheet.USER_FULL_DAY_HOURS)
            .map((item) => {
              return item.length;
            })
        );

        getSpecialPayDetails(employeeId).then((response) => {
          if (response.data.length) {
            setSpecialAllowance(
              response.data
                .filter((item) => getYearAndMonthByDate(item.pay_date) === getYearAndMonthByDate(endDate))
                .map((item) => {
                  console.log(item);
                  totalExtraPayCount += Number(item.special_allowance);
                  return totalExtraPayCount;
                })
            );
          } else {
            setSpecialAllowance([]);
          }
        });
      } else {
        setInfoMessage(true);
        setPaySlipFound(false);
        setPageLoader(false);
        setEmployeeLeaveDetails([]);
        setTotalFullDay([]);
      }
    });

    getEmpLeaveByMonth(employeeId, startDate, endDate).then((response) => {
      if (response.data.length) {
        setCasualLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.CASUAL_LEAVE && item.status == LeaveApprovalType.APPROVED)
            .map((item) => {
              totalCasualLeaveCount += Number(item.leave_day);
              return totalCasualLeaveCount;
            })
        );

        setSickLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.SICK_LEAVE && item.status == LeaveApprovalType.APPROVED)
            .map((item) => {
              totalSickLeaveCount += Number(item.leave_day);
              return totalSickLeaveCount;
            })
        );

        setPaidLeaveCount(
          response.data
            .filter((item) => item.leave_type === LeaveType.PAID_LEAVE && item.status == LeaveApprovalType.APPROVED)
            .map((item) => {
              totalPaidLeaveCount += Number(item.leave_day);
              return totalPaidLeaveCount;
            })
        );
      } else {
        setCasualLeaveCount([]);
        setSickLeaveCount([]);
        setPaidLeaveCount([]);
      }
    });
  };

  useEffect(() => {
    getEmpAttendance();
    // eslint-disable-next-line
  }, [employeeId]);

  return (
    <>
      {infoMessage && (
        <Grid item sx={{ mt: 2 }} xs={12}>
          <Empty />
        </Grid>
      )}

      {pageLoader && (
        <Grid item sx={{ mt: 8 }} xs={12}>
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        </Grid>
      )}

      {!pageLoader && !infoMessage && !!employeeLeaveDetails.length && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <MainCard sx={{ pl: 5, pr: 5 }}>
            <div id="printpayslip">
              <Grid item xs={12} sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src={CompanyLogo} alt="cashmere group" />
                <Typography variant="h2">CASHMERE GROUP</Typography>
              </Grid>

              <Grid container sx={{ mb: 3 }} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h3">{getYearMonthNameByDate(startDate, ', ')}</Typography>
                  <Typography variant="h4">Payslip for the month</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3">{`${employeeLeaveDetails[0].first_name} ${employeeLeaveDetails[0].last_name}`}</Typography>
                  <Typography
                    style={{ textAlign: 'right' }}
                    variant="h4"
                  >{`${employeeLeaveDetails[0].employee_code} | ${employeeLeaveDetails[0].job_title}`}</Typography>
                </Grid>
              </Grid>

              <Descriptions
                title=""
                bordered
                items={items}
                labelStyle={{ fontSize: '20px', color: 'black' }}
                contentStyle={{ fontSize: '20px' }}
              />

              <Grid container sx={{ mt: 4, mb: 4 }} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <span style={{ fontSize: '22px' }}>
                    Note : This is a computer generated pay slip and does not require authentication.
                  </span>
                </Grid>
                <Grid item />
              </Grid>
            </div>
          </MainCard>
        </Grid>
      )}
    </>
  );
}
