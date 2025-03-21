import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const navigationLinks = [
    { text: 'Home', path: '/' },
    { text: 'Our Platforms', path: '/platforms' },
    { text: 'JoyTriage', path: '/joytriage' },
    { text: 'About', path: '/about' },
    { text: 'Careers', path: '/careers' },
    { text: 'Contact', path: '/contact' }
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={1}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: { xs: 1, sm: 0 },
                mr: { sm: 4 },
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              AutoBebe
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'flex' },
                gap: 2
              }}
            >
              {navigationLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isCurrentPath(link.path) ? 'primary.main' : 'text.primary',
                    borderBottom: isCurrentPath(link.path) ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    px: 1,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>

            {/* Login Button (Desktop) */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { sm: 'none' },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 300,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navigationLinks.map((link) => (
            <ListItem 
              key={link.path}
              onClick={() => setMobileMenuOpen(false)}
              component={Link}
              to={link.path}
              sx={{
                backgroundColor: isCurrentPath(link.path) ? 'action.selected' : 'transparent'
              }}
            >
              <ListItemText 
                primary={link.text}
                primaryTypographyProps={{
                  color: isCurrentPath(link.path) ? 'primary' : 'inherit'
                }}
              />
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7, sm: 8 }, // Adjust for AppBar height
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PublicLayout; 