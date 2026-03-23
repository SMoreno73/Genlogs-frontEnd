import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '440px',
};

const defaultCenter = { lat: 39.8283, lng: -98.5795 };

export default function MapView({ from, to, isMapsReady, mapsEnabled }) {
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [directions, setDirections] = useState(null);
  const [routeError, setRouteError] = useState('');

  useEffect(() => {
    if (!from || !to || !isMapsReady || !mapsEnabled || !window.google?.maps) {
      setLoadingRoutes(false);
      setSelectedRouteIndex(0);
      setRoutes([]);
      setDirections(null);
      setRouteError('');
      return;
    }

    const service = new window.google.maps.DirectionsService();
    setLoadingRoutes(true);
    setRouteError('');

    service.route(
      {
        origin: from,
        destination: to,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        region: 'us',
      },
      (result, status) => {
        setLoadingRoutes(false);

        if (status !== 'OK' || !result?.routes?.length) {
          setDirections(null);
          setRoutes([]);
          setRouteError('We could not calculate routes for the selected cities.');
          return;
        }

        const sortedRoutes = result.routes
          .map((route, originalIndex) => ({ route, originalIndex }))
          .sort(({ route: routeA }, { route: routeB }) => {
            const durationA = routeA.legs?.[0]?.duration?.value || Number.MAX_SAFE_INTEGER;
            const durationB = routeB.legs?.[0]?.duration?.value || Number.MAX_SAFE_INTEGER;
            return durationA - durationB;
          })
          .slice(0, 3)
          .map(({ route, originalIndex }, index) => ({
            id: `${route.summary || 'route'}-${index}`,
            summary: route.summary || `Route ${index + 1}`,
            distance: route.legs?.[0]?.distance?.text || 'N/A',
            duration: route.legs?.[0]?.duration?.text || 'N/A',
            routeIndex: originalIndex,
          }));

        setSelectedRouteIndex(0);
        setDirections(result);
        setRoutes(sortedRoutes);
      },
    );
  }, [from, to, isMapsReady, mapsEnabled]);

  const currentRoute = useMemo(
    () => routes[selectedRouteIndex] || null,
    [routes, selectedRouteIndex],
  );

  const handleRouteChange = (_, nextValue) => {
    if (nextValue === null) {
      return;
    }
    setSelectedRouteIndex(nextValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        minHeight: 620,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Route map
          </Typography>
          <Typography color="text.secondary">
            The map shows up to three of the fastest Google driving routes between the selected
            cities.
          </Typography>
        </Box>

        {!mapsEnabled && (
          <Alert severity="info">
            Check Google Maps API settings to enable the map, Places autocomplete, and
            route calculation.
          </Alert>
        )}

        {routeError && <Alert severity="error">{routeError}</Alert>}

        {routes.length > 0 && (
          <Stack spacing={2}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={selectedRouteIndex}
              onChange={handleRouteChange}
              color="primary"
            >
              {routes.map((route, index) => (
                <ToggleButton key={route.id} value={index} sx={{ py: 1.5 }}>
                  Route {index + 1}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {currentRoute && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Chip icon={<AltRouteRoundedIcon />} label={currentRoute.summary} />
                <Chip icon={<AccessTimeRoundedIcon />} label={`ETA: ${currentRoute.duration}`} />
                <Chip label={`Distance: ${currentRoute.distance}`} />
              </Stack>
            )}
          </Stack>
        )}

        <Box
          sx={{
            position: 'relative',
            flexGrow: 1,
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          {loadingRoutes && (
            <Stack
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                backgroundColor: 'rgba(248, 250, 252, 0.72)',
              }}
            >
              <CircularProgress />
              <Typography color="text.secondary">Calculating the fastest routes...</Typography>
            </Stack>
          )}

          {mapsEnabled && isMapsReady ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={4}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                fullscreenControl: true,
              }}
            >
              {directions && currentRoute && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    routeIndex: currentRoute.routeIndex,
                    preserveViewport: false,
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: '#0f766e',
                      strokeWeight: 6,
                    },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ minHeight: '440px', px: 3, textAlign: 'center' }}
            >
              <Typography variant="h6">Map preview unavailable</Typography>
              <Typography color="text.secondary">
                Configure Google Maps to visualize the route between your origin and destination.
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
