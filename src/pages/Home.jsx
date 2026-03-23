import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import SearchForm from '../components/SearchForm';
import MapView from '../components/MapView';
import CarrierList from '../components/CarrierList';
import useCarrierSearch from '../hooks/useCarrierSearch';
import useGoogleMaps from '../hooks/useGoogleMaps';

export default function Home() {
  const [searchValues, setSearchValues] = useState({ from: '', to: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const { carriers, loading, error, hasSearched, runSearch } = useCarrierSearch();
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();

  const headerSubtitle = useMemo(
    () =>
      'Explore city-to-city transport routes, then compare backend carrier results in one place.',
    [],
  );

  const handleSearch = async ({ from, to }) => {
    setSearchValues({ from, to });

    try {
      await runSearch({ from, to });
      setSnackbar({
        open: true,
        message: 'Route and carrier data loaded successfully.',
        severity: 'success',
      });
    } catch (requestError) {
      setSnackbar({
        open: true,
        message: requestError.message,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', letterSpacing: '0.2em', fontWeight: 800 }}
            >
              Transport Intelligence Portal
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.7rem', md: '4.4rem' }, mt: 1 }}>
              Search routes. Visualize options. Match carriers.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 680 }}>
              {headerSubtitle}
            </Typography>
          </Box>

          {loadError && (
            <Alert severity="warning">
              Google Maps could not be loaded. Check your API key and enabled Google services.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <SearchForm
                onSearch={handleSearch}
                loading={loading}
                isMapsReady={isLoaded}
                mapsEnabled={hasApiKey && !loadError}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <MapView
                from={searchValues.from}
                to={searchValues.to}
                isMapsReady={isLoaded}
                mapsEnabled={hasApiKey && !loadError}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <CarrierList
                carriers={carriers}
                loading={loading}
                error={error}
                hasSearched={hasSearched}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
