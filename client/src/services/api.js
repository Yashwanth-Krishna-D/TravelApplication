import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = () => api.get('/health');

// Destination search
export const searchDestinations = (query, limit = 10) => 
  api.get(`/destinations/search?q=${encodeURIComponent(query)}&limit=${limit}`);

// Get destination details
export const getDestinationDetails = (xid) => 
  api.get(`/destinations/${xid}/details`);

// Get nearby attractions
export const getNearbyAttractions = (xid, radius = 5000, limit = 10) => 
  api.get(`/destinations/${xid}/nearby?radius=${radius}&limit=${limit}`);

// Generate itinerary
export const generateItinerary = (itineraryData) => 
  api.post('/itinerary/generate', itineraryData);

// Get user itineraries
export const getUserItineraries = (userId = 'anonymous') => 
  api.get(`/itineraries?user_id=${userId}`);

// Get specific itinerary
export const getItinerary = (itineraryId) => 
  api.get(`/itineraries/${itineraryId}`);

// Create user
export const createUser = (userData) => 
  api.post('/users', userData);

// Get user
export const getUser = (userId) => 
  api.get(`/users/${userId}`);

// Get weather
export const getWeather = (lat, lon) => 
  api.get(`/weather/${lat}/${lon}`);

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 