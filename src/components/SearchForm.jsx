import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const autocompleteOptions = {
  types: ['(cities)'],
  fields: ['formatted_address', 'name'],
};

export default function SearchForm({ onSearch, loading, isMapsReady, mapsEnabled }) {
  const [values, setValues] = useState({ from: '', to: '' });
  const [errors, setErrors] = useState({});
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    if (!isMapsReady || !mapsEnabled || !window.google?.maps?.places) {
      return undefined;
    }

    const fromAutocomplete = new window.google.maps.places.Autocomplete(
      fromInputRef.current,
      autocompleteOptions,
    );
    const toAutocomplete = new window.google.maps.places.Autocomplete(
      toInputRef.current,
      autocompleteOptions,
    );

    const bindPlaceListener = (instance, field) =>
      instance.addListener('place_changed', () => {
        const place = instance.getPlace();
        const nextValue = place?.name || place?.formatted_address || '';
        setValues((current) => ({ ...current, [field]: nextValue }));
        setErrors((current) => ({ ...current, [field]: '' }));
      });

    const fromListener = bindPlaceListener(fromAutocomplete, 'from');
    const toListener = bindPlaceListener(toAutocomplete, 'to');

    return () => {
      if (fromListener) {
        window.google.maps.event.removeListener(fromListener);
      }
      if (toListener) {
        window.google.maps.event.removeListener(toListener);
      }
    };
  }, [isMapsReady, mapsEnabled]);

  const handleChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.from.trim()) {
      nextErrors.from = 'Please enter the origin city.';
    }

    if (!values.to.trim()) {
      nextErrors.to = 'Please enter the destination city.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSearch({
      from: values.from.trim(),
      to: values.to.trim(),
    });
  };

  return (
    <Paper
      component="form"
      elevation={0}
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 3, md: 4 },
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Search transport routes
          </Typography>
          <Typography color="text.secondary">
            Compare origin and destination cities, review carriers, and inspect the fastest route
            options on Google Maps.
          </Typography>
        </Box>

        {!mapsEnabled && (
          <Alert severity="warning">
            Google Maps is disabled until you set a valid `VITE_GOOGLE_MAPS_API_KEY`.
          </Alert>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="From"
            placeholder="Origin city"
            value={values.from}
            onChange={handleChange('from')}
            error={Boolean(errors.from)}
            helperText={errors.from}
            inputRef={fromInputRef}
          />
          <TextField
            label="To"
            placeholder="Destination city"
            value={values.to}
            onChange={handleChange('to')}
            error={Boolean(errors.to)}
            helperText={errors.to}
            inputRef={toInputRef}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchRoundedIcon />}
            sx={{ minWidth: { xs: '100%', md: 160 }, alignSelf: 'stretch' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
