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
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  DeviceHub as IntegrationIcon,
  Analytics as AnalyticsIcon,
  PhoneIphone as MobileIcon,
  Support as SupportIcon
} from '@mui/icons-material';

const features = [
  {
    title: "Smart Scheduling",
    description: "Intelligent appointment management with automated reminders and waitlist optimization.",
    icon: SpeedIcon
  },
  {
    title: "Secure Communication",
    description: "HIPAA-compliant messaging between providers and patients.",
    icon: SecurityIcon
  },
  {
    title: "Health Records",
    description: "Comprehensive electronic health records with easy access and updates.",
    icon: IntegrationIcon
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time insights and reporting for informed decision-making.",
    icon: AnalyticsIcon
  },
  {
    title: "Mobile Access",
    description: "Full platform functionality on any device, anywhere.",
    icon: MobileIcon
  },
  {
    title: "Integration Ready",
    description: "Seamless integration with existing healthcare systems.",
    icon: SupportIcon
  }
];

export default function Platforms() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Our Platforms
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 6,
              borderRadius: 2
            }}
          />
        </Container>
      </Box>

      {/* Platforms Cards Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          {/* JoyTriage Patient Platform Card */}
          <Grid item xs={12}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease-in-out'
            }}>
              <CardContent sx={{ 
                flex: '1 0 auto',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography variant="h3" gutterBottom>
                  JoyTriage Patient Platform
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 4 }}
                >
                  Innovative patient-centered application that simplifies healthcare access. 
                  Smart symptom assessment, secure provider messaging, and seamless appointment scheduling.
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    to="/joytriage"
                    variant="contained"
                    size="large"
                    sx={{ mr: 2 }}
                  >
                    Enter JoyTriage
                  </Button>
                  <Button
                    component={Link}
                    to="/demo"
                    variant="outlined"
                    size="large"
                  >
                    Request Demo
                  </Button>
                </Box>
              </CardContent>
              <CardMedia
                component="img"
                sx={{
                  width: { md: '50%' },
                  height: { xs: 300, md: 'auto' },
                  objectFit: 'cover'
                }}
                image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                alt="JoyTriage platform interface"
              />
            </Card>
          </Grid>

          {/* Clinic Management Platform Card */}
          <Grid item xs={12}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row-reverse' },
              overflow: 'hidden',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease-in-out'
            }}>
              <CardContent sx={{ 
                flex: '1 0 auto',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography variant="h3" gutterBottom>
                  Clinic Management Platform
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 4 }}
                >
                  Comprehensive healthcare management system designed for medical practices. 
                  Streamline operations, enhance patient care, and improve efficiency.
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    to="/demo"
                    variant="contained"
                    size="large"
                    sx={{ mr: 2 }}
                  >
                    Request Demo
                  </Button>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size="large"
                  >
                    Contact Sales
                  </Button>
                </Box>
              </CardContent>
              <CardMedia
                component="img"
                sx={{
                  width: { md: '50%' },
                  height: { xs: 300, md: 'auto' },
                  objectFit: 'cover'
                }}
                image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                alt="Clinic platform dashboard"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Grid Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            Platform Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <feature.icon
                      sx={{
                        fontSize: 40,
                        color: 'primary.main',
                        mr: 2
                      }}
                    />
                    <Typography variant="h6">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'common.white',
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: 'common.white' }}
            >
              Ready to Transform Your Healthcare Practice?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.9),
                mb: 4,
                maxWidth: 'md',
                mx: 'auto'
              }}
            >
              Experience how our platforms can revolutionize your healthcare delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/demo"
                variant="contained"
                color="secondary"
                size="large"
              >
                Request Demo
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                color="inherit"
                size="large"
              >
                Contact Sales
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 