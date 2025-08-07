// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { updateUserProfile } from '../../store/slices/authSlice'
// import { TextField, Button, Box, Typography, Container, Alert, Avatar } from '@mui/material'

// const Profile = () => {
//   const dispatch = useDispatch()
//   const { user, loading, error } = useSelector(state => state.auth)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: ''
//   })

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         password: '',
//         confirmPassword: ''
//       })
//     }
//   }, [user])

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords don't match")
//       return
//     }
//     dispatch(updateUserProfile(formData))
//   }

//   return (
//     <Container maxWidth="md">
//       {console.log('User in Profile:', user)}
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>My Profile</Typography>
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
//           <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
//             {user?.name.charAt(0)}
//           </Avatar>
//           <Typography variant="h6">{user?.name}</Typography>
//           <Typography variant="body1" color="text.secondary">{user?.email}</Typography>
//           <Typography variant="body1" color="text.secondary">{user?.role.replace('_', ' ')}</Typography>
//         </Box>

//         <Box component="form" onSubmit={handleSubmit}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             disabled
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="New Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Leave blank to keep current"
//           />
//           <TextField
//             margin="normal"
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type="password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//           />
//           <Box sx={{ mt: 3 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={loading}
//               sx={{ mr: 2 }}
//             >
//               {loading ? 'Updating...' : 'Update Profile'}
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   )
// }

// export default Profile



import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../../store/slices/authSlice'
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material'

const Profile = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
      </Box>
    </Container>
  )
}

export default Profile