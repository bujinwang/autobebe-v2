import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Paper,
  Alert,
  useTheme,
  alpha
} from '@mui/material';

export default function Demo() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    platformInterest: 'aibeautylens', // aibeautylens, joytriage, or both
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        phone: '',
        platformInterest: 'aibeautylens',
        message: ''
      });
    }, 5000);
  };

  const features = [
    {
      title: "Intuitive Dashboard",
      description: "Experience our user-friendly interface designed specifically for healthcare providers."
    },
    {
      title: "Patient Management",
      description: "See how easily you can manage patient records, appointments, and communications."
    },
    {
      title: "Analytics & Reporting",
      description: "Preview powerful insights and reporting capabilities to optimize your practice."
    },
    {
      title: "Security Features",
      description: "Learn about our robust security measures ensuring HIPAA compliance."
    },
    {
      title: "Integration Capabilities",
      description: "Discover how our platform integrates with your existing systems."
    },
    {
      title: "Mobile Experience",
      description: "See the platform in action on mobile devices for on-the-go access."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'common.white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Experience AutoBebeSys in Action
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                maxWidth: 'md',
                mx: 'auto'
              }}
            >
              See how our healthcare solutions can transform your practice with a personalized demo
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Demo Request Form Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Box sx={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
            {submitted ? (
              <Alert severity="success" sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Thank You!</Typography>
                <Typography>
                  Your demo request has been received. Our team will contact you within 24 hours to schedule your personalized demo.
                </Typography>
              </Alert>
            ) : (
              <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                  Request Your Demo
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Work Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="company"
                        label="Company/Organization"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="role"
                        label="Job Role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        select
                        id="platformInterest"
                        label="Platform Interest"
                        name="platformInterest"
                        value={formData.platformInterest}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="aibeautylens">AIBeautyLens™ with DermaGraph™</MenuItem>
                        <MenuItem value="joytriage">JoyTriage™ Intake Management</MenuItem>
                        <MenuItem value="both">Both Platforms</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="message"
                        label="Additional Information"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your specific needs or any questions you have..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ py: 1.5 }}
                      >
                        Request Demo
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Preview Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" gutterBottom>
              What You'll See in the Demo
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get a comprehensive look at our platform's capabilities
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease-in ${index * 0.1}s`,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
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
          py: 6,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to transform your healthcare practice?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join the hundreds of healthcare providers already using our platform
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Contact Sales
          </Button>
        </Container>
      </Box>
    </Box>
  );
}