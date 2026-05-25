# 🚨 ResQNet — Disaster Management & Civic Support Network

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Java Version](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.org/)
[![Spring Boot Version](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular Version](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.dev/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

ResQNet is an enterprise-grade, real-time crisis management and community response platform designed to organize rescue logistics, safe shelter routing, missing person lookups, civic infrastructure alerts, and AI-driven first-aid guidelines during natural disasters (floods, cyclones, earthquakes, and fires).

---

## 📖 Navigation Matrix

For comprehensive, step-by-step developer guidelines, operational playbooks, and design blueprints, refer to our specialized sub-documents:

* 📐 **[System Architecture Guide]** — Architectural layout, real-time WebSockets pub-sub flows, and the Haversine routing formula implementation.
* 🌐 **[REST API Reference Guide]** — Comprehensive spec of all REST endpoints, JSON request/response formats, headers, and validation errors.
* 🗄️ **[PostgreSQL Database Schema]** — 10-table relational schema descriptions, keys, indexes, and Mermaid ERD.
* 🔐 **[Security & Error Handling]** — Spring Security filter chain configs, stateless JWT details, RBAC matrices, and global error interceptors.
* 🚢 **[Deployment & Operations Guide]** — Environment variables.

---

## 🌟 Core Business Value & Features

Under critical situations, coordination delay costs lives. ResQNet bridges the gap between stranded civilians, rescue fleets, volunteers, and clinical assets:

* **🆘 Panic Button (SOS Trigger)**: Stranded civilians trigger a single-click SOS. The system instantly captures GPS coordinates, logs it in PostgreSQL, broadcasts it over WebSockets to rescue nodes, and immediately returns the closest available ambulance and safe shelter using great-circle distance math.
* **🗺️ Real-time Live Crisis Map**: Features interactive Leaflet GIS overlays containing weather warnings (OpenWeatherMap API) and current blockages or traffic flows (TomTom API) mapped in real-time.
* **🤖 ResQBot (AI Emergency Assistant)**: A stateless, context-aware chatbot supporting dynamic integrations with Google Gemini, Anthropic Claude, and OpenAI GPT models. Provides first-aid guidelines and emergency procedures in both English and Bangla.
* **🏢 Safe Shelter Directory**: Tracks evacuation capacities, safe zones (Shelters, Schools, Hospitals, Mosques), and active headcounts, preventing overcrowding.
* **🚑 Intelligent Ambulance Logistics**: Monitors fleet availability (`AVAILABLE`, `ON_DUTY`, `MAINTENANCE`) and driver contact parameters with real-time GPS updating.
* **🩸 Volunteer Blood Bank**: Connects critical patients directly to active, local donors indexed by area and blood group.
* **🏙️ Civic Infrastructure Reporting**: Empowers citizens to log structural damage, floods, downed lines, or fires to inform city engineers and rescue networks.
* **🔍 Missing Persons Registry**: Provides central lookups to log, search, and resolve missing persons files.

---

## 🛠️ The Tech Stack

### Backend
* **Language & Runtime**: Java 25 (utilizing modern Virtual Threads and high-performance JVM operations)
* **Framework Core**: Spring Boot 4.0.6 (Stateless MVC, WebFlux clients)
* **Real-time Engine**: Spring Boot WebSocket Broker (STOMP over SockJS)
* **Persistence Layer**: Spring Data JPA with Hibernate ORM
* **Build Automation**: Apache Maven (wrapper bundled)

### Frontend
* **Core Framework**: Angular 21 (with standalone component design, reactive forms, signals, and lazy-loaded routes)
* **GIS Mapping Layer**: Leaflet Maps (with dynamic traffic flow segment overlays and incident tile layers)
* **Notifications**: ngx-toastr
* **Real-time WebSocket client**: `@stomp/stompjs` + `sockjs-client`
* **Test Engine**: Vitest runner + JSDom (optimized high-speed unit tests)

### Database & Operations
* **Relational Database**: PostgreSQL (optimized index schemas)
---

## 🚀 2-Step Local Quick Start

Get the entire development environment running locally in under 5 minutes:

### Step 1: Fire up the Backend API
Make sure you have JDK 25 and PostgreSQL running on your host system.
```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE resqnet_db;"

# 2. Build and run Spring Boot
cd resqnet-backend
./mvnw spring-boot:run
```
* Tomcat will boot and expose APIs on `http://localhost:8080/api`.

### Step 2: Fire up the Angular SPA
Make sure Node.js v20+ is installed on your host system.
```bash
# 1. Install dependencies
cd resqnet-frontend
npm install

# 2. Start the dev server
npm run start
```
* Open your browser and navigate to `http://localhost:4200/`.

---

## 🛡️ License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it in both commercial and open-source applications.

---

## 👥 Contributors

This platform was built by **PU DeltaForce** to support crisis management and rescue systems. Contributions from the open-source community are highly welcome! 