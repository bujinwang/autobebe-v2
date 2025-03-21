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
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  WorkOutline as JobIcon,
  HealthAndSafety as HealthIcon,
  LocalCafe as CultureIcon,
  School as EducationIcon,
  AccessTime as FlexTimeIcon,
  Diversity3 as DiversityIcon,
  Paid as CompensationIcon,
  CardGiftcard as BenefitsIcon,
  LocationOn as LocationIcon,
  Schedule as WorkTypeIcon,
} from '@mui/icons-material';

const benefits = [
  {
    title: "Comprehensive Healthcare",
    description: "Full medical, dental, and vision coverage for you and your family",
    icon: HealthIcon,
  },
  {
    title: "Work-Life Balance",
    description: "Flexible working hours and remote work options",
    icon: FlexTimeIcon,
  },
  {
    title: "Professional Development",
    description: "Continuous learning opportunities and education reimbursement",
    icon: EducationIcon,
  },
  {
    title: "Inclusive Culture",
    description: "Diverse and welcoming environment where everyone belongs",
    icon: DiversityIcon,
  },
  {
    title: "Competitive Compensation",
    description: "Above-market salary and equity packages",
    icon: CompensationIcon,
  },
  {
    title: "Additional Perks",
    description: "Annual wellness stipend, home office setup, and more",
    icon: BenefitsIcon,
  },
];

const openPositions = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our core team to build and scale our healthcare platforms",
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Create intuitive and accessible healthcare interfaces",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Hybrid",
    type: "Full-time",
    description: "Drive the vision and strategy of our healthcare solutions",
  },
  {
    title: "Healthcare Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    description: "Transform healthcare data into actionable insights",
  },
];

export default function Careers() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Join Our Mission to Transform Healthcare
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Be part of a team that's revolutionizing healthcare technology and improving lives
              </Typography>
              <Button
                component={Link}
                to="#openings"
                variant="contained"
                size="large"
                sx={{ mr: 2 }}
              >
                View Open Positions
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                alt="Team collaboration"
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

      {/* Culture Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          Our Culture
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="Team meeting"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Where Innovation Meets Purpose
            </Typography>
            <Typography variant="body1" paragraph>
              At AutoBebe, we believe in creating an environment where creativity flourishes, innovation is encouraged, and every team member can make a meaningful impact on healthcare delivery.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CultureIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Collaborative Environment"
                  secondary="Work alongside passionate professionals who share your vision"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DiversityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Inclusive Workplace"
                  secondary="Diverse perspectives lead to better solutions"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EducationIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Growth Mindset"
                  secondary="Continuous learning and development opportunities"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            Benefits & Perks
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
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
                    <benefit.icon
                      sx={{
                        fontSize: 40,
                        color: 'primary.main',
                        mr: 2
                      }}
                    />
                    <Typography variant="h6">
                      {benefit.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Open Positions Section */}
      <Box id="openings" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            Open Positions
          </Typography>
          <Grid container spacing={3}>
            {openPositions.map((position, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <JobIcon
                        sx={{
                          fontSize: 40,
                          color: 'primary.main',
                          mr: 2
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom>
                          {position.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<WorkTypeIcon />}
                            label={position.type}
                            size="small"
                          />
                          <Chip
                            icon={<LocationIcon />}
                            label={position.location}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Button
                        component={Link}
                        to={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                        variant="contained"
                      >
                        Apply Now
                      </Button>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {position.description}
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
              Don't See the Right Role?
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
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </Typography>
            <Button
              component={Link}
              to="/contact"
              variant="contained"
              color="secondary"
              size="large"
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 