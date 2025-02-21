import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TitleWrapper } from '../../common/CommonStyled';
import { getEmpAttendanceReport, getEmpLeaveByMonth } from '../../../api/common';
import { getTotalHours, getMonthStartDateFormat, getFirstDateOfMonth, getLastDateOfMonth } from '../../../utils/utils';
import { EmployeeDetailsEnum } from '../../../utils/enum';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce';

// material-ui
import { Grid, Typography, Stack } from '@mui/material';
import { AssignmentInd, Hail } from '@mui/icons-material';

// third-party
//import NumberFormat from 'react-number-format';
// project import
import Dot from 'components/@extended/Dot';

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

export default function AttendanceStatusTab() {
  const { employeeDetails } = useSelector((state) => state.common);
  const [pageLoader, setPageLoader] = useState(false);
  const [employeeLeaveDetails, setEmployeeLeaveDetails] = useState([]);
  const [infoMessage, setInfoMessage] = useState(false);
  const [totalFullDay, setTotalFullDay] = useState([]);
  const [totalHalfDay, setTotalHalfDay] = useState([]);
  const [totalLeaveDay, setTotalLeaveDay] = useState([]);
  const [startMonthDate] = useState(getMonthStartDateFormat(new Date(), getFirstDateOfMonth()));
  const [endMonthDate] = useState(getMonthStartDateFormat(new Date(), getLastDateOfMonth()));

  let totalLeaveCount = 0;

  let employeeId = !!employeeDetails.length && employeeDetails[EmployeeDetailsEnum.EMPLOYEE_ID];

  const [monthDateRange] = useState({
    employeeId: employeeId,
    startDate: startMonthDate,
    endDate: endMonthDate
  });

  const getEmpAttendance = () => {
    setPageLoader(true);

    getEmpAttendanceReport(monthDateRange['employeeId'], monthDateRange['startDate'], monthDateRange['endDate']).then((response) => {
      if (response.data.length) {
        setPageLoader(false);
        setInfoMessage(false);

        setEmployeeLeaveDetails(response.data);

        setTotalFullDay(
          response.data
            .filter((item) => getTotalHours(item.Log_Hours) >= 6)
            .map((item) => {
              return item.length;
            })
        );

        setTotalHalfDay(
          response.data
            .filter((item) => getTotalHours(item.Log_Hours) < 6)
            .map((item) => {
              return item.length;
            })
        );
      } else {
        setInfoMessage(true);
        setPageLoader(false);
        setEmployeeLeaveDetails([]);
        setTotalFullDay(0);
        setTotalHalfDay(0);
      }
    });

    getEmpLeaveByMonth(monthDateRange['employeeId'], startMonthDate, endMonthDate).then((response) => {
      if (response.data.length) {
        setTotalLeaveDay(
          response.data.map((item) => {
            totalLeaveCount += Number(item.leave_day);
            return totalLeaveCount;
          })
        );
      } else {
        setTotalLeaveDay(2);
      }
    });
  };

  useEffect(() => {
    getEmpAttendance();
    // eslint-disable-next-line
  }, [monthDateRange]);

  return (
    <>
      {!pageLoader && !infoMessage && !!employeeLeaveDetails.length && (
        <>
          <Grid item xs={12}>
            <TitleWrapper>
              <Typography variant="h5">Curent Month Attendance Report</Typography>
            </TitleWrapper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Total Full Days"
              count={String(totalFullDay.length)}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#4CAF50' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Total Half Days"
              count={String(totalHalfDay.length)}
              tabIcon={<AssignmentInd style={{ fontSize: '4rem', color: '#faad14' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <AnalyticEcommerce
              title="Total Leave"
              count={String(totalLeaveDay.length ? totalLeaveDay[totalLeaveDay.length - 1] : 0)}
              tabIcon={<Hail style={{ fontSize: '4rem', color: '#F44336' }} />}
            />
          </Grid>
        </>
      )}
    </>
  );
}
