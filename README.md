# Car Rental Management System Backend

A comprehensive NestJS backend application for managing car rental operations with TypeORM and SQL Server integration.

## 🚀 Features

### Core Entities
- **Car**: Vehicle management with rental rates and availability
- **Customer**: Customer information and contact details
- **Rental**: Car rental transactions with date tracking
- **Payment**: Payment processing for rentals
- **Insurance**: Car insurance policy management
- **Location**: Rental locations and branches
- **Reservation**: Car reservation system
- **Maintenance**: Vehicle maintenance records

### Key Features
- ✅ Full CRUD operations for all entities
- ✅ Bidirectional relationships between entities
- ✅ Comprehensive validation with class-validator
- ✅ SQL Server database integration
- ✅ TypeORM with proper entity relationships
- ✅ Error handling and business logic validation
- ✅ RESTful API endpoints
- ✅ Environment-based configuration

## 🏗️ Architecture

### Project Structure
```
src/
├── car/                    # Car management module
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # TypeORM entities
│   ├── car.controller.ts  # REST endpoints
│   ├── car.service.ts     # Business logic
│   └── car.module.ts      # Module configuration
├── customer/              # Customer management
├── rental/               # Rental transactions
├── payment/              # Payment processing
├── insurance/            # Insurance policies
├── location/             # Rental locations
├── reservation/          # Car reservations
├── maintenance/          # Vehicle maintenance
├── db/                   # Database configuration
│   └── db/
│       ├── database.config.ts
│       └── database.module.ts
└── app.module.ts         # Main application module
```

## 🗄️ Database Schema

### Entity Relationships
- **Customer** → **Rental** (One-to-Many)
- **Car** → **Rental** (One-to-Many)
- **Rental** → **Payment** (One-to-Many)
- **Car** → **Maintenance** (One-to-Many)
- **Car** → **Reservation** (One-to-Many)
- **Customer** → **Reservation** (One-to-Many)
- **Car** → **Insurance** (One-to-One)

### Database Configuration
- **Database**: SQL Server
- **ORM**: TypeORM
- **Connection**: Configurable via environment variables
- **Synchronization**: Auto-sync enabled for development

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- SQL Server (2019 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-rental-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=YourStrong!Passw0rd
   DB_NAME=CarRentalDB
   DB_SCHEMA=dbo
   DB_SYNC=true
   DB_LOGGING=true
   DB_ENCRYPT=false
   DB_TRUST_CERT=true
   DB_POOL_MAX=10
   DB_POOL_MIN=0
   DB_POOL_IDLE_TIMEOUT=30000
   PORT=3000
   ```

4. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run start:prod
   ```

## 📚 API Endpoints

### Cars
- `GET /car` - Get all cars
- `GET /car/:id` - Get car by ID
- `POST /car` - Create new car
- `PATCH /car/:id` - Update car
- `DELETE /car/:id` - Delete car

### Customers
- `GET /customer` - Get all customers
- `GET /customer/:id` - Get customer by ID
- `POST /customer` - Create new customer
- `PATCH /customer/:id` - Update customer
- `DELETE /customer/:id` - Delete customer

### Rentals
- `GET /rental` - Get all rentals
- `GET /rental/:id` - Get rental by ID
- `POST /rental` - Create new rental
- `PATCH /rental/:id` - Update rental
- `DELETE /rental/:id` - Delete rental

### Payments
- `GET /payment` - Get all payments
- `GET /payment/:id` - Get payment by ID
- `GET /payment/rental/:rentalId` - Get payments by rental ID
- `POST /payment` - Create new payment
- `PATCH /payment/:id` - Update payment
- `DELETE /payment/:id` - Delete payment

### Insurance
- `GET /insurance` - Get all insurance policies
- `GET /insurance/:id` - Get insurance by ID
- `GET /insurance/car/:carId` - Get insurance by car ID
- `POST /insurance` - Create new insurance
- `PATCH /insurance/:id` - Update insurance
- `DELETE /insurance/:id` - Delete insurance

### Locations
- `GET /location` - Get all locations
- `GET /location/:id` - Get location by ID
- `POST /location` - Create new location
- `PATCH /location/:id` - Update location
- `DELETE /location/:id` - Delete location

### Reservations
- `GET /reservation` - Get all reservations
- `GET /reservation/:id` - Get reservation by ID
- `POST /reservation` - Create new reservation
- `PATCH /reservation/:id` - Update reservation
- `DELETE /reservation/:id` - Delete reservation

### Maintenance
- `GET /maintenance` - Get all maintenance records
- `GET /maintenance/:id` - Get maintenance by ID
- `GET /maintenance/car/:carId` - Get maintenance by car ID
- `POST /maintenance` - Create new maintenance record
- `PATCH /maintenance/:id` - Update maintenance record
- `DELETE /maintenance/:id` - Delete maintenance record

## 🔧 Business Logic

### Rental System
- **Availability Check**: Cars must be available before rental
- **Date Validation**: Start date must be before end date
- **Overlap Prevention**: Prevents double booking of cars
- **Automatic Updates**: Car availability updated on rental creation/deletion

### Payment System
- **Amount Validation**: Payment amount cannot exceed rental total
- **Multiple Payments**: Supports partial payments for rentals
- **Payment Tracking**: Tracks remaining balance

### Insurance System
- **One Policy Per Car**: Each car can have only one active insurance policy
- **Date Validation**: Insurance start date must be before end date

### Reservation System
- **Availability Check**: Cars must be available for reservation
- **Date Validation**: Pickup date must be before return date
- **Overlap Prevention**: Prevents double booking during reservation period

## 🛠️ Development

### Available Scripts
```bash
npm run start          # Start the application
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode
npm run build          # Build the application
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Database Migration
The application uses TypeORM synchronization for development. For production, consider using migrations:

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## 🧪 Testing

### Sample Data
You can test the API using the following sample data:

#### Create a Car
```json
POST /car
{
  "carModel": "Camry",
  "manufacturer": "Toyota",
  "year": 2023,
  "color": "Silver",
  "rentalRate": 50.00,
  "availability": true
}
```

#### Create a Customer
```json
POST /customer
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City, State"
}
```

#### Create a Rental
```json
POST /rental
{
  "carId": 1,
  "customerId": 1,
  "rentalStartDate": "2024-01-15",
  "rentalEndDate": "2024-01-20",
  "totalAmount": 250.00
}
```

## 🔒 Security Features

- **Input Validation**: All inputs validated using class-validator
- **SQL Injection Protection**: TypeORM provides built-in protection
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Data Integrity**: Foreign key constraints and business logic validation

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 1433 |
| `DB_USERNAME` | Database username | sa |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | CarRentalDB |
| `DB_SCHEMA` | Database schema | dbo |
| `DB_SYNC` | Auto-sync database | true |
| `DB_LOGGING` | Enable SQL logging | true |
| `DB_ENCRYPT` | Encrypt connection | false |
| `DB_TRUST_CERT` | Trust server certificate | true |
| `PORT` | Application port | 3000 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using NestJS, TypeORM, and SQL Server**