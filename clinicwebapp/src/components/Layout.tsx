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
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Using this as ClinicIcon
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicMenuAnchor, setClinicMenuAnchor] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    if (user && user.clinics) {
      setClinics(user.clinics);
    } else {
      // Fetch clinics if not available in user object
      const fetchClinics = async () => {
        try {
          const clinicsData = await clinicService.getAllClinics();
          setClinics(clinicsData);
        } catch (error) {
          console.error('Failed to fetch clinics:', error);
        }
      };
      fetchClinics();
    }
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

  const handleClinicChange = (clinicId: number) => {
    setCurrentClinic(clinicId);
    handleClinicMenuClose();
  };

  const getCurrentClinicName = () => {
    if (!user || !user.defaultClinicId) return 'Select Clinic';
    
    const currentClinic = clinics.find(clinic => clinic.id === user.defaultClinicId);
    return currentClinic ? currentClinic.name : 'Select Clinic';
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ my: 2 }}>
            Clinic Staff Portal
          </Typography>
        </ListItem>
        <Divider />
        <ListItem onClick={() => navigate('/appointments')}>
          <ListItemButton>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate('/doctors')}>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Doctors" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate('/staff')}>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Staff Management" />
          </ListItemButton>
        </ListItem>
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
              <Button 
                color="inherit" 
                onClick={handleClinicMenuOpen}
                endIcon={<ArrowDropDownIcon />}
                // Replace ClinicIcon with LocalHospitalIcon in the component
                startIcon={<LocalHospitalIcon />}
                sx={{ mr: 2 }}
              >
                {getCurrentClinicName()}
              </Button>
              <Menu
                anchorEl={clinicMenuAnchor}
                open={Boolean(clinicMenuAnchor)}
                onClose={handleClinicMenuClose}
              >
                {clinics.map((clinic) => (
                  <MenuItem 
                    key={clinic.id} 
                    onClick={() => handleClinicChange(clinic.id)}
                    selected={user.defaultClinicId === clinic.id}
                  >
                    {clinic.name}
                  </MenuItem>
                ))}
              </Menu>
              <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                {isMobile ? '' : 'Logout'}
              </Button>
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