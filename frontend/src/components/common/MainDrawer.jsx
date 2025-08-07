import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Drawer as MuiDrawer,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MainDrawer = ({ mobileOpen, user, handleDrawerToggle }) => {
  const location = useLocation();
  const [openStudents, setOpenStudents] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(false);
  const [openFees, setOpenFees] = useState(false);
  const [openTrainers, setOpenTrainers] = useState(false);

  const handleStudentsClick = () => setOpenStudents(!openStudents);
  const handleCoursesClick = () => setOpenCourses(!openCourses);
  const handleAttendanceClick = () => setOpenAttendance(!openAttendance);
  const handleFeesClick = () => setOpenFees(!openFees);
  const handleTrainersClick = () => setOpenTrainers(!openTrainers);

  const drawerContent = (
    <Box>
      <DrawerHeader>
        <Typography variant="h6">CodeHub ERP</Typography>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={location.pathname === '/dashboard'}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {user && ['super_admin', 'admin', 'sales_person'].includes(user?.role) && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleTrainersClick}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Trainers" />
                {openTrainers ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openTrainers} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/trainers"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/trainers'}
                >
                  <ListItemText primary="All Trainers" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/trainers/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/trainers/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
              </List>
            </Collapse>
            <Collapse in={openCourses} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/courses"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/courses'}
                >
                  <ListItemText primary="All Courses" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/courses/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/courses/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {user && ['super_admin', 'admin', 'sales_person'].includes(user?.role) && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleStudentsClick}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Students" />
                {openStudents ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openStudents} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/students"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/students'}
                >
                  <ListItemText primary="All Students" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/students/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/students/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {user && ['super_admin', 'admin'].includes(user?.role) && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCoursesClick}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Courses" />
                {openCourses ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openCourses} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/courses"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/courses'}
                >
                  <ListItemText primary="All Courses" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/courses/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/courses/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {user && ['trainer', 'admin', 'super_admin'].includes(user?.role) && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleAttendanceClick}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Attendance" />
                {openAttendance ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openAttendance} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/attendance"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/attendance'}
                >
                  <ListItemText primary="All Records" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/attendance/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/attendance/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
                {user?.role === 'trainer' && (
                  <ListItemButton
                    component={Link}
                    to="/attendance/bulk"
                    sx={{ pl: 4 }}
                    selected={location.pathname === '/attendance/bulk'}
                  >
                    <ListItemText primary="Bulk Add" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </>
        )}

        {user && ['sales_person', 'admin', 'super_admin'].includes(user?.role) && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleFeesClick}>
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Fees" />
                {openFees ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openFees} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  to="/fees"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/fees'}
                >
                  <ListItemText primary="All Fees" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/fees/new"
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/fees/new'}
                >
                  <ListItemText primary="Add New" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {user && user?.role === 'super_admin' && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/users"
              selected={location.pathname === '/users'}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </MuiDrawer>
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </MuiDrawer>
    </Box>
  );
};

export default MainDrawer;