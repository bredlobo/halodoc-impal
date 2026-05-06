# IMPAL Backend API Documentation

This document provides an overview of the IMPAL REST API and WebSocket events. The backend uses Swagger (OpenAPI 3.0) for detailed and interactive endpoint exploration.

## Interactive API Docs (Swagger)

Once the server is running, you can access the interactive Swagger UI at:

- **Local:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **JSON Format:** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Base URL

All REST API endpoints are relative to the Base URL of the API, e.g., `http://localhost:3000`.

---

## Authentication & Security

The API utilizes the following authentication mechanisms:

- **Bearer Token:** JWT token passed in the `Authorization` header (`Bearer <token>`).
- **Cookie Auth:** JWT access token sent via `httpOnly` cookie (`accessToken`).
- **Refresh Cookie Auth:** JWT refresh token sent via `httpOnly` cookie (`refreshToken`).
- **Socket Auth:** Handshake query token (`?token=<jwt_token>`).

---

## API Resource Domains

### 1. Users (`/api/v1/users`)

Handles authentication, registration, profiles, and general user management.

- **POST** `/login`
  - **Payload:**
    ```json
    {
      "email": "user@example.com",
      "password": "Password123"
    }
    ```
  - **Response:** Sets HTTP-only `accessToken` & `refreshToken` cookies. Returns `200 OK` with basic user info.

- **POST** `/register`
  - **Payload:** Requires string for date features `YYYY-MM-DD` and strict phone formats.
    ```json
    {
      "fullName": "John Doe",
      "email": "user@example.com",
      "password": "Password123",
      "confirmPassword": "Password123",
      "telephoneNumber": "08123456789",
      "dob": "1990-01-01",
      "gender": "MALE",
      "specializationId": 1, // Optional: Include to register as doctor
      "strNumber": "STR-12345" // Optional
    }
    ```
  - **Response:** `201 Created` with message.

- **GET** `/profile`
  - **Response:** `200 OK` Returns user profile with relational data (e.g., DoctorProfile if applicable).

- **POST** `/logout`
  - **Response:** `200 OK` Clears authentication cookies.

### 2. Doctors (`/api/v1/doctors`)

Provides doctor discovery, profile and specialization management.

- **GET** `/`
  - Retrieves a list of active doctors.
  - **Response:** `200 OK` Array of Doctor profiles.
- **GET** `/:id`
  - **Response:** `200 OK` Detail profile and schedules for a specific doctor.
- **GET** `/specializations`
  - **Response:** `200 OK` Returns all available medical specializations.

### 3. Consultations (`/api/v1/consultations`)

Handles real-time and scheduled medical consultations, messaging, and post-consultation activities like prescriptions.

- **POST** `/book`
  - **Payload:**
    ```json
    {
      "doctorId": 1
    }
    ```
  - **Response:** `201 Created` Triggering a 5-minute matching timeout process.
- **GET** `/history`
  - **Response:** `200 OK` Array of past consultation sessions for requesting User/Doctor.

- **POST** `/:id/accept` (Doctor only)
  - **Response:** `200 OK` Status changes to `ONGOING`. Emits Socket event `notification`.

- **POST** `/:id/decline` (Doctor only)
  - **Response:** `200 OK` Status changes to `CANCELLED`. Emits Socket event `notification`.

- **POST** `/:id/prescription` (Doctor only)
  - **Payload:**
    ```json
    {
      "notes": "Take after meals",
      "items": [
        {
          "productId": 10,
          "dosage": "2x1",
          "quantity": 1
        }
      ]
    }
    ```
  - **Response:** `201 Created` Submits prescription against the consultation.

### 4. Pharmacy (`/api/v1/pharmacy`)

Manages medical products, cart handling, checkout, and inventory.

- **GET** `/products`
  - **Response:** `200 OK` Array of products, optionally paginated.

- **POST** `/products` (Admin Only)
  - **Payload:**
    ```json
    {
      "categoryId": 1,
      "name": "Paracetamol",
      "description": "Pain relief",
      "price": 15000,
      "stock": 50,
      "imageUrl": "http://example.com/img.jpg"
    }
    ```
  - **Response:** `201 Created`.

- **GET** `/products/:id`
  - **Response:** `200 OK` Single product.

### 5. Ecommerce & Reviews

- Endpoints covering product/doctor ratings and broader ecommerce activities extending the pharmacy features.

---

## Real-Time Events (WebSockets)

The backend runs a Socket.io server to facilitate real-time features like chat and consultation state changes.

### Connection

- **Endpoint:** `ws://localhost:3000`
- **Auth:** Pass JWT on connection query `ws://localhost:3000?token={accessToken}`

### Events

- **Server to Client (Listen for these):**
  - `notification`: Received when consultation status updates (e.g., Accepted, Declined, Timed Out).
  - `chat_message`: Real-time chat messages during an active consultation.
- **Client to Server (Emit these):**
  - `send_message`: Sends a message to a specific consultation room. Payload requires consultation ID and text.

---

_Note: For exact request/response payloads, types, validation messages, and specific query parameters, please refer to the live Swagger UI (`/api-docs`)._
