import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Chip,
} from '@mui/material';
import {
  FlightTakeoff,
  Explore,
  Psychology,
  LocalOffer,
  Security,
  Speed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Planning',
      description: 'Intelligent itinerary generation using advanced AI models for personalized travel experiences.',
    },
    {
      icon: <Explore sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Dynamic Destinations',
      description: 'Real-time destination data with images, descriptions, and nearby attractions from reliable APIs.',
    },
    {
      icon: <LocalOffer sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Budget Optimization',
      description: 'Smart budget planning with accommodation, transport, and activity suggestions tailored to your budget.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Weather Aware',
      description: 'Real-time weather integration to suggest the best times and places to visit.',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Instant Results',
      description: 'Get comprehensive travel plans in seconds with detailed day-by-day itineraries.',
    },
    {
      icon: <FlightTakeoff sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Complete Packages',
      description: 'End-to-end travel planning including flights, hotels, local transport, and activities.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Your AI Travel Agent
          </Typography>
          <Typography variant="h5" color="inherit" paragraph sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Discover the world with intelligent travel planning powered by AI. 
            Get personalized itineraries, real-time recommendations, and complete travel packages.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/planner')}
              sx={{
                mr: 2,
                mb: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Start Planning
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/explore')}
              sx={{
                mb: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Explore Destinations
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          Why Choose AI Travel Planner?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Paper
          sx={{
            p: 4,
            mb: 6,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                1000+
              </Typography>
              <Typography variant="h6">
                Destinations
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                50K+
              </Typography>
              <Typography variant="h6">
                Happy Travelers
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                24/7
              </Typography>
              <Typography variant="h6">
                AI Support
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* CTA Section */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Let AI create your perfect travel experience
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/planner')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            Plan Your Trip Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 