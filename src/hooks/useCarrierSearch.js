import { useCallback, useState } from 'react';
import { searchRoutes } from '../services/api';

const normalizeCarriers = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.carriers)) {
    return payload.carriers;
  }

  return [];
};

export default function useCarrierSearch() {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async ({ from, to }) => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const payload = await searchRoutes({ from, to });
      setCarriers(normalizeCarriers(payload));
      return payload;
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'We could not retrieve carriers for this route. Please try again.';
      setCarriers([]);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    carriers,
    loading,
    error,
    hasSearched,
    runSearch,
  };
}
