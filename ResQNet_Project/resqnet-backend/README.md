# ResQNet Backend 🚀
Spring Boot 3.2 | PostgreSQL | JWT | WebSocket

## Tech Stack

| Technology | Details                  |
|---|--------------------------|
| Framework | Spring Boot              |
| Language | Java 25                  |
| Database | PostgreSQL               |
| Authentication | JWT                      |
| Real-time | Spring WebSocket (STOMP) |
| Build Tool | Maven                    |
| Port | 8080                     |

---

# Project Setup

## 1. Prerequisites
- Java 25
- PostgreSQL
- Maven
- IntelliJ IDEA

## 2. Database Setup

```sql
CREATE DATABASE resqnet_db;
```

## 3. application.properties

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/resqnet_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

jwt.secret=resqnet_super_secret_key_2026_very_long_string
jwt.expiration=604800000
```

## 4. Run Project

Run `ResqnetBackendApplication.java` in IntelliJ.

Success:

```bash
Tomcat started on port(s): 8080
Started ResqnetBackendApplication
```

---

# Package Structure

```bash
src/main/java/com/resqnet/resqnetbackend/
├── config/        → SecurityConfig, WebSocketConfig, CorsConfig, GlobalExceptionHandler
├── controller/    → All REST Controllers
├── dto/           → Request/Response DTOs
├── model/         → JPA Entities
├── repository/    → JPA Repositories
├── security/      → JwtUtil, JwtFilter
└── service/       → Business Logic
```

---

# API Endpoints

## 🔐 Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login → JWT token | No |

### Register Body

```json
{
  "name": "Test User",
  "email": "test@resqnet.com",
  "password": "123456",
  "phone": "01700000000"
}
```

### Login Body

```json
{
  "email": "test@resqnet.com",
  "password": "123456"
}
```

### Token Use

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🚨 Disaster Alert — `/api/disasters`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/disasters | Create alert | Yes |
| GET | /api/disasters | Get all active alerts | Yes |
| PUT | /api/disasters/{id}/activate | Activate alert | Yes |
| PUT | /api/disasters/{id}/deactivate | Deactivate alert | Yes |

### AlertType
`FLOOD | CYCLONE | EARTHQUAKE | FIRE | OTHER`

### Severity
`LOW | MEDIUM | HIGH | CRITICAL`

### Request Body

```json
{
  "title": "Flash Flood Warning",
  "description": "Severe flooding in Sylhet",
  "alertType": "FLOOD",
  "severity": "HIGH",
  "location": "Sylhet",
  "latitude": 24.8949,
  "longitude": 91.8687
}
```

---

## 🏠 Safe Zone — `/api/safezones`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/safezones | Create safe zone | Yes |
| GET | /api/safezones | Get all available | Yes |
| GET | /api/safezones/type/{zoneType} | Filter by type | Yes |
| PUT | /api/safezones/{id}/occupancy | Update occupancy | Yes |
| PUT | /api/safezones/{id}/toggle-availability | Toggle availability | Yes |

### ZoneType
`SHELTER | HOSPITAL | SCHOOL | MOSQUE | OTHER`

> ⚠️ Occupancy > Capacity = `400 Bad Request`

---

## 👨‍⚕️ Doctor — `/api/doctors`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/doctors | Add doctor | Yes |
| GET | /api/doctors | Get all available | Yes |
| GET | /api/doctors/area/{area} | Filter by area | Yes |
| GET | /api/doctors/specialization/{spec} | Partial search | Yes |
| PUT | /api/doctors/{id}/toggle-availability | Toggle availability | Yes |

### ConsultType
`IN_PERSON | ONLINE | BOTH`

> ✅ Specialization search is partial & case-insensitive

---

## 🚑 Ambulance — `/api/ambulances`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/ambulances | Add ambulance | Yes |
| GET | /api/ambulances | Get all available | Yes |
| GET | /api/ambulances/area/{area} | Filter by area | Yes |
| PUT | /api/ambulances/{id}/status | Update status | Yes |
| PUT | /api/ambulances/{id}/location | Update GPS | Yes |

### Status
`AVAILABLE | ON_DUTY | MAINTENANCE`

### Location Update

```http
PUT /api/ambulances/{id}/location?lat=23.81&lng=90.41
```

---

## 🩸 Blood Bank — `/api/blood-bank`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/blood-bank | Register donor | Yes |
| GET | /api/blood-bank/{bloodGroup} | Find by blood group | Yes |
| GET | /api/blood-bank/{bloodGroup}/{area} | Filter by group + area | Yes |
| PUT | /api/blood-bank/{id}/toggle-availability | Toggle availability | Yes |

### BloodGroup
`A_POSITIVE | A_NEGATIVE | B_POSITIVE | B_NEGATIVE | O_POSITIVE | O_NEGATIVE | AB_POSITIVE | AB_NEGATIVE`

---

## 🔍 Missing Person — `/api/missing-persons`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/missing-persons | Report missing | Yes |
| GET | /api/missing-persons | Get all missing | Yes |
| GET | /api/missing-persons/search/name/{name} | Search by name | Yes |
| GET | /api/missing-persons/search/location/{loc} | Search by location | Yes |
| PUT | /api/missing-persons/{id}/found | Mark as found | Yes |

### Gender
`MALE | FEMALE | OTHER`

### Status
`MISSING | FOUND`

---

## 🆘 SOS — `/api/sos`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/sos/trigger | Trigger SOS | Yes |
| GET | /api/sos/active | Get active SOS | Yes |
| PUT | /api/sos/{id}/resolve | Resolve SOS | Yes |

### Request Body

```json
{
  "senderName": "Rahim",
  "senderPhone": "01700000001",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "message": "Flood! Need help!"
}
```

### Response Includes
- Nearest ambulance (area + phone)
- Nearest safe zone (name + address)
- Distance via Haversine formula

---

## 🏙️ Civic Report — `/api/civic-reports`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/civic-reports | Submit report | Yes |
| GET | /api/civic-reports | Get all reports | Yes |
| GET | /api/civic-reports/status/{status} | Filter by status | Yes |
| GET | /api/civic-reports/type/{type} | Filter by type | Yes |
| GET | /api/civic-reports/search/{location} | Search by location | Yes |
| PUT | /api/civic-reports/{id}/status | Update status | Yes |

### ReportType
`ROAD_DAMAGE | WATERLOGGING | POWER_OUTAGE | GAS_LEAK | FIRE | OTHER`

### ReportStatus
`PENDING | IN_PROGRESS | RESOLVED`

---

## ✅ Health Check — `/api`

| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/health | No |
| GET | /api/protected | Yes |

---

# WebSocket (Real-time)

| Property | Value |
|---|---|
| Endpoint | ws://localhost:8080/ws |
| Protocol | STOMP over SockJS |
| Disaster Topic | /topic/disasters |
| SOS Topic | /topic/sos |

> Automatically broadcast when a new disaster alert or SOS is triggered.
---

# Security

## Public Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`

## Protected Routes
All other routes → JWT token required

## Roles
`USER | DOCTOR | ADMIN`

---

# Error Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Validation error |
| 401 | No token |
| 403 | Token expired/invalid |
| 500 | Server error |

---

# Database Tables

- `app_users` — User accounts
- `disaster_alerts` — Disaster alerts
- `safe_zones` — Safe zones
- `doctors` — Doctor profiles
- `ambulances` — Ambulance fleet
- `blood_banks` — Blood donors
- `missing_persons` — Missing person reports
- `sos_alerts` — SOS alerts
- `civic_reports` — Civic reports

---

# Quick Test Checklist

1. `POST /api/auth/register`
2. `POST /api/auth/login` → copy token
3. `GET /api/health`
4. `POST /api/disasters`
5. `POST /api/safezones`
6. `POST /api/ambulances`
7. `POST /api/sos/trigger` → nearest ambulance + safe zone

---
