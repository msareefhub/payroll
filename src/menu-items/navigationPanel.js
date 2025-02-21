// assets
import { DashboardOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const navigationPanel = {
  id: 'group-dashboard',
  title: 'Navigation Panel',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      role: 'Admin',
      url: '/admin-dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'employees_list',
      title: 'Employees List',
      type: 'item',
      role: 'Admin',
      url: '/employees-list',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'attendance_report',
      title: 'Attendance Report',
      type: 'item',
      role: 'Admin',
      url: '/attendance-report',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'current_login_status',
      title: 'Current Login Status',
      type: 'item',
      role: 'Admin',
      url: '/current-login-status',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'login_time_report',
      title: 'Login Time Report',
      type: 'item',
      role: 'Admin',
      url: '/login-time-report',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'employee_leaves',
      title: 'Leaves Report',
      type: 'item',
      role: 'Admin',
      url: '/employee-leaves-report',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'documents',
      title: 'Documents',
      type: 'item',
      role: 'Admin',
      url: '/employee-documents',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'bank_details',
      title: 'Bank Details',
      type: 'item',
      role: 'Admin',
      url: '/employee-bank-details',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'salary_details',
      title: 'Salary Details',
      type: 'item',
      role: 'Admin',
      url: '/employee-salary',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'special_allowance',
      title: 'Special Allowance',
      type: 'item',
      role: 'Admin',
      url: '/special-allowance',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'payslip',
      title: 'Payslip',
      type: 'item',
      role: 'Admin',
      url: '/employee-payslip',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'employee_dashboard',
      title: 'Dashboard',
      type: 'item',
      role: 'Employee',
      url: '/employee-dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'employeepersonaldetails',
      title: 'Personal Details',
      type: 'item',
      role: 'Employee',
      url: '/employee-personal-details',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'login-time-details',
      title: 'Login Time Details',
      type: 'item',
      role: 'Employee',
      url: '/login-time-details',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'employeeattendancedetails',
      title: 'Attendance Details',
      type: 'item',
      role: 'Employee',
      url: '/attendance-details',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'employeeleavereport',
      title: 'Leave Report',
      type: 'item',
      role: 'Employee',
      url: '/employee-leave',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'employeepayslip',
      title: 'Pay Slip',
      type: 'item',
      role: 'Employee',
      url: '/pay-slip',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    }
  ]
};

export default navigationPanel;
