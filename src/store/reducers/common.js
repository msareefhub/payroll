// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  employeeDetails: [0, 0, '', '', '', '', '', '', '', 0, 0, ''],
  roleName: '',
  userName: '',
  employeeEditStatus: 'Add',
  employeeDetailsPageView: 'viewemployee'
};

// ==============================|| SLICE - MENU ||============================== //

const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setRoleName(state, action) {
      state.roleName = action.payload.roleName;
    },

    setUserName(state, action) {
      state.userName = action.payload.userName;
    },

    setEmployeeDetails(state, action) {
      state.employeeDetails = action.payload.employeeDetails;
    },

    setEmployeeEditStatus(state, action) {
      state.employeeEditStatus = action.payload.employeeEditStatus;
    },

    setCurrentEmployeeId(state, action) {
      state.currentEmployeeId = action.payload.currentEmployeeId;
    },

    setEmployeeDetailsPageView(state, action) {
      state.employeeDetailsPageView = action.payload.employeeDetailsPageView;
    }
  }
});

export default common.reducer;

export const { setRoleName, setUserName, setEmployeeDetails, setEmployeeEditStatus, setCurrentEmployeeId, setEmployeeDetailsPageView } =
  common.actions;
