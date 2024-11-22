# User Management API

This API provides a robust solution for managing users in a scalable and efficient manner. It supports CRUD operations, bulk operations for creation, updates, and deletions, and incorporates modern best practices such as validation, serialization, and response transformation.

## Features

- Fetch users with filters and pagination
- Create, update, and delete users individually or in bulk
- Validation and data transformation using ValidationPipe and interceptors
- Clean and structured code adhering to best practices

## Prerequisites

- Node.js (v16 or later)
- NestJS framework
- A database configured with the service

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_database_url
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Fetch users with pagination and filters |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Delete user by ID |
| POST | `/api/users/bulk` | Bulk create users |
| PUT | `/api/users/bulk` | Bulk update users |
| DELETE | `/api/users/bulk` | Bulk delete users |

## Request/Response Examples

### Create User (POST /api/users)

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "USER",
  "status": "ACTIVE",
  "avatar": "https://example.com/avatar.jpg",
  "address": "123 Main St",
  "billingAddress": "123 Main St",
  "walletBalance": "0.00",
  "isVerified": false
}
```

### Update User (PUT /api/users/:id)

Request body:
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "status": "INACTIVE",
  "role": "ADMIN",
  "walletBalance": "100.00"
}
```

### Get Users with Filters (GET /api/users)

Query Parameters:
```
/api/users?
  name=John&
  email=john@example.com&
  status=ACTIVE&
  role=USER&
  page=1&
  size=10
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "ACTIVE",
      "role": "USER",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "size": 10,
    "totalPages": 10,
    "hasMore": true
  }
}
```

### Bulk Operations

#### Bulk Create Users (POST /api/users/bulk)
```json
{
  "users": [
    {
      "name": "User 1",
      "email": "user1@example.com",
      "password": "password123",
      "role": "USER",
      "status": "ACTIVE"
    },
    {
      "name": "User 2",
      "email": "user2@example.com",
      "password": "password123",
      "role": "USER",
      "status": "ACTIVE"
    }
  ]
}
```

#### Bulk Update Users (PUT /api/users/bulk)
```json
{
  "updates": [
    {
      "identifier": "user1@example.com",
      "data": {
        "status": "INACTIVE"
      }
    },
    {
      "identifier": "user2@example.com",
      "data": {
        "role": "ADMIN"
      }
    }
  ]
}
```

#### Bulk Delete Users (DELETE /api/users/bulk)
```json
{
  "identifiers": ["user1@example.com", "user2@example.com"]
}
```

#### Bulk Operation Response
```json
{
  "successful": 1,
  "failed": 1,
  "errors": [
    {
      "identifier": "user2@example.com",
      "error": "User not found"
    }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      "field": ["validation error message"]
    }
  }
}
```

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Style

This project uses ESLint and Prettier for code formatting. Run the following commands:

```bash
# Lint check
npm run lint

# Fix lint issues
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.