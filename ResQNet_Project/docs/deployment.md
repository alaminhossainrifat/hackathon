# ResQNet Deployment & Operations Guide

This document serves as the guide for installing, building, running, and deploying **ResQNet** in both local development environments and multi-container production clouds.

---

## 1. Environment Variables Catalog

The following variables manage critical system settings. In production, these should be supplied via container environments or secure secrets vaults (e.g., Vault, AWS Secrets Manager).

> [!WARNING]
> Never hardcode or check production credentials into source control repositories.

| Variable | Description | Default / Example Value | Required | Security Level |
|:---|:---|:---|:---|:---|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile. | `dev` \| `prod` | No (Defaults to `default`) | Low |
| `SERVER_PORT` | Port exposed by backend API. | `8080` | No (Defaults to `8080`) | Low |
| `SPRING_DATASOURCE_URL` | JDBC URL for PostgreSQL. | `jdbc:postgresql://postgres-db:5432/resqnet_db` | Yes (in Production) | Medium |
| `SPRING_DATASOURCE_USERNAME`| Database username. | `postgres` | Yes (in Production) | Medium |
| `SPRING_DATASOURCE_PASSWORD`| Database user password. | `YourSecurePasswordHere` | Yes (in Production) | High (Secret) |
| `JWT_SECRET` | Signing key for HMAC-SHA256. | `YourMinimum32CharSecureSecretStringHere` | Yes (in Production) | High (Secret) |
| `JWT_EXPIRATION` | Token validity duration (ms). | `86400000` (24 hours) | No (Defaults to 24h) | Low |
| `API_WEATHER_KEY` | OpenWeatherMap API Key. | `6ff405342a39d5...` (Masked in Prod) | Yes (for weather maps) | High (Secret) |
| `API_TOMTOM_KEY` | TomTom Traffic Overlay Key. | `EaFLLtCW0g6LQn...` (Masked in Prod) | Yes (for traffic maps) | High (Secret) |

---

## 2. Local Setup & Installation

### A. Prerequisites Setup
Before installing the application, ensure the following tools are installed on your host system:
* **Java Development Kit (JDK)**: Version 25 (Required for compilation)
* **Node.js**: Version 20.x or 22.x LTS (with `npm` package manager)
* **Angular CLI**: Version 21.x (`npm install -g @angular/cli@latest`)
* **PostgreSQL Database**: Version 15+

---

### B. Backend Local Installation & Run
1. **Initialize Database**:
   Open your PostgreSQL terminal (`psql` or pgAdmin) and spin up the database schema:
   ```sql
   CREATE DATABASE resqnet_db;
   ```
2. **Configure properties**:
   Edit `resqnet-backend/src/main/resources/application.properties` to map your local database credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/resqnet_db
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_LOCAL_PASSWORD
   ```
3. **Compile and Run**:
   Use the Maven wrapper inside the `resqnet-backend` directory to clean, test, compile, and launch the application:
   ```bash
   # On Windows (PowerShell)
   .\mvnw.cmd spring-boot:run

   # On Linux / macOS
   ./mvnw spring-boot:run
   ```
   * The backend will spin up Tomcat on port `8080`. Confirm via the log line:
     `Tomcat started on port(s): 8080 (http) with context path '/api'`

---

### C. Frontend Local Installation & Run
1. **Install dependencies**:
   Navigate to the `resqnet-frontend` folder and run `npm install`:
   ```bash
   cd resqnet-frontend
   npm install
   ```
2. **Configure Local Environment**:
   Verify that your development settings point to local ports in `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws',
     proxyUrl: 'http://localhost:8080/api/proxy'
   };
   ```
3. **Run Dev Server**:
   Start the local dev server using the Angular CLI:
   ```bash
   npm run start
   ```
   * The client boots on `http://localhost:4200/`. Open it in your web browser.

---