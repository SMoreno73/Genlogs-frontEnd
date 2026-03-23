# Transport Route Portal

Portal frontend construido con React + Vite para buscar rutas entre ciudades, visualizar opciones en Google Maps y mostrar carriers devueltos por un backend.

## Requisitos

- Node.js 18+
- Una API key de Google Maps con `Places API` y `Directions API` habilitadas

## Variables de entorno

```env
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY
VITE_BACKEND_URL=http://localhost:8000
```

## Instalacion

```bash
npm install
npm run dev
```

## Backend esperado

- `POST /search`

Body:

```json
{
  "from": "Bogota",
  "to": "Medellin"
}
```

Respuesta sugerida:

```json
{
  "carriers": [
    {
      "id": 1,
      "name": "Knight-Swift Transport Services",
      "trucksPerDay": 10
    }
  ]
}
```
