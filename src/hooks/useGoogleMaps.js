import { useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

export default function useGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const loaderOptions = useMemo(
    () => ({
      googleMapsApiKey: apiKey || '',
      libraries,
    }),
    [apiKey],
  );

  const { isLoaded, loadError } = useJsApiLoader(loaderOptions);

  return {
    isLoaded,
    loadError,
    hasApiKey: Boolean(apiKey && apiKey !== 'TU_API_KEY'),
  };
}
