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
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, setCurrentClinic } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
            AutoBebe Portal
          </Typography>
        </ListItem>
        <Divider />
        {/* Main Autobebesys Section */}
        <ListItem onClick={() => navigate('/')}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate('/blog')}>
          <ListItemButton>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Blog" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate('/joytriage')}>
          <ListItemButton>
            <ListItemIcon>
              <MedicalServicesIcon />
            </ListItemIcon>
            <ListItemText primary="JoyTriage" />
          </ListItemButton>
        </ListItem>
        
        {/* Clinic Staff Portal Section */}
        <Divider />
        <ListItem>
          <Typography variant="subtitle2" color="text.secondary" sx={{ my: 1, px: 2 }}>
            Clinic Staff Portal
          </Typography>
        </ListItem>
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
        {user ? (
          <ListItem onClick={handleLogout}>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem onClick={() => navigate('/login')}>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  // Determine if the current path is a public Autobebesys route
  const isAutobebesysRoute = location.pathname === '/' || 
                            location.pathname === '/blog' || 
                            location.pathname === '/joytriage';
  
  // If this is an Autobebesys route, render without the clinic portal sidebar
  if (isAutobebesysRoute) {
    return <>{children}</>;
  }
  
  // Otherwise, render the clinic portal layout
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="text-xl font-semibold text-blue-600">
              AutoBebe Clinic
            </Link>
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setDrawerOpen(false)}
            >
              <XIconFeather className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            <Link 
              to="/dashboard" 
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HomeIconFeather className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link 
              to="/appointments" 
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname.startsWith('/appointments') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CalendarIconFeather className="mr-3 h-5 w-5" />
              Appointments
            </Link>
            
            <Link 
              to="/staff" 
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname.startsWith('/staff') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UsersIconFeather className="mr-3 h-5 w-5" />
              Staff
            </Link>
            
            <Link 
              to="/profile" 
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/profile' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIconFeather className="mr-3 h-5 w-5" />
              Profile
            </Link>
            
            <Link 
              to="/settings" 
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/settings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SettingsIconFeather className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
          
          <div className="px-4 py-4 border-t border-gray-200">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold">
                    {getUserInitials()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOutIconFeather className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIconFeather className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-between px-2 lg:ml-6">
              {/* Add clinic selector button for super admin users */}
              <div className="flex items-center">
                {user && user.role === 'SUPER_ADMIN' && clinicSelectorButton}
              </div>
              <div className="max-w-lg w-full flex justify-end">
                {/* User profile/settings can go here */}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
      
      {/* Clinic Menu */}
      <Menu
        id="clinic-select-menu"
        anchorEl={clinicMenuAnchor}
        open={Boolean(clinicMenuAnchor)}
        onClose={handleClinicMenuClose}
        MenuListProps={{
          'aria-labelledby': 'clinic-select-button',
        }}
      >
        {clinicMenuItems}
      </Menu>
    </div>
  );
};

export default Layout;