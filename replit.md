# Airline Reservation System

## Overview
A full-stack airline reservation system built with Java Spring Boot backend and HTML/CSS/JavaScript frontend. The system provides a complete flight booking experience with user authentication, flight search, seat selection, and mock payment processing.

**Status:** ✅ Fully functional with JWT authentication
**Last Updated:** October 18, 2025

## Features

### Core Functionality
- ✈️ User registration and login with JWT authentication
- 🔍 Flight search by origin and destination
- 💺 Interactive seat selection with visual seat map
- 💳 Mock payment processing with fake payment gateway
- 📱 Mobile-responsive design with beautiful airline theme
- 📋 User booking history and management

### Technical Features
- RESTful API architecture
- JWT-based stateless authentication
- H2 in-memory database
- Spring Security integration
- Cross-origin resource sharing (CORS) enabled
- Responsive UI with airline theme

## Technology Stack

### Backend
- **Java 11** with Spring Boot 2.7.14
- **Spring Data JPA** for database operations
- **Spring Security** with JWT authentication
- **H2 Database** (in-memory) for development
- **Maven** for dependency management

### Frontend
- **HTML5** for structure
- **CSS3** with responsive design
- **Vanilla JavaScript** for interactivity
- **Fetch API** for backend communication

## Project Structure

```
airline-reservation-system/
├── src/
│   └── main/
│       ├── java/com/airline/reservation/
│       │   ├── AirlineReservationApplication.java  # Main application
│       │   ├── config/
│       │   │   └── SecurityConfig.java             # Security configuration
│       │   ├── controller/
│       │   │   ├── AuthController.java             # Authentication endpoints
│       │   │   ├── FlightController.java           # Flight search endpoints
│       │   │   └── BookingController.java          # Booking endpoints
│       │   ├── model/
│       │   │   ├── User.java                       # User entity
│       │   │   ├── Flight.java                     # Flight entity
│       │   │   └── Booking.java                    # Booking entity
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── FlightRepository.java
│       │   │   └── BookingRepository.java
│       │   ├── service/
│       │   │   ├── UserService.java                # User management
│       │   │   ├── FlightService.java              # Flight operations
│       │   │   └── BookingService.java             # Booking operations
│       │   └── security/
│       │       ├── JwtUtil.java                    # JWT token utilities
│       │       └── JwtAuthenticationFilter.java    # JWT filter
│       └── resources/
│           ├── application.properties              # App configuration
│           └── static/
│               ├── index.html                      # Main page
│               ├── css/style.css                   # Styles
│               └── js/app.js                       # Client-side logic
└── pom.xml                                         # Maven dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

### Flights
- `GET /api/flights/search?origin={origin}&destination={destination}` - Search flights
- `GET /api/flights/{id}` - Get flight details

### Bookings (Requires Authentication)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings

## How to Use

### For Users
1. **Register**: Click "Login" and then "Register" to create an account
2. **Login**: Use your credentials to log in
3. **Search Flights**: Select origin and destination, then search
4. **Book Flight**: Click "Book Now" on desired flight
5. **Select Seat**: Choose your seat from the visual seat map
6. **Enter Details**: Fill in passenger information
7. **Pay**: Enter mock payment details (any card number works)
8. **Confirm**: Receive booking confirmation with reference number

### Sample Flight Data
The system includes 8 pre-loaded flights between major US cities:
- New York ↔ Los Angeles
- Chicago ↔ Miami
- San Francisco ↔ Seattle
- Boston ↔ Orlando

## Security Implementation

### JWT Authentication
- Tokens generated on successful login
- 24-hour token expiration
- Tokens validated on each protected endpoint request
- Stateless session management

### Spring Security
- Custom JWT authentication filter
- Password encryption with BCrypt
- CORS configuration for cross-origin requests
- Public endpoints: auth, flights, static files
- Protected endpoints: bookings

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- password (Encrypted)
- fullName
- email

### Flights Table
- id (Primary Key)
- flightNumber
- origin
- destination
- departureTime
- arrivalTime
- price
- availableSeats

### Bookings Table
- id (Primary Key)
- userId
- flightId
- passengerName
- seatNumber
- bookingReference (6-character code)
- totalPrice
- bookingTime
- paymentStatus

## Running the Application

The application runs on port 5000 via the "Spring Boot Server" workflow.

**Access the app at:** The webview URL provided by Replit

To manually run:
```bash
mvn clean spring-boot:run
```

## Development Notes

### Mock Payment
The payment processing is simulated. Any card details will be accepted. In production, integrate with real payment gateway (Stripe, PayPal, etc.).

### Database
H2 in-memory database is used for development. Data is lost on restart. For production, migrate to PostgreSQL or MySQL.

### Future Enhancements
- Round-trip and multi-city bookings
- Flight filtering (price, time, airline)
- Booking cancellation and modification
- Email confirmation
- Admin panel for flight management
- Real payment gateway integration
- Production database with persistence
- Additional airlines and routes

## Recent Changes

**October 18, 2025**
- Fixed critical JWT authentication integration
- Added JwtAuthenticationFilter to validate tokens
- Integrated filter with Spring Security filter chain
- Booking endpoints now properly authenticate users
- Complete booking flow now functional end-to-end

## Architecture Decisions

1. **Stateless Authentication**: JWT tokens eliminate need for server-side sessions
2. **In-Memory Database**: H2 provides fast development without external dependencies
3. **Vanilla JavaScript**: No framework dependencies for simple, fast frontend
4. **Spring Boot**: Rapid development with convention over configuration
5. **RESTful Design**: Clean API structure following REST principles

## Contact & Support
This is a demonstration project showcasing full-stack development with Java Spring Boot.
