# ResQNet REST API Reference Guide

This document provides a comprehensive REST API specification for the **ResQNet** full-stack enterprise application. It serves as the single source of truth for both frontend developers integrating features and backend developers extending services.

---

## Global API Rules & Conventions

* **Base URL**: `http://localhost:8080/api`
* **Real-time WebSocket Endpoint**: `ws://localhost:8080/ws`
* **Default Content-Type**: `application/json`
* **Authentication Header**: `Authorization: Bearer <JWT_TOKEN>` (unless marked as *Not Required*)

---

## 1. Authentication Service (`/api/auth`)

Manage user registration, encryption, and session token generation.

### A. Register New User
* **Method**: `POST`
* **Route**: `/api/auth/register`
* **Description**: Registers a new citizen, doctor, or volunteer account in the system.
* **Authentication**: Not Required
* **Request Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
* **Request Body**:
  ```json
  {
    "name": "Al Amin",
    "email": "alamin@resqnet.org",
    "password": "123456",
    "phone": "01712345678"
  }
  ```
* **Response (Success - 200 OK)**:
  ```text
  User registered successfully!
  ```
* **Validation Rules**:
  * `email` must be unique and valid.
  * `name`, `email`, `password`, and `phone` are mandatory fields.
* **Possible Errors**:
  * `400 Bad Request`: "Email already exists!" or missing parameters.

---

### B. Authenticate User (Login)
* **Method**: `POST`
* **Route**: `/api/auth/login`
* **Description**: Verifies credentials and issues a JSON Web Token (JWT) with user roles embedded as claims.
* **Authentication**: Not Required
* **Request Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
* **Request Body**:
  ```json
  {
    "email": "alamin@resqnet.org",
    "password": "123456"
  }
  ```
* **Response (Success - 200 OK)**:
  ```text
  eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGFtaW5AcmVzcW5ldC5vcmciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ...
  ```
  *(Note: The raw JWT string is returned directly in the response body as text)*
* **Possible Errors**:
  * `400 Bad Request`: "User not found!" or "Invalid password!"
  * `500 Internal Server Error`

---

## 2. Emergency SOS Service (`/api/sos`)

The critical panic-button engine. Resolves nearest rescuers and shelters in real-time.

### A. Trigger Emergency SOS Alert
* **Method**: `POST`
* **Route**: `/api/sos/trigger`
* **Description**: Logs an active SOS alert, broadcasts it over WebSockets, calculates distance using the Haversine formula, and returns the nearest ambulance and safe zone.
* **Authentication**: Required (Standard User/Doctor/Volunteer/Admin)
* **Request Body**:
  ```json
  {
    "senderName": "Sabbir Hossain",
    "senderPhone": "01588888888",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "message": "Water rising! Flooded inside the house with children."
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "sosId": 12,
    "message": "SOS triggered! Help is on the way!",
    "nearest": {
      "ambulanceArea": "Dhaka North",
      "ambulancePhone": "01911112222",
      "safeZoneName": "Mirpur Govt High School Shelter",
      "safeZoneAddress": "Road 10, Mirpur, Dhaka"
    }
  }
  ```
* **Possible Errors**:
  * `401 Unauthorized`: Missing or invalid JWT token.
  * `400 Bad Request`: Invalid coordinates format.

---

### B. Get Active SOS Alerts
* **Method**: `GET`
* **Route**: `/api/sos/active`
* **Description**: Lists all active emergency events currently needing rescue dispatching.
* **Authentication**: Not Required (Allows rescue coordinates to map on general dashboards)
* **Response (Success - 200 OK)**:
  ```json
  [
    {
      "id": 12,
      "userId": 4,
      "senderName": "Sabbir Hossain",
      "senderPhone": "01588888888",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "message": "Water rising! Flooded inside the house with children.",
      "status": "ACTIVE",
      "createdAt": "2026-05-25T14:30:00"
    }
  ]
  ```

---

### C. Resolve Active SOS Alert
* **Method**: `PUT`
* **Route**: `/api/sos/{id}/resolve`
* **Description**: Marks a specific emergency event as resolved/rescued.
* **Authentication**: Required
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": 12,
    "userId": 4,
    "senderName": "Sabbir Hossain",
    "senderPhone": "01588888888",
    "latitude": 23.8103,
    "longitude": 90.4125,
    "message": "Water rising! Flooded inside the house with children.",
    "status": "RESOLVED",
    "createdAt": "2026-05-25T14:30:00"
  }
  ```

---

## 3. Profile & History Service (`/api/profile`)

Manage custom citizen settings, medical files, emergency contacts, and personal SOS history.

### A. Retrieve Logged-in Profile
* **Method**: `GET`
* **Route**: `/api/profile`
* **Description**: Fetches the medical card and emergency parameters of the authenticated user.
* **Authentication**: Required
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": 1,
    "userId": 4,
    "name": "Al Amin",
    "phone": "01712345678",
    "bloodGroup": "O_POSITIVE",
    "medicalConditions": "Asthma, Nut allergy",
    "emergencyContact1": "01999999999 (Father)",
    "emergencyContact2": "01888888888 (Spouse)",
    "isVolunteer": true
  }
  ```
* **Response (No Profile Created - 204 No Content)**:
  * *(Returned when user registered but hasn't updated medical/profile details yet)*

---

### B. Update or Create Profile
* **Method**: `PUT`
* **Route**: `/api/profile`
* **Description**: Saves or overwrites emergency info. Safe handles linking to the dynamic `userId`.
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "bloodGroup": "B_POSITIVE",
    "medicalConditions": "None",
    "emergencyContact1": "01777777777",
    "emergencyContact2": "01666666666",
    "isVolunteer": false
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": 1,
    "userId": 4,
    "name": "Al Amin",
    "phone": "01712345678",
    "bloodGroup": "B_POSITIVE",
    "medicalConditions": "None",
    "emergencyContact1": "01777777777",
    "emergencyContact2": "01666666666",
    "isVolunteer": false
  }
  ```

---

### C. Get User Panic Button History
* **Method**: `GET`
* **Route**: `/api/profile/history`
* **Description**: Lists all historical panic-button triggers initiated by the currently logged-in user.
* **Authentication**: Required
* **Response (Success - 200 OK)**:
  ```json
  [
    {
      "id": 12,
      "userId": 4,
      "senderName": "Sabbir Hossain",
      "senderPhone": "01588888888",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "message": "Water rising! Flooded inside the house with children.",
      "status": "RESOLVED",
      "createdAt": "2026-05-25T14:30:00"
    }
  ]
  ```

---

## 4. Disaster Alert Service (`/api/disasters`)

Manage alerts for severe natural events (Floods, Cyclones, Earthquakes, Fires).

* **Common Resource Mappings**:
  * **AlertType**: `FLOOD | CYCLONE | EARTHQUAKE | FIRE | OTHER`
  * **Severity**: `LOW | MEDIUM | HIGH | CRITICAL`

### A. Fetch Active Disaster Warnings
* **Method**: `GET`
* **Route**: `/api/disasters`
* **Description**: Gets all active disaster warning regions globally mapped.
* **Authentication**: Not Required
* **Response (Success - 200 OK)**:
  ```json
  [
    {
      "id": 2,
      "title": "Severe Cyclone Warning",
      "description": "Cyclone Remal making landfall with wind speeds over 120km/h.",
      "alertType": "CYCLONE",
      "severity": "CRITICAL",
      "location": "Cox's Bazar",
      "latitude": 21.4272,
      "longitude": 92.0058,
      "active": true,
      "createdAt": "2026-05-25T12:00:00"
    }
  ]
  ```

---

### B. Broadcast a New Disaster Warning
* **Method**: `POST`
* **Route**: `/api/disasters`
* **Description**: Spawns a new emergency situation. Automatically broadcasts the event over WebSockets to `/topic/disasters`.
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "title": "Severe Riverbank Erosion",
    "description": "Padma river bank collapsing. Locals advised to stay away.",
    "alertType": "FLOOD",
    "severity": "HIGH",
    "location": "Rajshahi",
    "latitude": 24.3745,
    "longitude": 88.6042
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": 3,
    "title": "Severe Riverbank Erosion",
    "description": "Padma river bank collapsing. Locals advised to stay away.",
    "alertType": "FLOOD",
    "severity": "HIGH",
    "location": "Rajshahi",
    "latitude": 24.3745,
    "longitude": 88.6042,
    "active": true,
    "createdAt": "2026-05-25T20:38:00"
  }
  ```

---

### C. Activate / Deactivate Disaster Alert
* **Method**: `PUT`
* **Route**: `/api/disasters/{id}/activate` OR `/api/disasters/{id}/deactivate`
* **Description**: Changes the active state of a disaster event.
* **Authentication**: Required
* **Response (Success - 200 OK)**: Returns the modified alert object with updated `active` status.

---

## 5. Safe Shelter Service (`/api/safezones`)

Monitor availability and capacity of safe zones (Shelters, Hospitals, Schools, Mosques).

* **ZoneTypes**: `SHELTER | HOSPITAL | SCHOOL | MOSQUE | OTHER`

### A. Get Available Safe Shelters
* **Method**: `GET`
* **Route**: `/api/safezones`
* **Description**: Lists all active safe zones containing capacity thresholds.
* **Authentication**: Not Required

### B. Register New Safe Shelter
* **Method**: `POST`
* **Route**: `/api/safezones`
* **Description**: Registers a physical location as a safe zone.
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "name": "Mirpur Cyclone Shelter",
    "address": "Block C, Mirpur, Dhaka",
    "latitude": 23.8055,
    "longitude": 90.3625,
    "zoneType": "SHELTER",
    "capacity": 500,
    "currentOccupancy": 0
  }
  ```

---

### C. Update Occupancy Level
* **Method**: `PUT`
* **Route**: `/api/safezones/{id}/occupancy?count={newCount}`
* **Description**: Updates the real-time headcount inside a shelter.
* **Authentication**: Required
* **Constraints**: If `count` exceeds the registered `capacity`, the request will fail.
* **Response (Success - 200 OK)**: Returns the updated safe zone object.
* **Possible Errors**:
  * `400 Bad Request`: "Capacity exceeded! Maximum allowed is 500."

---

## 6. Fleet & Logistics Service (`/api/ambulances`)

Monitor the locations and statuses of emergency vehicles.

* **Status Values**: `AVAILABLE | ON_DUTY | MAINTENANCE`

### A. Fetch Available Fleet
* **Method**: `GET`
* **Route**: `/api/ambulances`
* **Description**: Lists all active emergency vehicles.
* **Authentication**: Not Required

### B. Register Vehicle
* **Method**: `POST`
* **Route**: `/api/ambulances`
* **Description**: Registers an ambulance inside the system.
* **Authentication**: Required
* **Request Body**:
  ```json
  {
    "vehicleNumber": "Dhaka-Metro-12-3456",
    "driverName": "Helal Uddin",
    "driverPhone": "01822334455",
    "area": "Mirpur",
    "currentLatitude": 23.805,
    "currentLongitude": 90.368
  }
  ```

---

### C. Update GPS Coordinates
* **Method**: `PUT`
* **Route**: `/api/ambulances/{id}/location`
* **Description**: Modifies the real-time geolocation of a vehicle (invoked by vehicle driver app).
* **Authentication**: Required
* **Query Parameters**:
  * `lat` (double, required)
  * `lng` (double, required)
* **Response (Success - 200 OK)**: Returns updated ambulance resource.

---

### D. Update Ambulance Status
* **Method**: `PUT`
* **Route**: `/api/ambulances/{id}/status?status={STATUS}`
* **Description**: Switches vehicle operational state between `AVAILABLE`, `ON_DUTY`, or `MAINTENANCE`.
* **Authentication**: Required

---

## 7. Medical & Blood Support Services

Search for emergency clinicians and blood bank reserves.

### A. Doctor Directory (`/api/doctors`)
* **GET `/api/doctors`**: Returns all available doctors. (Public)
* **GET `/api/doctors/area/{area}`**: Searches doctors working in a specific local area. (Public)
* **GET `/api/doctors/specialization/{spec}`**: Case-insensitive partial matching for clinician expertise (e.g., `/specialization/pedi` matches *Pediatrician*). (Public)
* **POST `/api/doctors`**: Registers a doctor profile. (Required)
* **PUT `/api/doctors/{id}/toggle-availability`**: Toggles availability. (Required)

### B. Blood Bank (`/api/blood-bank`)
* **GET `/api/blood-bank/{bloodGroup}`**: Finds all donors matching a specific blood group. (Required)
* **GET `/api/blood-bank/{bloodGroup}/{area}`**: Filters donors by both blood group and geographic location. (Required)
* **POST `/api/blood-bank`**: Registers a volunteer as a donor. (Required)
* **PUT `/api/blood-bank/{id}/toggle-availability`**: Toggles donor availability. (Required)

---

## 8. Missing Persons Portal (`/api/missing-persons`)

Post and resolve files of lost citizens during emergencies.

* **GET `/api/missing-persons`**: Lists all active missing reports. (Required)
* **GET `/api/missing-persons/search/name/{name}`**: Searches by name. (Required)
* **GET `/api/missing-persons/search/location/{loc}`**: Searches by last seen location. (Required)
* **POST `/api/missing-persons`**: Registers a missing person file. (Required)
* **PUT `/api/missing-persons/{id}/found`**: Marks a person as found, resolving the report. (Required)

---

## 9. Civic Incident Reporting (`/api/civic-reports`)

Report regional infrastructure damage (Road collapse, waterlogging, fire risk, gas leak).

* **ReportTypes**: `ROAD_DAMAGE | WATERLOGGING | POWER_OUTAGE | GAS_LEAK | FIRE | OTHER`
* **ReportStatus**: `PENDING | IN_PROGRESS | RESOLVED`

* **GET `/api/civic-reports`**: Retrieves all civic incident reports. (Required)
* **GET `/api/civic-reports/status/{status}`**: Filter by status. (Required)
* **GET `/api/civic-reports/type/{type}`**: Filter by category. (Required)
* **GET `/api/civic-reports/search/{location}`**: Search by keyword location. (Required)
* **POST `/api/civic-reports`**: Files a new incident. (Required)
* **PUT `/api/civic-reports/{id}/status?status={status}`**: Updates incident resolution status. (Required)

---

## 10. AI Chat Assistant (`/api/resqbot`)

A specialized assistant serving as the crisis AI chatbot.

### A. Ask AI Assistant
* **Method**: `POST`
* **Route**: `/api/resqbot/chat`
* **Description**: Delegates disaster query context directly to third-party models (Claude, OpenAI, Gemini, FreeLLM) using the user's provided API key.
* **Authentication**: Not Required (Ensures access during crisis without logging in)
* **Request Body**:
  ```json
  {
    "provider": "gemini",
    "apiKey": "AIzaSyD_EXAMPLE_KEY",
    "message": "বন্যার সময় খাবার পানি কিভাবে বিশুদ্ধ করবো?",
    "history": [
      {
        "role": "user",
        "content": "হ্যালো"
      },
      {
        "role": "assistant",
        "content": "হ্যালো! আমি ResQBot। কিভাবে সাহায্য করতে পারি?"
      }
    ]
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "response": "বন্যার পানি বিশুদ্ধ করার জন্য নিচে দেওয়া পদ্ধতিগুলো অনুসরণ করতে পারেন:\n১. পানি অন্তত ১০-১৫ মিনিট ফুটিয়ে নিন।\n২. ওয়াটার পিউরিফাইং ট্যাবলেট (যেমন হ্যালোজেন ট্যাবলেট) ব্যবহার করতে পারেন। ১ লিটার পানিতে ১টি ট্যাবলেট ৩০ মিনিট ভিজিয়ে রাখতে হবে।\n৩. ফিটকিরি ব্যবহার করতে পারেন।",
    "provider": "gemini"
  }
  ```

---

## 11. Security Gateway & Admin Service (`/api/admin`)

Administrative configuration endpoints protected by strict RBAC constraints.

* **Required Authority**: `ROLE_ADMIN` (Users must have `Role.ADMIN` token claim)

### A. Retrieve Administration Metrics
* **Method**: `GET`
* **Route**: `/api/admin/metrics`
* **Description**: Aggregates vital system statistics for the admin command panel.
* **Response (Success - 200 OK)**:
  ```json
  {
    "totalUsers": 1250,
    "totalVolunteers": 345,
    "totalSosAlerts": 12,
    "activeSosAlerts": 2,
    "totalSafeZones": 15,
    "totalAmbulances": 8
  }
  ```

---

### B. Update User Role
* **Method**: `PUT`
* **Route**: `/api/admin/users/{id}/role?role={ROLE}`
* **Description**: Dynamically upgrades/downgrades a user's role (`USER | DOCTOR | VOLUNTEER | ADMIN`).
* **Response (Success - 200 OK)**: Returns the updated `UserDTO` object.

---

### C. Admin SOS Override
* **Method**: `GET` / `PUT`
* **Routes**: `/api/admin/sos` OR `/api/admin/sos/{id}/status?status={status}`
* **Description**: Fetches all historical emergencies and modifies any SOS event status.

---

## 12. Public Integration Proxies (`/api/proxy`)

Encapsulates third-party APIs (OpenWeatherMap, TomTom traffic) to secure secret API keys.

* **GET `/api/proxy/weather?lat={lat}&lon={lon}`**: Returns current weather parameters directly from OpenWeatherMap. (Public)
* **GET `/api/proxy/tomtom-traffic?point={lat},{lon}`**: Fetches absolute flow segment traffic data from TomTom API. (Public)
* **GET `/api/proxy/tomtom-traffic/{z}/{x}/{y}.png`**: Renders dynamic traffic flow overlay tiles directly onto Leaflet maps. (Public)
* **GET `/api/proxy/tomtom-incidents/{z}/{x}/{y}.png`**: Renders accident, flood blocking, and traffic incident map tiles. (Public)
