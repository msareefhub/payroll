import { API_ROOT } from 'config/apiConfig';

async function getToken($userName) {
  return fetch(`${API_ROOT}/createauthtoken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userName: $userName
    })
  })
    .then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())))
    .then((response) => {
      if (response) {
        return response.data[0]?.auth_token;
      }
    });
}

async function createHeader($userName = 0) {
  let idToken = '';
  let idUserCode = '';

  const headers = new Headers();

  const getIdToken = JSON.parse(localStorage.getItem('authToken'));
  const userCode = JSON.parse(localStorage.getItem('userCode'));

  if (getIdToken === null) {
    const freshToken = await getToken($userName);

    localStorage.setItem('authToken', JSON.stringify(freshToken));
    localStorage.setItem('userCode', JSON.stringify($userName));

    idToken = freshToken;
    idUserCode = $userName;
  } else {
    idToken = getIdToken;
    idUserCode = userCode;
  }

  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', idToken);
  headers.append('User-Code', idUserCode);
  return headers;
}

// GET Method - Start

export async function getLoginUserById($employeeId) {
  return fetch(`${API_ROOT}/loginuserbyid/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployee() {
  return fetch(`${API_ROOT}/getemployee`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getCurrencyType() {
  return fetch(`${API_ROOT}/getcurrencytype`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getDocuments() {
  return fetch(`${API_ROOT}/getdocuments`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getCountry() {
  return fetch(`${API_ROOT}/getcountrylist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getCity() {
  return fetch(`${API_ROOT}/getcitylist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getWorkLocationCity() {
  return fetch(`${API_ROOT}/getworklocationcity`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getDepartmentList() {
  return fetch(`${API_ROOT}/getdepartmentlist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getJobTitleList() {
  return fetch(`${API_ROOT}/getjobtitlelist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getGenderList() {
  return fetch(`${API_ROOT}/getgenderlist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployeeDetailsById($employeeId) {
  return fetch(`${API_ROOT}/getemployeedetails/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployeeDocuments($employeeId) {
  return fetch(`${API_ROOT}/getemployeedocuments/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployeeBankDetails($employeeId) {
  return fetch(`${API_ROOT}/getemployeebankdetails/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployeeSalaryDetails($employeeId) {
  return fetch(`${API_ROOT}/getemployeesalarydetails/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getSpecialPayDetails($employeeId) {
  return fetch(`${API_ROOT}/getspecialpaybyid/${$employeeId}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getCurrentMonthHoliday($currentMonth) {
  return fetch(`${API_ROOT}/getcurrentmonthholiday/${$currentMonth}`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getCompanyAnnouncement() {
  return fetch(`${API_ROOT}/announcement`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getHolidaysList() {
  return fetch(`${API_ROOT}/getholidayslist`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export const getLeaveType = async () => {
  return fetch(`${API_ROOT}/getleavetype`, {
    method: 'GET',
    headers: await createHeader()
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
};

// GET Method - End

// POST Method - Start

export async function getLoginUser($employeeId, $loginOtp, $userName) {
  return fetch(`${API_ROOT}/getloginuser`, {
    method: 'POST',
    headers: await createHeader($userName),
    body: JSON.stringify({
      employeeId: $employeeId,
      loginOtp: $loginOtp
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function checkLoginUser($userName, $userPassword) {
  return fetch(`${API_ROOT}/checkloginuser`, {
    method: 'POST',
    headers: await createHeader($userName),
    body: JSON.stringify({
      userName: $userName,
      userPassword: $userPassword
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getAllEmployeeWeeklyReport($startWeek, $endWeek) {
  return fetch(`${API_ROOT}/getallempweeklyloginreport`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      startWeek: $startWeek,
      endWeek: $endWeek
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmpWeeklyLoginTotalHours($employeeId, $startWeek, $endWeek) {
  return fetch(`${API_ROOT}/getempweeklylogintotalhours`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      startWeek: $startWeek,
      endWeek: $endWeek
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getAllEmpWeeklyLoginTotalHours($startWeek, $endWeek) {
  return fetch(`${API_ROOT}/getallempweeklylogintotalhours`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      startWeek: $startWeek,
      endWeek: $endWeek
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmpAttendanceReport($employeeId, $startWeek, $endWeek) {
  return fetch(`${API_ROOT}/getempweeklyloginreport`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      startWeek: $startWeek,
      endWeek: $endWeek
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getLastUserLogin($employeeId, $currentDate) {
  return fetch(`${API_ROOT}/getlastuserlogin`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      currentDate: $currentDate
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getPayslipDetails($employeeId, $startWeek, $endWeek) {
  return fetch(`${API_ROOT}/getpayslipdetails`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      startWeek: $startWeek,
      endWeek: $endWeek
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmployeeLeaves($employeeId, $year) {
  return fetch(`${API_ROOT}/getempleavereport`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      year: $year
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getLeaveCountByLeaveType($employeeId, $leaveType) {
  return fetch(`${API_ROOT}/getleavecounttype`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      leaveType: $leaveType
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function getEmpLeaveByMonth($employeeId, $startDate, $endDate) {
  return fetch(`${API_ROOT}/getempleavebymonth`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      startDate: $startDate,
      endDate: $endDate
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function checkEmpLoginStartTime($employeeId, $currentDate) {
  return fetch(`${API_ROOT}/checkloginstarttime`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      currentDate: $currentDate
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addEmployee($dataObj) {
  return fetch(`${API_ROOT}/addemployee`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addLeave($leaveDateObj) {
  return fetch(`${API_ROOT}/addleave`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($leaveDateObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function adddocuments($documentDateObj) {
  return fetch(`${API_ROOT}/adddocuments`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($documentDateObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addBankDetails($bankDetailsObj) {
  return fetch(`${API_ROOT}/addbankdetails`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($bankDetailsObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addSpecialAllowance($specialAllowanceAddObj) {
  return fetch(`${API_ROOT}/addspecialallowance`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($specialAllowanceAddObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addWorkLocation($dataObj) {
  return fetch(`${API_ROOT}/addworklocation`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addDepartment($dataObj) {
  return fetch(`${API_ROOT}/adddepartment`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addJobTitle($dataObj) {
  return fetch(`${API_ROOT}/addjobtitle`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addHolidaylist($dataObj) {
  return fetch(`${API_ROOT}/addholidaylist`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function addCompanyAnnouncement($dataObj) {
  return fetch(`${API_ROOT}/addcompanyannouncement`, {
    method: 'POST',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

// POST Method - End

// PUT Method - Start

export async function updateLoginTime($employeeId, $startDate, $startTime) {
  return fetch(`${API_ROOT}/updatelogintime`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify({
      employeeId: $employeeId,
      startDate: $startDate,
      startTime: $startTime
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateLogoutTime($employeeId, $employeeCode, $endTime) {
  return fetch(`${API_ROOT}/updatelogouttime`, {
    method: 'PUT',
    headers: await createHeader($employeeCode),
    body: JSON.stringify({
      employeeId: $employeeId,
      endTime: $endTime
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateUserLogOut($employeeId, $employeeCode) {
  return fetch(`${API_ROOT}/updateuserlogout`, {
    method: 'PUT',
    headers: await createHeader($employeeCode),
    body: JSON.stringify({
      employeeId: $employeeId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateLeave($leaveDateObj) {
  return fetch(`${API_ROOT}/updateleavebyemployee`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($leaveDateObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateLogInOutTime($logTimeDataObj) {
  return fetch(`${API_ROOT}/updateloginouttime`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($logTimeDataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateAdminLogInOutTime($logTimeDataObj) {
  return fetch(`${API_ROOT}/updateadminloginouttime`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($logTimeDataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateLeaveStatus($leaveDataObj) {
  return fetch(`${API_ROOT}/updateleavestatus`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($leaveDataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateEmployee($dataObject) {
  return fetch(`${API_ROOT}/updateemployee`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObject)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateSalaryDetails($salaryDataObj) {
  return fetch(`${API_ROOT}/updatesalarydetails`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($salaryDataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateBankDetails($bankDetailsObj) {
  return fetch(`${API_ROOT}/updatebankdetails`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($bankDetailsObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateDocumentDetails($documentDataObj) {
  return fetch(`${API_ROOT}/updatedocumentdetails`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($documentDataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateSpecialAllowance($updateSpecialAllowanceObj) {
  return fetch(`${API_ROOT}/updatespecialallowance`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($updateSpecialAllowanceObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateWorkLocation($dataObj) {
  return fetch(`${API_ROOT}/updateworklocation`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateDepartment($dataObj) {
  return fetch(`${API_ROOT}/updatedepartment`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateJobTitle($dataObj) {
  return fetch(`${API_ROOT}/updatejobtitle`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateHolidayList($dataObj) {
  return fetch(`${API_ROOT}/updateholidaylist`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function updateCompanyAnnouncement($dataObj) {
  return fetch(`${API_ROOT}/updatecompanyannouncement`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify($dataObj)
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeEmployeeList($recordId) {
  return fetch(`${API_ROOT}/removeemployee`, {
    method: 'PUT',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

// PUT Method - End

// DELETE Method - Start

export async function removeLeave($leaveId) {
  return fetch(`${API_ROOT}/removeleave`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      leaveId: $leaveId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeSpecialAllowance($recordId) {
  return fetch(`${API_ROOT}/removespecialallowance`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeDocument($recordId) {
  return fetch(`${API_ROOT}/removedocument`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeBankDetails($recordId) {
  return fetch(`${API_ROOT}/removebankdetails`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeWorkLocation($recordId) {
  return fetch(`${API_ROOT}/removeworklocation`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeDepartment($recordId) {
  return fetch(`${API_ROOT}/removedepartment`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeJobTitle($recordId) {
  return fetch(`${API_ROOT}/removejobtitle`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeHolidayList($recordId) {
  return fetch(`${API_ROOT}/removeholidaylist`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

export async function removeCompanyAnnouncement($recordId) {
  return fetch(`${API_ROOT}/removecompanyannouncement`, {
    method: 'DELETE',
    headers: await createHeader(),
    body: JSON.stringify({
      recordId: $recordId
    })
  }).then((response) => (response.ok ? Promise.resolve(response.json()) : Promise.reject(response.json())));
}

// DELETE Method - End
