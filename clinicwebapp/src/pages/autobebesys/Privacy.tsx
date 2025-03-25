import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

const SubSectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const Privacy: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated: March 24, 2025
        </Typography>

        <StyledPaper elevation={0}>
          <SectionTitle variant="h5">
            1. Introduction
          </SectionTitle>
          <Typography variant="body1" paragraph>
            At AutoBebeSys, we are committed to protecting your privacy and maintaining the confidentiality of your personal information. This Privacy Policy describes how we collect, use, protect, and manage your data when you interact with our services.
          </Typography>

          <SectionTitle variant="h5">
            2. Information Collection
          </SectionTitle>
          <SubSectionTitle variant="h6">
            2.1 Types of Information Collected
          </SubSectionTitle>
          <Typography variant="body1" paragraph>
            We collect the following types of information:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Personal Identification Information:
              </Typography>
              <Typography variant="body1" component="span">
                {' '}This includes your name, email address, phone number, and other identifying details you voluntarily provide.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Medical and Health Information:
              </Typography>
              <Typography variant="body1" component="span">
                {' '}We collect sensitive health-related data necessary for providing our services, including medical conditions, treatment records, and health history.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1" component="span" fontWeight="bold">
                Communication Preferences:
              </Typography>
              <Typography variant="body1" component="span">
                {' '}Information about how you prefer to be contacted and communicate with our service.
              </Typography>
            </Box>
          </Box>

          <SectionTitle variant="h5">
            3. Use of Information
          </SectionTitle>
          <Typography variant="body1" paragraph>
            We use your collected information for the following purposes:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            {[
              'Delivering and maintaining our healthcare services',
              'Processing medical appointments and managing health records',
              'Sending critical updates, notifications, and important service-related communications',
              'Enhancing and personalizing user experience',
              'Ensuring compliance with legal and regulatory requirements',
              'Conducting internal research and service improvement'
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle variant="h5">
            4. Information Sharing and Disclosure
          </SectionTitle>
          <SubSectionTitle variant="h6">
            4.1 Principles of Information Sharing
          </SubSectionTitle>
          <Typography variant="body1" paragraph>
            We do <strong>not</strong> sell or rent your personal information to third parties. Information may be shared under the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            {[
              'With healthcare providers directly involved in your care',
              'With service providers who assist in our operational processes',
              'When legally required, with law enforcement or government authorities',
              'With your explicit consent'
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle variant="h5">
            5. Data Security
          </SectionTitle>
          <Typography variant="body1" paragraph>
            We are dedicated to protecting your information through comprehensive security measures:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            {[
              'Implementing robust technological safeguards',
              'Restricting access to personal information',
              'Using encryption and secure data transmission protocols',
              'Regularly reviewing and updating our security practices',
              'Training our staff on data protection and privacy standards'
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle variant="h5">
            6. Your Privacy Rights
          </SectionTitle>
          <Typography variant="body1" paragraph>
            You have the following rights regarding your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 3 }}>
            {[
              'Right to access your personal data',
              'Right to request correction of inaccurate information',
              'Right to request deletion of your personal information',
              'Right to opt-out of marketing communications',
              'Right to know what personal data we collect and how we use it'
            ].map((item, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle variant="h5">
            7. Changes to This Privacy Policy
          </SectionTitle>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy periodically. We will notify you of any significant changes and provide the updated policy on our platform.
          </Typography>

          <SectionTitle variant="h5">
            8. Contact Information
          </SectionTitle>
          <Typography variant="body1" paragraph>
            For any questions, concerns, or requests related to this Privacy Policy, please contact us:
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> privacy@autobebesys.com
            </Typography>
          </Box>

          <SectionTitle variant="h5">
            9. Consent
          </SectionTitle>
          <Typography variant="body1" paragraph>
            By using our services, you consent to the terms outlined in this Privacy Policy.
          </Typography>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Privacy; 