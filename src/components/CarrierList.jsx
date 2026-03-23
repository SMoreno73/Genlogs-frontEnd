import {
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';

export default function CarrierList({ carriers, loading, error, hasSearched }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Stack spacing={2.5}>
        <div>
          <Typography variant="h5" gutterBottom>
            Available carriers
          </Typography>
          <Typography color="text.secondary">
            Carrier data is returned by the backend after each route search.
          </Typography>
        </div>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={24} />
            <Typography color="text.secondary">Loading carriers...</Typography>
          </Stack>
        ) : null}

        {!loading && hasSearched && !error && carriers.length === 0 ? (
          <Alert severity="info">No carriers were found for this route.</Alert>
        ) : null}

        {!loading && carriers.length > 0 ? (
          <List disablePadding>
            {carriers.map((carrier, index) => {
              const name = carrier.name || carrier.companyName || `Carrier ${index + 1}`;
              const trucksPerDay =
                carrier.trucksPerDay ?? carrier.trucks_per_day ?? carrier.dailyTrucks ?? 'N/A';

              return (
                <ListItem
                  key={carrier.id || `${name}-${index}`}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom:
                      index < carriers.length - 1 ? '1px solid rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  <LocalShippingRoundedIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary={name}
                    secondary={`${trucksPerDay} Trucks/Day`}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : null}

        {!hasSearched && !loading ? (
          <Typography color="text.secondary">
            Run a search to display transport companies for the selected route.
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
