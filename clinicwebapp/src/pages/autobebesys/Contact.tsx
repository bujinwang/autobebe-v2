import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import contactService from "../../services/contactService";

interface ContactInfo {
  icon: React.ElementType;
  title: string;
  details: string[];
}

const contactInfo: ContactInfo[] = [
  {
    icon: LocationIcon,
    title: "Visit Us",
    details: ["7103 BRENT LN", "#1218", "Lynden  WA 98264123"],
  },
  {
    icon: PhoneIcon,
    title: "Call Us",
    details: ["+1 (509) 486-8791", "+1 (509) 486-8791"],
  },
  {
    icon: EmailIcon,
    title: "Email Us",
    details: ["contact@autobebesys.com", "support@autobebesys.com"],
  },
  {
    icon: ClockIcon,
    title: "Business Hours",
    details: [
      "Monday - Friday: 9:00 AM - 6:00 PM",
      "Saturday: 10:00 AM - 4:00 PM",
      "Sunday: Closed",
    ],
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendSupportMessage(formData);

      setSnackbar({
        open: true,
        message: "Thank you for your message. We will get back to you soon!",
        severity: "success",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Sorry, we couldn't send your message. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pt: 8 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: "grey.100", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: "md", mx: "auto", mb: 4 }}
            >
              Get in touch with our team for any questions about our healthcare
              solutions
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Information Cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, mb: 6 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    <info.icon sx={{ fontSize: 40, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: idx !== info.details.length - 1 ? 1 : 0 }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form Section */}
      <Container maxWidth="md" sx={{ pb: 8 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, md: 6 },
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Send Us a Message
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Fill out the form below and we'll get back to you as soon as
            possible
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  position: "relative",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Snackbar for form submission feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
