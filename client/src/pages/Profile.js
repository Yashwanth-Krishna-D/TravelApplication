import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  FlightTakeoff,
  Psychology,
} from '@mui/icons-material';

const Profile = () => {
  // Mock user data - in a real app, this would come from auth context
  const user = {
    username: 'Traveler123',
    email: 'traveler@example.com',
    created_at: '2024-01-15',
    preferences: {
      favorite_destinations: ['Paris', 'Tokyo', 'New York'],
      travel_style: 'Adventure Seeker',
      budget_range: '$1000-$3000',
    },
    stats: {
      total_trips: 5,
      countries_visited: 3,
      total_spent: 8500,
    },
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        👤 My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                }}
              >
                <Person sx={{ fontSize: '3rem' }} />
              </Avatar>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {user.username}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button>
              
              <Button
                variant="contained"
                fullWidth
                href="/planner"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                <FlightTakeoff sx={{ mr: 1 }} />
                Plan New Trip
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Preferences */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Travel Stats */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📊 Travel Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {user.stats.total_trips}
                    </Typography>
                    <Typography variant="body2">
                      Total Trips
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {user.stats.countries_visited}
                    </Typography>
                    <Typography variant="body2">
                      Countries Visited
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      ${user.stats.total_spent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Total Spent
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Travel Preferences */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Psychology sx={{ mr: 1 }} />
                    Travel Preferences
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Travel Style
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {user.preferences.travel_style}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Budget Range
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {user.preferences.budget_range}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Favorite Destinations
                    </Typography>
                    {user.preferences.favorite_destinations.map((dest, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {dest}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🕒 Recent Activity
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last trip planned
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Paris, France
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 weeks ago
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last destination explored
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Tokyo, Japan
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1 month ago
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Profile updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Preferences
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      3 months ago
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    ⚡ Quick Actions
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        href="/planner"
                        sx={{ py: 2 }}
                      >
                        <FlightTakeoff sx={{ mr: 1 }} />
                        Plan Trip
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        href="/explore"
                        sx={{ py: 2 }}
                      >
                        🌍 Explore
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        href="/itineraries"
                        sx={{ py: 2 }}
                      >
                        📋 My Trips
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ py: 2 }}
                      >
                        ⚙️ Settings
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 