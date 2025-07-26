import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FlightTakeoff,
  Psychology,
  LocalOffer,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { generateItinerary } from '../services/api';

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      destination: '',
      duration: 7,
      budget: 1000,
      travel_style: 'balanced',
      preferences: ['culture', 'food'],
    }
  });

  const travelStyles = [
    { value: 'adventure', label: 'Adventure Seeker' },
    { value: 'culture', label: 'Cultural Explorer' },
    { value: 'luxury', label: 'Luxury Traveler' },
    { value: 'budget', label: 'Budget Traveler' },
    { value: 'relaxation', label: 'Relaxation & Wellness' },
    { value: 'balanced', label: 'Balanced Experience' },
  ];

  const preferenceOptions = [
    { value: 'culture', label: 'Culture & History' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'nature', label: 'Nature & Outdoors' },
    { value: 'adventure', label: 'Adventure Sports' },
    { value: 'shopping', label: 'Shopping & Markets' },
    { value: 'nightlife', label: 'Nightlife & Entertainment' },
    { value: 'art', label: 'Art & Museums' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'photography', label: 'Photography' },
    { value: 'wellness', label: 'Wellness & Spa' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await generateItinerary({
        ...data,
        user_id: 'anonymous', // In a real app, get from auth context
      });

      if (response.data.success) {
        setItinerary(response.data.itinerary);
      } else {
        setError(response.data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while generating your itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        <Psychology sx={{ mr: 2, verticalAlign: 'middle' }} />
        AI Travel Planner
      </Typography>

      <Grid container spacing={4}>
        {/* Planning Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Plan Your Perfect Trip
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Destination */}
                  <Grid item xs={12}>
                    <Controller
                      name="destination"
                      control={control}
                      rules={{ required: 'Destination is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Where do you want to go?"
                          placeholder="e.g., Paris, France or Tokyo, Japan"
                          error={!!errors.destination}
                          helperText={errors.destination?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Duration */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="duration"
                      control={control}
                      rules={{ required: 'Duration is required', min: { value: 1, message: 'Minimum 1 day' } }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Duration (days)"
                          inputProps={{ min: 1, max: 30 }}
                          error={!!errors.duration}
                          helperText={errors.duration?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Budget */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="budget"
                      control={control}
                      rules={{ required: 'Budget is required', min: { value: 100, message: 'Minimum $100' } }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Total Budget ($)"
                          inputProps={{ min: 100 }}
                          error={!!errors.budget}
                          helperText={errors.budget?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Travel Style */}
                  <Grid item xs={12}>
                    <Controller
                      name="travel_style"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Travel Style</InputLabel>
                          <Select {...field} label="Travel Style">
                            {travelStyles.map((style) => (
                              <MenuItem key={style.value} value={style.value}>
                                {style.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Preferences */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      What interests you? (Select multiple)
                    </Typography>
                    <Controller
                      name="preferences"
                      control={control}
                      render={({ field }) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {preferenceOptions.map((pref) => (
                            <Chip
                              key={pref.value}
                              label={pref.label}
                              onClick={() => {
                                const current = field.value || [];
                                const newValue = current.includes(pref.value)
                                  ? current.filter(v => v !== pref.value)
                                  : [...current, pref.value];
                                field.onChange(newValue);
                              }}
                              color={field.value?.includes(pref.value) ? 'primary' : 'default'}
                              variant={field.value?.includes(pref.value) ? 'filled' : 'outlined'}
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <FlightTakeoff sx={{ mr: 1 }} />
                          Generate AI Itinerary
                        </>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {itinerary && (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Your AI-Generated Itinerary
                </Typography>

                {/* Itinerary Summary */}
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    {itinerary.destination}
                  </Typography>
                  <Typography variant="body2">
                    {itinerary.duration} days • ${itinerary.budget} budget • {itinerary.travel_style} style
                  </Typography>
                  <Typography variant="body2">
                    Daily budget: ${itinerary.daily_budget}
                  </Typography>
                </Paper>

                {/* Main Destination */}
                {itinerary.main_attraction && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Main Destination: {itinerary.main_attraction.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {itinerary.main_attraction.description || itinerary.main_attraction.ai_description}
                      </Typography>
                      {itinerary.main_attraction.image && (
                        <img
                          src={itinerary.main_attraction.image}
                          alt={itinerary.main_attraction.name}
                          style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* AI Generated Plan */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                      AI-Generated Travel Plan
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {itinerary.ai_generated_plan}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Weather Info */}
                {itinerary.weather_info && !itinerary.weather_info.error && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        🌤️ Current Weather
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Temperature: {itinerary.weather_info.temperature}°C
                      </Typography>
                      <Typography variant="body2">
                        Conditions: {itinerary.weather_info.description}
                      </Typography>
                      <Typography variant="body2">
                        Humidity: {itinerary.weather_info.humidity}%
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Nearby Attractions */}
                {itinerary.nearby_attractions && itinerary.nearby_attractions.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">
                        🗺️ Nearby Attractions
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {itinerary.nearby_attractions.slice(0, 5).map((attraction, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {attraction.name} ({Math.round(attraction.distance)}m away)
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Planner; 