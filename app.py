import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
import json
from datetime import datetime, timedelta
import random
from bson import ObjectId
# import openai  # Removed OpenAI
# import google.generativeai as genai  # For Gemini

# Load environment variables from .env
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME")]

# API Keys
OPENTRIPMAP_API_KEY = os.getenv('OPENTRIPMAP_API_KEY')
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY') 
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

# Hugging Face API base URL for free inference
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models"

def get_ai_explanation(prompt, max_tokens=300):
    """Get AI-powered explanation using Hugging Face's free inference API"""
    try:
        if not HUGGINGFACE_API_KEY:
            return "AI explanation not available. Please check your Hugging Face API configuration."
        
        # Using a free text generation model
        model_name = "gpt2"  # Free model, can be changed to other free models
        
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": max_tokens,
                "temperature": 0.7,
                "do_sample": True,
                "return_full_text": False
            }
        }
        
        response = requests.post(
            f"{HUGGINGFACE_API_URL}/{model_name}",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                generated_text = result[0].get('generated_text', '')
                # Clean up the generated text
                cleaned_text = generated_text.replace(prompt, '').strip()
                if cleaned_text:
                    return cleaned_text[:max_tokens]
            
            # Fallback to a simple template-based response
            return generate_template_response(prompt)
        else:
            # If API fails, use template-based response
            return generate_template_response(prompt)
    
    except Exception as e:
        print(f"AI API error: {e}")
        return generate_template_response(prompt)

def generate_template_response(prompt):
    """Generate a template-based response when AI API is not available"""
    prompt_lower = prompt.lower()
    
    if "paris" in prompt_lower:
        return "Paris, the City of Light, offers iconic landmarks like the Eiffel Tower, world-class museums including the Louvre, charming neighborhoods like Montmartre, and exquisite French cuisine. Don't miss the Seine River cruises and the beautiful Champs-Élysées."
    
    elif "tokyo" in prompt_lower:
        return "Tokyo, Japan's vibrant capital, combines ultramodern and traditional elements. Visit the historic Senso-ji Temple, explore the bustling Shibuya crossing, experience the futuristic Akihabara district, and enjoy authentic sushi and ramen."
    
    elif "new york" in prompt_lower or "nyc" in prompt_lower:
        return "New York City, the Big Apple, features iconic attractions like Times Square, Central Park, the Statue of Liberty, and world-famous museums. Experience diverse neighborhoods, Broadway shows, and incredible food from around the world."
    
    elif "london" in prompt_lower:
        return "London, England's historic capital, offers the Tower of London, Buckingham Palace, Big Ben, and world-class museums. Explore diverse neighborhoods, enjoy traditional pubs, and experience the city's rich cultural heritage."
    
    elif "rome" in prompt_lower:
        return "Rome, the Eternal City, showcases ancient wonders like the Colosseum and Roman Forum, the Vatican City with St. Peter's Basilica, the Trevi Fountain, and incredible Italian cuisine. Every corner tells a story of history."
    
    elif "barcelona" in prompt_lower:
        return "Barcelona, Spain's vibrant coastal city, features Gaudi's architectural masterpieces like Sagrada Familia, the Gothic Quarter, beautiful beaches, and delicious tapas. Experience the unique Catalan culture and Mediterranean lifestyle."
    
    elif "amsterdam" in prompt_lower:
        return "Amsterdam, the Netherlands' charming capital, offers beautiful canals, world-class museums like the Van Gogh Museum, historic architecture, and a relaxed atmosphere. Explore by bike and enjoy the city's artistic heritage."
    
    elif "prague" in prompt_lower:
        return "Prague, the Golden City, features stunning Gothic architecture, the historic Charles Bridge, Prague Castle, and charming Old Town Square. Experience rich Czech culture, traditional beer, and medieval atmosphere."
    
    else:
        # Generic travel response
        return "This destination offers unique cultural experiences, local cuisine, historic landmarks, and beautiful scenery. Explore local markets, try traditional dishes, visit museums, and immerse yourself in the local culture. Don't forget to capture memories and enjoy the journey!"

def search_destinations(query, limit=10):
    """Search destinations using OpenTripMap API"""
    try:
        if not OPENTRIPMAP_API_KEY:
            return {"error": "OpenTripMap API key not configured"}
        
        # Search for places
        search_url = f"{OPENTRIPMAP_BASE_URL}/autosuggest"
        params = {
            'name': query,
            'apikey': OPENTRIPMAP_API_KEY,
            'limit': limit,
            'format': 'json'
        }
        
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        
        places = response.json()
        
        # Get detailed info for each place
        detailed_places = []
        for place in places[:5]:  # Limit to 5 for performance
            place_details = get_place_details(place.get('xid'))
            if place_details:
                detailed_places.append(place_details)
        
        return detailed_places
    
    except Exception as e:
        print(f"OpenTripMap API error: {e}")
        return {"error": f"Failed to search destinations: {str(e)}"}

def get_place_details(xid):
    """Get detailed information about a specific place"""
    try:
        if not OPENTRIPMAP_API_KEY:
            return None
        
        details_url = f"{OPENTRIPMAP_BASE_URL}/xid/{xid}"
        params = {
            'apikey': OPENTRIPMAP_API_KEY,
            'format': 'json'
        }
        
        response = requests.get(details_url, params=params)
        response.raise_for_status()
        
        place_data = response.json()
        
        # Extract relevant information
        place_info = {
            'id': xid,
            'name': place_data.get('name', 'Unknown'),
            'address': place_data.get('address', {}),
            'coordinates': {
                'lat': place_data.get('point', {}).get('lat'),
                'lon': place_data.get('point', {}).get('lon')
            },
            'kinds': place_data.get('kinds', '').split(','),
            'wikipedia': place_data.get('wikipedia', ''),
            'image': place_data.get('preview', {}).get('source', ''),
            'description': place_data.get('wikipedia_extracts', {}).get('text', ''),
            'rating': place_data.get('rate', 0)
        }
        
        # Generate AI explanation if description is short
        if not place_info['description'] or len(place_info['description']) < 100:
            ai_prompt = f"Provide a brief, engaging description of {place_info['name']} as a tourist destination. Include what makes it special, what visitors can expect, and any interesting facts."
            place_info['ai_description'] = get_ai_explanation(ai_prompt)
        
        return place_info
    
    except Exception as e:
        print(f"Error getting place details: {e}")
        return None

def get_nearby_attractions(lat, lon, radius=5000, limit=10):
    """Get nearby attractions using OpenTripMap API"""
    try:
        if not OPENTRIPMAP_API_KEY:
            return {"error": "OpenTripMap API key not configured"}
        
        nearby_url = f"{OPENTRIPMAP_BASE_URL}/radius"
        params = {
            'radius': radius,
            'lon': lon,
            'lat': lat,
            'apikey': OPENTRIPMAP_API_KEY,
            'limit': limit,
            'format': 'json',
            'kinds': 'cultural,historic,architecture,interesting_places'
        }
        
        response = requests.get(nearby_url, params=params)
        response.raise_for_status()
        
        places = response.json().get('features', [])
        
        nearby_attractions = []
        for place in places:
            properties = place.get('properties', {})
            attraction = {
                'name': properties.get('name', 'Unknown'),
                'distance': properties.get('dist', 0),
                'kinds': properties.get('kinds', '').split(','),
                'coordinates': place.get('geometry', {}).get('coordinates', [])
            }
            nearby_attractions.append(attraction)
        
        return nearby_attractions
    
    except Exception as e:
        print(f"Error getting nearby attractions: {e}")
        return {"error": f"Failed to get nearby attractions: {str(e)}"}

def generate_smart_itinerary(destination, duration, budget, preferences, travel_style):
    """Generate a smart itinerary using AI and API data"""
    try:
        # Search for the destination
        search_results = search_destinations(destination, limit=5)
        
        if isinstance(search_results, dict) and 'error' in search_results:
            return {"error": search_results['error']}
        
        if not search_results:
            return {"error": "No destinations found"}
        
        # Get the main destination
        main_destination = search_results[0]
        
        # Get nearby attractions
        nearby = get_nearby_attractions(
            main_destination['coordinates']['lat'],
            main_destination['coordinates']['lon']
        )
        
        # Calculate daily budget
        daily_budget = int(budget) // int(duration)
        
        # Generate itinerary using AI
        itinerary_prompt = f"""
        Create a {duration}-day travel itinerary for {destination} with the following details:
        - Budget: ${budget} (${daily_budget} per day)
        - Travel style: {travel_style}
        - Preferences: {', '.join(preferences)}
        - Main attraction: {main_destination['name']}
        - Nearby attractions: {[att['name'] for att in nearby[:5]] if isinstance(nearby, list) else []}
        
        Provide a day-by-day plan with:
        1. Morning activities
        2. Afternoon activities  
        3. Evening activities
        4. Recommended accommodation type
        5. Transportation suggestions
        6. Estimated daily costs
        7. Travel tips and cultural notes
        """
        
        ai_itinerary = get_ai_explanation(itinerary_prompt, max_tokens=800)
        
        # Create structured itinerary
        itinerary = {
            'destination': destination,
            'main_attraction': main_destination,
            'duration': int(duration),
            'budget': int(budget),
            'daily_budget': daily_budget,
            'travel_style': travel_style,
            'preferences': preferences,
            'nearby_attractions': nearby if isinstance(nearby, list) else [],
            'ai_generated_plan': ai_itinerary,
            'created_at': datetime.now().isoformat(),
            'weather_info': get_weather_info(main_destination['coordinates']['lat'], main_destination['coordinates']['lon'])
        }
        
        return itinerary
    
    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return {"error": f"Failed to generate itinerary: {str(e)}"}

def get_weather_info(lat, lon):
    """Get weather information for the destination"""
    try:
        if not WEATHER_API_KEY:
            return {"error": "Weather API key not configured"}
        
        # Using OpenWeatherMap API (free tier)
        weather_url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(weather_url, params=params)
        response.raise_for_status()
        
        weather_data = response.json()
        
        return {
            'temperature': weather_data['main']['temp'],
            'description': weather_data['weather'][0]['description'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed']
        }
    
    except Exception as e:
        print(f"Weather API error: {e}")
        return {"error": "Weather information unavailable"}

# OpenTripMap API base URL
OPENTRIPMAP_BASE_URL = "https://api.opentripmap.com/0.1/en/places"

# API Endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'mongodb': 'connected' if client else 'disconnected',
            'opentripmap': 'configured' if OPENTRIPMAP_API_KEY else 'not_configured',
            'huggingface': 'configured' if HUGGINGFACE_API_KEY else 'not_configured',
            'weather': 'configured' if WEATHER_API_KEY else 'not_configured'
        }
    })

@app.route('/api/destinations/search', methods=['GET'])
def search_destinations_endpoint():
    """Search destinations by query"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 10, type=int)
    
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    results = search_destinations(query, limit)
    return jsonify(results)

@app.route('/api/destinations/<xid>/details', methods=['GET'])
def get_destination_details(xid):
    """Get detailed information about a specific destination"""
    details = get_place_details(xid)
    
    if not details:
        return jsonify({'error': 'Destination not found'}), 404
    
    return jsonify(details)

@app.route('/api/destinations/<xid>/nearby', methods=['GET'])
def get_nearby_attractions_endpoint(xid):
    """Get nearby attractions for a destination"""
    radius = request.args.get('radius', 5000, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # First get the destination details to get coordinates
    destination = get_place_details(xid)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
    
    lat = destination['coordinates']['lat']
    lon = destination['coordinates']['lon']
    
    nearby = get_nearby_attractions(lat, lon, radius, limit)
    return jsonify(nearby)

@app.route('/api/itinerary/generate', methods=['POST'])
def generate_itinerary_endpoint():
    """Generate a smart itinerary"""
    try:
        data = request.get_json()
        
        required_fields = ['destination', 'duration', 'budget']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        destination = data['destination']
        duration = data['duration']
        budget = data['budget']
        preferences = data.get('preferences', ['culture', 'food', 'history'])
        travel_style = data.get('travel_style', 'balanced')
        
        itinerary = generate_smart_itinerary(destination, duration, budget, preferences, travel_style)
        
        if 'error' in itinerary:
            return jsonify(itinerary), 400
        
        # Save to database
        itinerary['user_id'] = data.get('user_id', 'anonymous')
        db.itineraries.insert_one(itinerary)
        
        return jsonify({
            'success': True,
            'itinerary': itinerary,
            'message': 'Itinerary generated successfully'
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to generate itinerary: {str(e)}'}), 500

@app.route('/api/itineraries', methods=['GET'])
def get_user_itineraries():
    """Get itineraries for a user"""
    user_id = request.args.get('user_id', 'anonymous')
    
    try:
        itineraries = list(db.itineraries.find(
            {'user_id': user_id},
            {'_id': 0}  # Exclude MongoDB ObjectId
        ).sort('created_at', -1))
        
        return jsonify({
            'success': True,
            'itineraries': itineraries
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch itineraries: {str(e)}'}), 500

@app.route('/api/itineraries/<itinerary_id>', methods=['GET'])
def get_itinerary(itinerary_id):
    """Get a specific itinerary"""
    try:
        itinerary = db.itineraries.find_one(
            {'_id': ObjectId(itinerary_id)},
            {'_id': 0}
        )
        
        if not itinerary:
            return jsonify({'error': 'Itinerary not found'}), 404
        
        return jsonify({
            'success': True,
            'itinerary': itinerary
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch itinerary: {str(e)}'}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        
        required_fields = ['username', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        existing_user = db.users.find_one({
            '$or': [
                {'username': data['username']},
                {'email': data['email']}
            ]
        })
        
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409
        
        # Create user
        user_data = {
            'username': data['username'],
            'email': data['email'],
            'preferences': data.get('preferences', {}),
            'created_at': datetime.now().isoformat()
        }
        
        result = db.users.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'user': user_data,
            'message': 'User created successfully'
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    try:
        user = db.users.find_one(
            {'_id': ObjectId(user_id)},
            {'_id': 0}
        )
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user: {str(e)}'}), 500

@app.route('/api/weather/<lat>/<lon>', methods=['GET'])
def get_weather_endpoint(lat, lon):
    """Get weather information for coordinates"""
    try:
        weather = get_weather_info(float(lat), float(lon))
        return jsonify(weather)
    
    except Exception as e:
        return jsonify({'error': f'Failed to get weather: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)