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
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Group as GroupIcon,
  ArrowDropDown as ArrowDropDownIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clinic } from '../types';
import { clinicService } from '../services';
import { 
  Home as HomeIconFeather,
  Calendar as CalendarIconFeather,
  Users as UsersIconFeather,
  User as UserIconFeather,
  Settings as SettingsIconFeather,
  LogOut as LogOutIconFeather,
  X as XIconFeather,
  Menu as MenuIconFeather
} from 'react-feather';
import JoyTriageLogo from '../assets/JoyTriage.webp';

interface LayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 220;
const CLOSED_DRAWER_WIDTH = 64;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, setCurrentClinic } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
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
          const clinicsData = await clinicService.getAllClinics();
          setClinics(clinicsData);
        } else if (user.defaultClinicId) {
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

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { text: 'Appointments', icon: EventIcon, path: '/appointments' },
    ...(user?.role !== 'STAFF' ? [{ text: 'Staff Management', icon: GroupIcon, path: '/staff' }] : []),
    { text: 'Profile', icon: AccountCircleIcon, path: '/profile' },
    { text: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${CLOSED_DRAWER_WIDTH}px)` },
          ml: { sm: CLOSED_DRAWER_WIDTH },
          ...(drawerOpen && {
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            ml: DRAWER_WIDTH,
          }),
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
            size="small"
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box component="img" src={JoyTriageLogo} alt="JoyTriage Logo" sx={{ width: 40, height: 40, mr: 1 }} />
          <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                minWidth: 'auto',
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              AutoBebeSys
            </Button>
            <Box component="span" sx={{ opacity: 0.7 }}>/</Box>
            JoyTriage
          </Typography>
          {user?.role === 'SUPER_ADMIN' ? clinicSelectorButton : (
            user && clinics.length > 0 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mr: 2,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <LocalHospitalIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {clinics[0]?.name || 'Loading...'}
                </Typography>
              </Box>
            )
          )}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                {user.email}
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                size="small"
              >
                <Tooltip title="Logout">
                  <LogoutIcon fontSize="small" />
                </Tooltip>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar 
          variant="dense" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            minHeight: 48,
            px: 1.5,
            bgcolor: theme.palette.primary.main,
            color: 'white',
          }}
        >
          {drawerOpen ? (
            <Typography 
              variant="subtitle2" 
              noWrap 
              sx={{ 
                fontWeight: 'medium',
                opacity: 0.9,
              }}
            >
              Navigation
            </Typography>
          ) : (
            <Box sx={{ width: 24 }} /> // Spacer when drawer is closed
          )}
          <IconButton 
            onClick={handleDrawerToggle} 
            size="small"
            sx={{ 
              color: 'inherit',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {drawerOpen ? <ChevronLeftIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List dense sx={{ pt: 0.5, pb: 0.5 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isCurrentPath(item.path)}
                sx={{
                  minHeight: 36,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 1.5 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                  sx={{ 
                    opacity: drawerOpen ? 1 : 0,
                    display: drawerOpen ? 'block' : 'none',
                    transition: theme.transitions.create(['opacity'], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${CLOSED_DRAWER_WIDTH}px)` },
          ...(drawerOpen && {
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
          }),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 48 }} />
        {children}
      </Box>

      {/* Clinic Selection Menu */}
      <Menu
        id="clinic-select-menu"
        anchorEl={clinicMenuAnchor}
        open={Boolean(clinicMenuAnchor)}
        onClose={handleClinicMenuClose}
      >
        {clinicMenuItems}
      </Menu>
    </Box>
  );
};

export default Layout;