import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { lazy } from 'react';

// project import
// render - dashboard

//Setting Panel
const WorkLocation = Loadable(lazy(() => import('pages/setting/work_location')));
const Department = Loadable(lazy(() => import('pages/setting/department')));
const JobTitle = Loadable(lazy(() => import('pages/setting/job_title')));
const HolidayList = Loadable(lazy(() => import('pages/setting/holiday')));
const CompanyAnnouncement = Loadable(lazy(() => import('pages/setting/company_announcement')));

//Admin Panel
const AdminDashboard = Loadable(lazy(() => import('pages/admin-panel/dashboard')));
const EmployeeList = Loadable(lazy(() => import('pages/admin-panel/employee_details')));
const EmployeeAttendanceReport = Loadable(lazy(() => import('pages/admin-panel/employee_attendance')));
const UserLoginStatus = Loadable(lazy(() => import('pages/admin-panel/user_login_status')));
const EmployeeTimeSheetReport = Loadable(lazy(() => import('pages/admin-panel/employee_timesheet')));
const EmployeeLeavesReport = Loadable(lazy(() => import('pages/admin-panel/employee_leaves')));
const EmployeeDocuments = Loadable(lazy(() => import('pages/admin-panel/employee_documents')));
const EmployeeBankDetails = Loadable(lazy(() => import('pages/admin-panel/employee_bank_details')));
const EmployeeSalaryDetails = Loadable(lazy(() => import('pages/admin-panel/employee_salary_details')));
const SpecialAllowance = Loadable(lazy(() => import('pages/admin-panel/special_allowance')));
const EmployeePaySlipReport = Loadable(lazy(() => import('pages/admin-panel/employee_payslip')));

//Employee Panel
const EmployeeDashboard = Loadable(lazy(() => import('pages/employee-panel/employee_dashboard')));
const EmployeePersonalDetails = Loadable(lazy(() => import('pages/employee-panel/employee_personal_details')));
const EmployeeLeaves = Loadable(lazy(() => import('pages/employee-panel/employee_leaves')));
const EmployeeAttendance = Loadable(lazy(() => import('pages/employee-panel/employee_attendance')));
const EmployeePaySlip = Loadable(lazy(() => import('pages/employee-panel/employee_payslip')));
const EmployeeLoginDetails = Loadable(lazy(() => import('pages/employee-panel/employee_login_details')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'admin-dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'employees-list',
      element: <EmployeeList />
    },
    {
      path: 'attendance-report',
      element: <EmployeeAttendanceReport />
    },
    {
      path: 'current-login-status',
      element: <UserLoginStatus />
    },
    {
      path: 'login-time-report',
      element: <EmployeeTimeSheetReport />
    },
    {
      path: 'employee-leaves-report',
      element: <EmployeeLeavesReport />
    },
    {
      path: 'employee-documents',
      element: <EmployeeDocuments />
    },
    {
      path: 'employee-bank-details',
      element: <EmployeeBankDetails />
    },
    {
      path: 'employee-salary',
      element: <EmployeeSalaryDetails />
    },
    {
      path: 'special-allowance',
      element: <SpecialAllowance />
    },
    {
      path: 'employee-payslip',
      element: <EmployeePaySlipReport />
    },
    {
      path: 'work-location',
      element: <WorkLocation />
    },
    {
      path: 'department',
      element: <Department />
    },
    {
      path: 'job-title',
      element: <JobTitle />
    },
    {
      path: 'holiday-list',
      element: <HolidayList />
    },
    {
      path: 'company-Announcement',
      element: <CompanyAnnouncement />
    },
    {
      path: 'employee-dashboard',
      element: <EmployeeDashboard />
    },
    {
      path: 'employee-personal-details',
      element: <EmployeePersonalDetails />
    },
    {
      path: 'employee-leave',
      element: <EmployeeLeaves />
    },
    {
      path: 'attendance-details',
      element: <EmployeeAttendance />
    },
    {
      path: 'login-time-details',
      element: <EmployeeLoginDetails />
    },
    {
      path: 'pay-slip',
      element: <EmployeePaySlip />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    }
  ]
};

export default MainRoutes;
