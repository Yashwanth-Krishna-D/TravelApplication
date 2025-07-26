import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FlightTakeoff,
  Psychology,
  LocalOffer,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { getUserItineraries } from '../services/api';

const Itineraries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: response, isLoading, error, refetch } = useQuery(
    ['itineraries', 'anonymous'],
    () => getUserItineraries('anonymous'),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const itineraries = response?.data?.itineraries || [];

  const filteredItineraries = itineraries.filter(itinerary =>
    itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    itinerary.travel_style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewItinerary = (itinerary) => {
    setSelectedItinerary(itinerary);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedItinerary(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        📋 My Itineraries
      </Typography>

      {/* Search and Stats */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search itineraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {filteredItineraries.length} of {itineraries.length} itineraries
              </Typography>
              <Button
                variant="outlined"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'Failed to load itineraries'}
        </Alert>
      )}

      {/* No Itineraries */}
      {!isLoading && !error && itineraries.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No itineraries yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Start planning your next adventure to see your itineraries here
          </Typography>
          <Button
            variant="contained"
            href="/planner"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            <FlightTakeoff sx={{ mr: 1 }} />
            Plan Your First Trip
          </Button>
        </Paper>
      )}

      {/* Itineraries Grid */}
      {!isLoading && !error && filteredItineraries.length > 0 && (
        <Grid container spacing={3}>
          {filteredItineraries.map((itinerary, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {itinerary.destination}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleViewItinerary(itinerary)}
                        sx={{ color: 'primary.main' }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Summary */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {itinerary.duration} days • ${itinerary.budget} budget
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Daily budget: ${itinerary.daily_budget}
                    </Typography>
                  </Box>

                  {/* Travel Style */}
                  <Chip
                    label={itinerary.travel_style}
                    size="small"
                    sx={{ mb: 2 }}
                    color="primary"
                    variant="outlined"
                  />

                  {/* Preferences */}
                  {itinerary.preferences && itinerary.preferences.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {itinerary.preferences.slice(0, 3).map((pref, prefIndex) => (
                        <Chip
                          key={prefIndex}
                          label={pref}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Main Attraction */}
                  {itinerary.main_attraction && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalOffer sx={{ fontSize: 16, mr: 0.5 }} />
                        {itinerary.main_attraction.name}
                      </Typography>
                    </Box>
                  )}

                  {/* Created Date */}
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(itinerary.created_at)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Search Results */}
      {!isLoading && !error && itineraries.length > 0 && filteredItineraries.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No itineraries match your search
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms
          </Typography>
        </Paper>
      )}

      {/* View Itinerary Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {selectedItinerary?.destination}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedItinerary && (
            <Box>
              {/* Summary */}
              <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  Trip Summary
                </Typography>
                <Typography variant="body2">
                  {selectedItinerary.duration} days • ${selectedItinerary.budget} budget • {selectedItinerary.travel_style} style
                </Typography>
                <Typography variant="body2">
                  Daily budget: ${selectedItinerary.daily_budget}
                </Typography>
              </Paper>

              {/* AI Generated Plan */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI-Generated Travel Plan
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {selectedItinerary.ai_generated_plan}
              </Typography>

              {/* Weather Info */}
              {selectedItinerary.weather_info && !selectedItinerary.weather_info.error && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🌤️ Current Weather
                  </Typography>
                  <Typography variant="body2">
                    Temperature: {selectedItinerary.weather_info.temperature}°C
                  </Typography>
                  <Typography variant="body2">
                    Conditions: {selectedItinerary.weather_info.description}
                  </Typography>
                  <Typography variant="body2">
                    Humidity: {selectedItinerary.weather_info.humidity}%
                  </Typography>
                </Box>
              )}

              {/* Nearby Attractions */}
              {selectedItinerary.nearby_attractions && selectedItinerary.nearby_attractions.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🗺️ Nearby Attractions
                  </Typography>
                  {selectedItinerary.nearby_attractions.slice(0, 5).map((attraction, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {attraction.name} ({Math.round(attraction.distance)}m away)
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Itineraries; 