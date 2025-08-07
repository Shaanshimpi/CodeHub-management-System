import { Box, Typography, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to CodeHub ERP
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Student Management System for CodeHub India
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            size="large"
          >
            Sign In
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            variant="outlined" 
            size="large"
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Home