import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';

const values = [
  {
    title: 'Patient-Centered Innovation',
    description: 'Every technological advancement we make is driven by improving patient care and outcomes.'
  },
  {
    title: 'Clinical Excellence',
    description: 'We maintain the highest standards of medical accuracy and clinical best practices.'
  },
  {
    title: 'Accessibility',
    description: 'Making quality healthcare technology accessible to healthcare providers of all sizes.'
  },
  {
    title: 'Security & Privacy',
    description: 'Unwavering commitment to protecting patient data and maintaining HIPAA compliance.'
  }
];

export default function About() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 8 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              About AutoBebeSys Healthcare
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 'md', mx: 'auto', mb: 4 }}
            >
              Transforming pediatric healthcare through innovative technology solutions
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Typography variant="h3" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                At AutoBebeSys Healthcare, we're dedicated to revolutionizing pediatric healthcare delivery through innovative technology solutions. Our mission is to empower healthcare providers with tools that enhance patient care and streamline clinical operations.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We believe that by combining clinical expertise with cutting-edge technology, we can create more efficient, accessible, and effective healthcare systems that benefit both providers and patients.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our team of healthcare professionals and technology experts works tirelessly to develop solutions that address real-world clinical challenges and improve healthcare outcomes.
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Healthcare professionals using technology"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Story Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Team collaboration"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="h3" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Founded by a team of healthcare professionals and technologists, AutoBebeSys Healthcare emerged from a shared vision to modernize pediatric healthcare delivery through technology.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Our journey began with a simple observation: healthcare providers needed better tools to manage their practices and deliver care efficiently. This insight led to the development of our flagship platform, JoyTriage.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Today, we continue to innovate and expand our solutions, always keeping our focus on improving healthcare outcomes and provider efficiency.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom>
              Our Core Values
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 'md', mx: 'auto' }}
            >
              The principles that guide our innovation and development
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 