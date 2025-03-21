import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Cloud as CloudIcon,
  Support as SupportIcon
} from '@mui/icons-material';

const features = [
  {
    title: 'Secure Data Management',
    description: 'Industry-leading security protocols to protect sensitive patient information.',
    icon: SecurityIcon
  },
  {
    title: 'Fast Performance',
    description: 'Optimized for speed and efficiency in clinical workflows.',
    icon: SpeedIcon
  },
  {
    title: 'AI-Powered Insights',
    description: 'Advanced analytics and AI to support clinical decision-making.',
    icon: PsychologyIcon
  },
  {
    title: 'Real-time Analytics',
    description: 'Comprehensive reporting and analytics for better patient care.',
    icon: AnalyticsIcon
  },
  {
    title: 'Cloud-Based Solution',
    description: 'Access your data securely from anywhere, anytime.',
    icon: CloudIcon
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock technical support for healthcare providers.',
    icon: SupportIcon
  }
];

export default function Home() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'primary.dark',
          color: 'common.white',
          pt: { xs: 8, sm: 12 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 'lg', mx: 'auto', textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Revolutionizing Healthcare Technology
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha(theme.palette.common.white, 0.8),
                mb: 6,
                maxWidth: 'md',
                mx: 'auto'
              }}
            >
              Empowering healthcare providers with innovative solutions for better patient care
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/joytriage"
              >
                Try JoyTriage
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={Link}
                to="/contact"
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Platforms Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Our Platforms
          </Typography>
          <Card sx={{ maxWidth: 'lg', mx: 'auto' }}>
            <CardMedia
              component="div"
              sx={{
                height: { xs: 200, sm: 300 },
                bgcolor: 'grey.100',
                backgroundImage: 'url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h3" gutterBottom>
                JoyTriage Patient Platform
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Experience the future of patient care with our comprehensive platform designed to streamline clinical workflows and enhance patient engagement.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/joytriage"
                size="large"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    <feature.icon sx={{ fontSize: 40 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'common.white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                AutoBebe Healthcare
              </Typography>
              <Typography variant="body2" color="grey.400">
                Transforming healthcare through innovative technology solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link to="/joytriage" style={{ color: theme.palette.grey[400], textDecoration: 'none' }}>
                    JoyTriage Patient Platform
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link to="#features" style={{ color: theme.palette.grey[400], textDecoration: 'none' }}>
                    Features
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Company
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['About Us', 'Contact', 'Careers'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Link
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      style={{ color: theme.palette.grey[400], textDecoration: 'none' }}
                    >
                      {item}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Support
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {[
                  { text: 'Help Center', link: '#help' },
                  { text: 'Privacy Policy', link: '#privacy' },
                  { text: 'Terms of Service', link: '#terms' }
                ].map((item) => (
                  <Box component="li" key={item.text} sx={{ mb: 1 }}>
                    <Link
                      to={item.link}
                      style={{ color: theme.palette.grey[400], textDecoration: 'none' }}
                    >
                      {item.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'grey.800' }} />
          <Typography variant="body2" color="grey.400" align="center">
            © {new Date().getFullYear()} AutoBebe Healthcare. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 