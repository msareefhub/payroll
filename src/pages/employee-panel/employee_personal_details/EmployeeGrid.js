import React, { useEffect, useState } from 'react';
import { Box, TableContainer } from '@mui/material';
import { getEmployee } from '../../../api/common';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const columns = [
  {
    field: 'id',
    headerName: 'S No.',
    flex: 1
  },
  {
    field: 'first_name',
    headerName: 'Employee Name',
    flex: 1
  },
  {
    field: 'date_of_birth',
    headerName: 'Date Of Birth',
    flex: 1
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'E-Mail',
    flex: 1
  }
];

export default function EmployeeGrid() {
  const [employeeDetails, setEmployeeDetails] = useState([]);

  function getEmployeeDetails() {
    getEmployee().then((response) => {
      if (response.data.length) {
        setEmployeeDetails(response.data);
      }
    });
  }

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <DataGrid
          rows={employeeDetails}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true
            }
          }}
        />
      </TableContainer>
    </Box>
  );
}
