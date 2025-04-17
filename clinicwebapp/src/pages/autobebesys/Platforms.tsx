import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  alpha
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  DeviceHub as IntegrationIcon,
  Analytics as AnalyticsIcon,
  PhoneIphone as MobileIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import AppQRCode from '../../components/AppQRCode';

const features = [
  {
    title: "AI Skin Analysis",
    description: "AI powered skin analysis and evidence-based treatment planning.",
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              color: 'text.primary',
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

      {/* Platforms Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* JoyTriage Patient Platform */}
        <Card sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          boxShadow: 2,
          borderRadius: 2,
          position: 'relative',
          minHeight: '400px'
        }}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography variant="h2" gutterBottom sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#2C3E50',
              fontWeight: 'bold'
            }}>
              JoyTriage™ Intake Management Platform
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              Streamline your practice operations with our comprehensive patient management system. JoyTriage™
              optimizes patient flow, reduces administrative burden, and enhances clinical decision-making.
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              <strong>For healthcare providers:</strong> Reduce no-shows by 42%, decrease wait times by 30%, and
              improve clinical efficiency with AI-powered triage and intelligent appointment management.
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 4,
              maxWidth: '800px'
            }}>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  Smart Triage
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  Workflow Automation
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  Resource Optimization
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  Clinical Decision Support
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/demo"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#2196F3',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    bgcolor: '#1976D2'
                  }
                }}
              >
                Schedule Demo
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    borderColor: '#1976D2',
                    bgcolor: 'rgba(33, 150, 243, 0.04)'
                  }
                }}
              >
                Implementation Guide
              </Button>
            </Box>
          </Box>

          {/* QR Code Section with layered effect */}
          <Box sx={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '280px'
          }}>
            <Box sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                left: 8,
                right: -8,
                bottom: -8,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.8)',
                zIndex: -1
              }
            }}>
              <AppQRCode
                appName="Download JoyTriage™ Intake Management"
                iosUrl="https://apps.apple.com/ca/app/joytriage/id6743717260"
                androidUrl="https://play.google.com/store/apps/details?id=com.autobebesys.joytriage"
                size={180}
                bgColor="#FFFFFF"
                fgColor="#2196F3"
              />
            </Box>
          </Box>
        </Card>

        {/* AIBeautyLens Platform */}
        <Card sx={{
          p: { xs: 3, md: 4 },
          boxShadow: 2,
          borderRadius: 2,
          position: 'relative',
          minHeight: '400px',
          '&:hover': {
            boxShadow: 4,
          }
        }}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography variant="h2" gutterBottom sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#2C3E50',
              fontWeight: 'bold'
            }}>
              AIBeautyLens™ with DermaGraph™ Analysis
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              Elevate your aesthetic practice with our AI-powered clinical assessment system. AIBeautyLens™
              transforms patient consultations with precise skin analysis and evidence-based treatment planning.
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              <strong>Clinical-grade analysis. Expert recommendations. Visual results.</strong> See your patients' skin through the eyes of aesthetic experts.
            </Typography>
            <Typography variant="body1" sx={{
              color: '#5D6D7E',
              mb: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              <strong>For clinics:</strong> Increase conversion rates by 35%, reduce consultation time by 40%, and
              enhance patient satisfaction with visual treatment simulations and comprehensive progress tracking.
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 4,
              maxWidth: '800px'
            }}>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  DermaGraph™ Analysis
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  RejuvenationRx™
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  TreatmentVision™
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'rgba(33, 150, 243, 0.08)',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976D2' }}>
                  BeautyBlueprint™
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/demo"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#2196F3',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    bgcolor: '#1976D2'
                  }
                }}
              >
                Schedule Demo
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    borderColor: '#1976D2',
                    bgcolor: 'rgba(33, 150, 243, 0.04)'
                  }
                }}
              >
                Pricing & Plans
              </Button>
            </Box>
          </Box>

          {/* QR Code Section with layered effect */}
          <Box sx={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '280px'
          }}>
            <Box sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                left: 8,
                right: -8,
                bottom: -8,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.8)',
                zIndex: -1
              }
            }}>
              <AppQRCode
                appName="Download AIBeautyLens™ with DermaGraph™"
                iosUrl="https://apps.apple.com/ca/app/aibeautylens/id6743717260"
                androidUrl="https://play.google.com/store/apps/details?id=com.autobebesys.aibeautylens"
                size={180}
                bgColor="#FFFFFF"
                fgColor="#2196F3"
              />
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Features Grid Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: { xs: 4, md: 6 } }}
          >
            Platform Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
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
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#2196F3',
          color: 'common.white',
          py: { xs: 5, md: 8 },
          mt: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                color: 'common.white',
                fontWeight: 600,
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              Ready to Transform Your Healthcare Practice?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.9),
                mb: 5,
                maxWidth: 'md',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400
              }}
            >
              Experience how our platforms can revolutionize your healthcare delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/demo"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#2196F3',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Request Demo
              </Button>
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
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
