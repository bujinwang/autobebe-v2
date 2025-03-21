import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Using this as ClinicIcon
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clinic } from '../types';
import { clinicService } from '../services';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, setCurrentClinic } = useAuth();
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicMenuAnchor, setClinicMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;

    const fetchClinics = async () => {
      try {
        if (user.role === 'SUPER_ADMIN') {
          // Fetch all clinics for super admin
          const clinicsData = await clinicService.getAllClinics();
          setClinics(clinicsData);
        } else if (user.defaultClinicId) {
          // For other roles, just fetch their assigned clinic
          const clinic = await clinicService.getClinicById(user.defaultClinicId);
          setClinics(clinic ? [clinic] : []);
        }
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
      }
    };
    
    fetchClinics();
  }, [user]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClinicMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setClinicMenuAnchor(event.currentTarget);
  };

  const handleClinicMenuClose = () => {
    setClinicMenuAnchor(null);
  };

  const handleClinicChange = async (clinicId: string) => {
    try {
      // Close menu first for better UX
      handleClinicMenuClose();
      
      // Show loading state
      setLoading(true);
      
      // Update clinic selection
      await setCurrentClinic(clinicId);
      
      // Fetch updated clinic data after selection
      if (user?.role === 'SUPER_ADMIN') {
        const clinicsData = await clinicService.getAllClinics();
        setClinics(clinicsData);
      } else if (clinicId) {
        const clinic = await clinicService.getClinicById(clinicId);
        setClinics(clinic ? [clinic] : []);
      }

      // Clear any existing errors
      setError(null);
      
      // Force a re-render of the current route
      const currentPath = window.location.pathname;
      navigate('/', { replace: true });
      navigate(currentPath, { replace: true });
      
    } catch (error) {
      console.error('Failed to change clinic:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const getCurrentClinicName = () => {
    if (!user) return '';
    
    // For non-super admin users, just display their assigned clinic name
    if (user.role !== 'SUPER_ADMIN') {
      const currentClinic = clinics.find(clinic => clinic.id.toString() === user.defaultClinicId?.toString());
      return currentClinic ? currentClinic.name : user.defaultClinicId ? 'Loading...' : 'No Clinic Assigned';
    }
    
    // For super admin, show the selected clinic or prompt to select one
    if (!user.defaultClinicId) return 'Select Clinic';
    const currentClinic = clinics.find(clinic => clinic.id.toString() === user.defaultClinicId?.toString());
    return currentClinic ? currentClinic.name : 'Loading...';
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    handleLogout();
  };

  // Get user's initials for the avatar
  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Update the clinic selector button to show loading state
  const clinicSelectorButton = (
    <Button 
      id="clinic-select-button"
      aria-controls={Boolean(clinicMenuAnchor) ? 'clinic-select-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={Boolean(clinicMenuAnchor)}
      color="inherit" 
      onClick={handleClinicMenuOpen}
      endIcon={<ArrowDropDownIcon />}
      startIcon={<LocalHospitalIcon />}
      disabled={loading}
      sx={{ mr: 2 }}
    >
      {loading ? 'Updating...' : getCurrentClinicName()}
    </Button>
  );

  // Update the menu items to show selection properly
  const clinicMenuItems = clinics.map((clinic) => (
    <MenuItem 
      key={clinic.id} 
      onClick={() => handleClinicChange(clinic.id.toString())}
      selected={user?.defaultClinicId?.toString() === clinic.id.toString()}
    >
      {clinic.name}
    </MenuItem>
  ));

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ my: 2 }}>
            Clinic Staff Portal
          </Typography>
        </ListItem>
        <Divider />
        <ListItem onClick={() => navigate('/dashboard')}>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate('/appointments')}>
          <ListItemButton>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
          </ListItemButton>
        </ListItem>
        {/* Only show Staff Management for SUPER_ADMIN and CLINIC_ADMIN */}
        {user?.role !== 'STAFF' && (
          <ListItem onClick={() => navigate('/staff')}>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Staff Management" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clinic Staff Portal
          </Typography>
          
          {user && (
            <>
              {user.role === 'SUPER_ADMIN' ? (
                // Clinic selector dropdown for super admin
                <>
                  {clinicSelectorButton}
                  <Menu
                    anchorEl={clinicMenuAnchor}
                    open={Boolean(clinicMenuAnchor)}
                    onClose={handleClinicMenuClose}
                    keepMounted
                    MenuListProps={{
                      'aria-labelledby': 'clinic-select-button',
                      role: 'listbox'
                    }}
                  >
                    {clinicMenuItems}
                  </Menu>
                  {error && (
                    <Typography color="error" sx={{ mr: 2 }}>
                      {error}
                    </Typography>
                  )}
                </>
              ) : (
                // Static clinic name display for other roles
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <LocalHospitalIcon sx={{ mr: 1 }} />
                  <Typography variant="body1" component="span">
                    {getCurrentClinicName()}
                  </Typography>
                </Box>
              )}
              
              {/* User Profile Menu */}
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{ 
                  ml: 2,
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'inherit' }}>
                  {getUserInitials()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogoutClick}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerContent}
      </Drawer>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ py: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Clinic Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;