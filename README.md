# Genlogs

This project is a frontend application built with React and Vite to simulate a transportation route search portal between cities. The application allows users to enter an origin city, a destination city, query a backend service for available carriers, and visualize up to 3 fast route options on Google Maps.

## What the project does

This application was designed as a simple logistics portal for operators or analysts who need to:

- Search for a route between two cities.
- Use city autocomplete powered by Google Places.
- View the route on Google Maps.
- Compare up to 3 fast route alternatives using Google Directions.
- Query a backend through `POST /search`.
- Display a list of carriers and their truck capacity per day.
- Handle loading, error, empty-state, and success feedback.

## Tech stack

- React
- Vite
- JavaScript
- Material UI
- Axios
- Google Maps JavaScript API
- Google Places API
- Google Directions API

## Main features

### 1. Search form

The form includes:

- A `From` field for the origin city.
- A `To` field for the destination city.
- A `Search` button.
- Validation to ensure both fields are filled in.
- City autocomplete when Google Maps is configured correctly.

### 2. Backend integration

When the user clicks `Search`, the application sends a request to the backend:

```http
POST /search
```

Expected request body:

```json
{
  "from": "Bogota",
  "to": "Medellin"
}
```

The backend response can follow this structure:

```json
{
  "carriers": [
    {
      "id": 1,
      "name": "Knight-Swift Transport Services",
      "trucksPerDay": 10
    },
    {
      "id": 2,
      "name": "JB Hunt",
      "trucksPerDay": 7
    }
  ]
}
```

### 3. Map visualization

When the user provides both origin and destination:

- The route is calculated using Google Directions.
- Alternative routes are requested.
- Up to 3 routes are displayed, sorted by duration.
- The user can switch between the available route options.

### 4. Carrier list

The carriers returned by the backend are displayed in a list with:

- Company name
- Number of trucks per day

Example:

```text
Knight-Swift Transport Services - 10 Trucks/Day
```

## Project structure

```bash
src/
├── components/
│   ├── CarrierList.jsx
│   ├── MapView.jsx
│   └── SearchForm.jsx
├── hooks/
│   ├── useCarrierSearch.js
│   └── useGoogleMaps.js
├── pages/
│   └── Home.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
├── styles.css
└── theme.js
```

## Requirements

Before running the project, make sure you have:

- Node.js 18 or higher
- npm
- A valid Google Maps API key

Recommended Google services:

- Places API
- Directions API
- Maps JavaScript API

## Environment variables

Create or update the `.env` file in the project root with the following values:

```env
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY
VITE_BACKEND_URL=http://localhost:8000
```

### Variable description

- `VITE_GOOGLE_MAPS_API_KEY`: API key used for Google Maps, Places, and Directions.
- `VITE_BACKEND_URL`: Base URL of the backend exposing the `POST /search` endpoint.

## How to run the project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite will display a local URL similar to:

```bash
http://localhost:5173
```

Open that address in your browser to use the application.

## Available scripts

- `npm run dev`: starts the project in development mode.
- `npm run build`: generates the production build inside the `dist` folder.
- `npm run preview`: serves the generated production build locally.

## User flow

1. Enter a city in `From`.
2. Enter a city in `To`.
3. Click `Search`.
4. The app calls the backend to load carriers.
5. If Google Maps is configured, the app also calculates routes and displays them on the map.
6. The user can switch between route alternatives and review available carriers.

## State handling

The application supports the following states:

- `loading`: while fetching carriers or calculating routes.
- `success`: when the request completes successfully.
- `error`: when the backend request fails or Google Maps cannot calculate a route.
- `empty`: when no carriers are returned for the selected route.

Important feedback messages are displayed using Material UI `Snackbar`.

## Important notes

- If `VITE_GOOGLE_MAPS_API_KEY` is not configured, the UI will still load, but the map and autocomplete features will not work.
- If the backend is not running at the configured URL, the search request will fail.
- The `/search` endpoint must accept JSON and return carrier information.

## Expected backend example

Request:

```http
POST http://localhost:8000/search
Content-Type: application/json
```

```json
{
  "from": "Miami",
  "to": "Atlanta"
}
```

Response:

```json
{
  "carriers": [
    {
      "id": 1,
      "name": "Knight-Swift Transport Services",
      "trucksPerDay": 10
    },
    {
      "id": 2,
      "name": "XPO Logistics",
      "trucksPerDay": 6
    }
  ]
}
```

## Production build

To generate the application for deployment:

```bash
npm run build
```

The final files will be created in:

```bash
dist/
```

## Possible future improvements

- Add authentication.
- Allow carrier-type filters.
- Show more details for each carrier.
- Add search history.
- Add unit and integration tests.
