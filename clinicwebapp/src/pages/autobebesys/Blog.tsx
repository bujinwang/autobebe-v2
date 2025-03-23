import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Button,
  TextField,
  Alert,
  useTheme,
  alpha,
  Paper
} from '@mui/material';

// Sample blog data (in a real project, this would come from an API or CMS)
const blogPosts = [
  {
    category: 'Healthcare Technology',
    title: 'The Future of Digital Health: AI and Machine Learning',
    excerpt: 'Exploring how artificial intelligence and machine learning are transforming healthcare delivery and patient outcomes.',
    author: 'Dr. Sarah Chen',
    date: 'Mar 15, 2024',
    readTime: '5 min read',
    authorInitials: 'SC'
  },
  {
    category: 'Patient Care',
    title: 'Improving Patient Engagement Through Technology',
    excerpt: 'Best practices for leveraging digital tools to enhance patient engagement and satisfaction.',
    author: 'Michael Park',
    date: 'Mar 12, 2024',
    readTime: '4 min read',
    authorInitials: 'MP'
  },
  {
    category: 'Clinical Research',
    title: 'Data-Driven Decision Making in Healthcare',
    excerpt: 'How healthcare providers can use data analytics to improve clinical outcomes and operational efficiency.',
    author: 'Dr. Emily Rodriguez',
    date: 'Mar 10, 2024',
    readTime: '6 min read',
    authorInitials: 'ER'
  },
  {
    category: 'Healthcare Innovation',
    title: 'The Rise of Telemedicine and Remote Care',
    excerpt: 'Understanding the impact of telemedicine on healthcare delivery and patient accessibility.',
    author: 'Dr. James Wilson',
    date: 'Mar 8, 2024',
    readTime: '5 min read',
    authorInitials: 'JW'
  },
  {
    category: 'Security',
    title: 'Ensuring HIPAA Compliance in Digital Health',
    excerpt: 'Essential guidelines for maintaining patient data security and privacy in digital healthcare solutions.',
    author: 'Michael Park',
    date: 'Mar 5, 2024',
    readTime: '7 min read',
    authorInitials: 'MP'
  },
  {
    category: 'Patient Experience',
    title: 'Creating Seamless Digital Health Experiences',
    excerpt: 'Strategies for designing user-friendly healthcare applications that enhance patient experience.',
    author: 'Dr. Sarah Chen',
    date: 'Mar 3, 2024',
    readTime: '4 min read',
    authorInitials: 'SC'
  }
];

export default function Blog() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Healthcare Innovation Blog
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 'md', mx: 'auto' }}
            >
              Insights and perspectives on healthcare technology, patient care, and clinical innovation
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Blog Posts Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: alpha(theme.palette.primary.main, 0.2),
                      fontWeight: 'bold'
                    }}
                  >
                    AB
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="overline"
                    color="primary"
                    gutterBottom
                  >
                    {post.category}
                  </Typography>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {post.authorInitials}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {post.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.date} · {post.readTime}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark',
          color: 'common.white',
          py: { xs: 6, md: 8 },
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Stay Updated
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
                Subscribe to our newsletter for the latest insights on healthcare technology and innovation
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                component="form"
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your email"
                  size="small"
                  sx={{
                    bgcolor: 'common.white',
                    borderRadius: 1
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Subscribe
                </Button>
              </Paper>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), mt: 1, display: 'block' }}>
                By subscribing, you agree to our{' '}
                <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 