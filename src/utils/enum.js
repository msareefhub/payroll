export const EmployeeDetailsEnum = Object.freeze({
  EMPLOYEE_ID: 0,
  EMPLOYEE_CODE: 1,
  EMPLOYMENT_START: 2,
  OFFICE_EMAIL: 3,
  PROFILE_IMAGE: 4,
  JOb_TILE: 5,
  DATE_OF_BIRTH: 6,
  GENDER: 7,
  PERSONAL_EMAIL: 8,
  PRIMARY_CONTACT: 9,
  SECONDARY_CONTACT: 10,
  WORK_LOCATION: 11
});

export const UserTimeSheet = Object.freeze({
  USER_FULL_DAY_HOURS: 6,
  USER_LOGIN_HOURS: 9,
  WEEK_DAYS: 5
});

export const LeaveType = Object.freeze({
  CASUAL_LEAVE: '1',
  SICK_LEAVE: '2',
  PATERNITY_LEAVE: '3',
  MATERNITY_LEAVE: '4',
  COMPENSATORY_OFF: '5',
  PRIVILEGE_LEAVE: '6',
  EARNED_LEAVE: '7',
  PAID_LEAVE: '8'
});

export const LeaveApprovalType = Object.freeze({
  PENDING: 0,
  APPROVED: 1,
  REJECT: 2
});

export const UserLogin = Object.freeze({
  OTP_MAX_LENGHT: 4
});

export const SalaryDetails = Object.freeze({
  SALARY_DAYS: 30
});

export const UserRole = Object.freeze({
  EMPLOYEE: 'Employee',
  ADMIN: 'Admin'
});
