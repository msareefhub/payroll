import { useDispatch, useSelector } from 'react-redux';
import { TitleWrapper } from '../../common/CommonStyled';
import { setEmployeeDetailsPageView } from 'store/reducers/common';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AddEmployee from './AddEmployee';
import MainCard from 'components/MainCard';
import EmployeeTable from './EmployeeTable';
import { Button } from '@mui/material';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employeeEditStatus, employeeDetailsPageView } = useSelector((state) => state.common);

  const setEmployeePageViewMode = (viewMode) => {
    dispatch(setEmployeeDetailsPageView({ employeeDetailsPageView: viewMode }));
  };

  return (
    <Grid item xs={12} md={7} lg={12}>
      <Grid container alignItems="start" justifyContent="space-between">
        <TitleWrapper>
          <Typography variant="h5">Employee Details</Typography>
        </TitleWrapper>
        <Grid container item xs={4} spacing={1} alignItems="start" justifyContent="end">
          <Grid item>
            <Button
              disableElevation
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => setEmployeePageViewMode('addemployee')}
            >
              Add Employee
            </Button>
          </Grid>
          <Grid item>
            <Button
              disableElevation
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => setEmployeePageViewMode('viewemployee')}
            >
              Show Employees
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container alignItems="start" justifyContent="space-between">
        {employeeDetailsPageView === 'viewemployee' ? (
          <Grid item xs={12} md={12} lg={12}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <EmployeeTable />
            </MainCard>
          </Grid>
        ) : (
          <Grid item xs={12} md={12} lg={12}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Grid container spacing={3} sx={{ p: 3 }}>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">{employeeEditStatus === 'edit' ? 'Edit Employee' : 'Add Employee'}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <AddEmployee />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default EmployeeList;
