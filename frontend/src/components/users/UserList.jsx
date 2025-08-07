import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography, Chip } from '@mui/material'
import { getUsers } from '../../store/slices/userSlice'

const UserList = ({ role }) => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector(state => state.users)
  const { user } = useSelector(state => state.auth)
  const MM = [];

  if(role){users.forEach((user) => {
    if(user.role === role){
      MM.push(user)
    }
  })}

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'role', headerName: 'Role', width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value.replace('_', ' ')} 
          color={
            params.value === 'super_admin' ? 'primary' : 
            params.value === 'admin' ? 'secondary' : 'default'
          } 
        />
      ) },
    { field: 'isActive', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'error'} 
        />
      ) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        user?.role === 'super_admin' && (
          <Button
            component={Link}
            to={`/users/${params.row._id}`}
            size="small"
            variant="outlined"
          >
            Edit
          </Button>
        )
      ),
    },
  ]
  if (role && role === 'trainer') {
    return (
      <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        {user?.role === 'super_admin' && (
          <Button component={Link} to="/users/new" variant="contained">
            Add User
          </Button>
        )}
      </Box>
      <DataGrid
        rows={MM}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        loading={loading}
        getRowId={(row) => row._id}
      />
    </Box>
    )
  }
  if (!role) {
    return (
      <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        {user?.role === 'super_admin' && (
          <Button component={Link} to="/users/new" variant="contained">
            Add User
          </Button>
        )}
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        loading={loading}
        getRowId={(row) => row._id}
      />
    </Box>
  )
  }
  // return (
  //   <Box sx={{ height: 600, width: '100%' }}>
  //     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
  //       <Typography variant="h4">Users</Typography>
  //       {user?.role === 'super_admin' && (
  //         <Button component={Link} to="/users/new" variant="contained">
  //           Add User
  //         </Button>
  //       )}
  //     </Box>
  //     <DataGrid
  //       rows={users}
  //       columns={columns}
  //       pageSize={10}
  //       rowsPerPageOptions={[10, 25, 50]}
  //       loading={loading}
  //       getRowId={(row) => row._id}
  //     />
  //   </Box>
  // )
}

export default UserList