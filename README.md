# Restaurant Reservation API

A simple REST API for managing restaurant reservations based on the requirements provided.

## Features

- User registration and authentication
- Restaurant management (admin only)
- Table reservation system (max 3 reservations per user)
- User and admin reservation management

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd restaurant-reservation
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
- Edit the `config/config.env` file with your MongoDB connection string and JWT secret

4. Start the server:
```
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Restaurants

- `GET /api/v1/restaurants` - Get all restaurants
- `GET /api/v1/restaurants/:id` - Get single restaurant
- `POST /api/v1/restaurants` - Create new restaurant (admin only)
- `PUT /api/v1/restaurants/:id` - Update restaurant (admin only)
- `DELETE /api/v1/restaurants/:id` - Delete restaurant (admin only)

### Reservations

- `GET /api/v1/reservations` - Get all user reservations
- `GET /api/v1/restaurants/:restaurantId/reservations` - Get reservations for a restaurant
- `POST /api/v1/restaurants/:restaurantId/reservations` - Create reservation for a restaurant
- `GET /api/v1/reservations/:id` - Get single reservation
- `PUT /api/v1/reservations/:id` - Update reservation
- `DELETE /api/v1/reservations/:id` - Delete reservation

## Testing with Postman

1. Register a user:
```
POST /api/v1/auth/register
{
  "name": "Test User",
  "telephone": "1234567890",
  "email": "test@example.com",
  "password": "123456"
}
```

2. Register an admin:
```
POST /api/v1/auth/register
{
  "name": "Admin User",
  "telephone": "9876543210",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

3. Login to get auth token:
```
POST /api/v1/auth/login
{
  "email": "admin@example.com",
  "password": "123456"
}
```

4. Use the auth token in your requests by adding the header:
```
Authorization: Bearer <your-token>
```

5. Create a restaurant:
```
POST /api/v1/restaurants
{
  "name": "Thai Restaurant",
  "address": "123 Main St",
  "telephone": "1234567890",
  "openTime": "10:00",
  "closeTime": "22:00"
}
```

6. Create a reservation:
```
POST /api/v1/restaurants/:restaurantId/reservations
{
  "reservationDate": "2023-08-15T18:00:00.000Z"
}
```