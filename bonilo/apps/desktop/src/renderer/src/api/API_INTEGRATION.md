# Backend API Integration

This document describes how to integrate the SuperMarket Control OS desktop application with a backend API.

## Current State

The application is currently running in **MOCK_MODE**, meaning all data is stored locally using Zustand stores with localStorage persistence. This allows the app to work completely offline.

## Switching to API Mode

To connect to a backend API:

1. Copy `.env.example` to `.env.local`
2. Set `VITE_MOCK_MODE=false`
3. Configure `VITE_API_URL` to point to your backend

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## API Architecture

### Directory Structure

```
src/renderer/src/api/
├── index.ts          # Main barrel export
├── config.ts         # API configuration & endpoints
├── client.ts         # HTTP client with retry/auth
└── services/
    ├── index.ts      # Services barrel export
    ├── auth.ts       # Authentication endpoints
    ├── products.ts   # Product CRUD
    ├── sales.ts      # Sales transactions
    ├── treasury.ts   # Cash management
    └── sync.ts       # Offline sync
```

### API Client Features

- **Automatic Retry**: Failed requests retry with exponential backoff
- **Token Refresh**: Automatic JWT refresh when tokens expire
- **Timeout Handling**: Configurable request timeouts
- **Offline Detection**: Graceful handling when offline
- **Type Safety**: Full TypeScript support

### Usage Examples

```typescript
// Using the API directly
import { api } from '@renderer/api';

const products = await api.products.getAll({ category: 'beverages' });
const sale = await api.sales.create({ items, paymentMethod: 'cash' });

// Using React Query hooks (recommended)
import { useProducts, useCreateSale } from '@renderer/hooks';

function ProductList() {
    const { data, isLoading } = useProducts({ category: 'beverages' });
    const createSale = useCreateSale();
    
    // ...
}
```

## Backend Requirements

The API expects a REST backend with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get product by ID
- `GET /products/barcode/:barcode` - Get by barcode
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Sales
- `GET /sales` - List sales
- `GET /sales/:id` - Get sale by ID
- `POST /sales` - Create sale
- `POST /sales/:id/void` - Void a sale
- `POST /sales/:id/refund` - Refund a sale

### Treasury
- `GET /treasury/sessions/current` - Get current session
- `POST /treasury/sessions/open` - Open new session
- `POST /treasury/sessions/close` - Close session
- `POST /treasury/movements` - Add cash movement
- `GET /treasury/expenses` - List expenses

### Sync
- `POST /sync/push` - Push local changes
- `POST /sync/pull` - Pull remote changes
- `GET /sync/status` - Get sync status

## Response Format

All API responses should follow this format:

```json
{
    "success": true,
    "data": { ... },
    "message": "Optional message"
}
```

Error responses:

```json
{
    "success": false,
    "error": "Error description",
    "code": "ERROR_CODE"
}
```

## Offline-First Strategy

The app uses an offline-first approach:

1. **Local First**: All writes go to local store immediately
2. **Background Sync**: Changes are synced when online
3. **Conflict Resolution**: Server-side wins by default, with manual resolution option
4. **Queue Management**: Failed syncs are queued and retried

## Migration Path

When ready to connect to a backend:

1. Set `VITE_MOCK_MODE=false`
2. Implement the required backend endpoints
3. The React Query hooks will automatically switch to API calls
4. Local stores remain as fallback and cache
