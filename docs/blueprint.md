# **App Name**: AgriAi

## Core Features:

- Farmer Registration & Login: Enable farmers to register using their name, phone number, village, state, land area, crop type, and password, storing and authenticating data securely. Redirect to a personalized dashboard upon successful login.
- Multilingual Support: Implement a language selector dropdown with support for 15 languages (English, Hindi, Telugu, Tamil, Malayalam, Kannada, Marathi, Gujarati, Bengali, Urdu, Punjabi, Odia, Assamese).
- Crop Database & Info System: Display crop information including climate, soil, sowing & harvest time, fertilizers, watering schedule, pests, and remedies, organized by categories (Cereal, Pulses, Vegetables, Fruits, Oilseeds, Cash Crops, Spices, Medicinal).
- AI Crop Disease Detection: Allow farmers to upload leaf images for disease detection. The AI tool analyzes the image to identify potential diseases and suggests appropriate treatments and fertilizer recommendations.
- Weather & Irrigation Alerts: Use a tool to get current weather data and forecasts via village name to alert farmers of rain, storms, or drought conditions. Recommend irrigation schedules based on weather and crop type.
- Kisan Voice Assistant: Integrate a chatbot powered by the OpenAI API and Google Translate API. It should support voice input (via Web Speech API) and provide responses in the farmer's selected language.  It should respond to questions such as, "What crop should I plant now?", "How to treat tomato leaf spots?", and "Will it rain tomorrow in Nagercoil?".  Given the user's location (city, state, or coordinates), the AI tool will suggest the most suitable crops to grow in the current season based on regional climate, soil type, and typical agricultural practices in that area.
- Agricultural News Feed: Displays the latest agriculture-related news using the NEWS_API_KEY, providing farmers with up-to-date information and insights relevant to their profession and region.
- Crop Suggestion Based on Location (Country & Region): Detect User Location automatically using geolocation API or manually via dropdown. Use OpenWeatherMap API or similar to fetch Region & Weather Info. Suggest Crops Based on Country, State/Region, Season & Climate. Display Crop name, image, planting time, soil type, yield info

## Style Guidelines:

- Primary color: Earthy green (#4CAF50) to evoke a sense of nature and growth.
- Background color: Light beige (#F5F5DC) for a clean, soothing backdrop.
- Accent color: Warm orange (#FF9800) to highlight important information and calls to action.
- Headline font: 'Poppins' (sans-serif) for a modern and readable look.  Body font: 'PT Sans' (sans-serif) to improve readability.
- Background graphics related to agriculture. Use clean and modular folder and code structure (templates/, static/, data/, app.py or index.js). Follow clean modular structure and  use Tailwind CSS or Bootstrap for UI styling.
- Use clear, intuitive icons to represent different crops, weather conditions, and alerts.
- Subtle animations for loading states and transitions to provide a smooth user experience.