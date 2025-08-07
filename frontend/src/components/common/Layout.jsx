// Layout.jsx
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CssBaseline, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material'
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material'
import AppBar from './AppBar'
import MainDrawer from './MainDrawer' // Renamed import

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user } = useSelector(state => state.auth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar user={user}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            CodeHub ERP
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block' }}>
                {user?.email}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <MenuItem component={Link} to="/profile">Profile</MenuItem>
              <MenuItem component={Link} to="/logout">Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <MainDrawer mobileOpen={mobileOpen} user={user} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout