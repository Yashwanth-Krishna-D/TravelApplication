import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Star,
  Info,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { searchDestinations } from '../services/api';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: destinations, isLoading, error } = useQuery(
    ['destinations', searchTerm],
    () => searchDestinations(searchTerm, 10),
    {
      enabled: !!searchTerm,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery.trim());
    }
  };

  const popularDestinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Rome, Italy',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Prague, Czech Republic',
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        🌍 Explore Destinations
      </Typography>

      {/* Search Section */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Discover Amazing Places
        </Typography>
        
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for destinations, cities, or landmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!searchQuery.trim()}
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.8)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.8)',
                  opacity: 1,
                },
              },
            }}
          />
        </form>

        {/* Popular Destinations */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Popular Destinations:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularDestinations.map((dest) => (
              <Chip
                key={dest}
                label={dest}
                onClick={() => {
                  setSearchQuery(dest);
                  setSearchTerm(dest);
                }}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Search Results */}
      {searchTerm && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Search Results for "{searchTerm}"
          </Typography>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'Failed to search destinations'}
            </Alert>
          )}

          {destinations && destinations.error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {destinations.error}
            </Alert>
          )}

          {destinations && !destinations.error && destinations.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No destinations found for "{searchTerm}". Try a different search term.
            </Alert>
          )}

          {destinations && !destinations.error && destinations.length > 0 && (
            <Grid container spacing={3}>
              {destinations.map((destination, index) => (
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
                    {destination.image && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={destination.image}
                        alt={destination.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {destination.name}
                      </Typography>
                      
                      {destination.address && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {destination.address.city || destination.address.town || destination.address.village || 'Unknown location'}
                          </Typography>
                        </Box>
                      )}

                      {destination.rating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={destination.rating / 2} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({destination.rating})
                          </Typography>
                        </Box>
                      )}

                      {destination.kinds && destination.kinds.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          {destination.kinds.slice(0, 3).map((kind, kindIndex) => (
                            <Chip
                              key={kindIndex}
                              label={kind.replace(/_/g, ' ')}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}

                      {destination.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {destination.description.length > 150
                            ? `${destination.description.substring(0, 150)}...`
                            : destination.description}
                        </Typography>
                      )}

                      {destination.ai_description && (
                        <Typography variant="body2" color="text.secondary">
                          {destination.ai_description.length > 100
                            ? `${destination.ai_description.substring(0, 100)}...`
                            : destination.ai_description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* No Search Yet */}
      {!searchTerm && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Start exploring by searching for a destination above
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover amazing places, get detailed information, and plan your next adventure
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Explore; 