Feature Flag Engine

Production-Grade, Deterministic Feature Management System

Executive Summary:-

This project implements a production-ready Feature Flag Engine designed for scalable backend systems. It provides deterministic runtime feature evaluation with multi-level overrides, percentage rollout support, Redis-backed caching, and PostgreSQL persistence.

The system is architected using clean separation of concerns and is built to meet core feature management requirements while demonstrating production-grade engineering practices.


Clone Repository:-"
git clone "https://github.com/sanmittal/Flag-System.git"
cd feature-flag-engine

2. Install Dependencies:- 

npm install

3. Create Environment File

Create a .env file in the project root:

DATABASE_URL="postgresql://postgres:password@localhost:5432/feature_flags"
REDIS_URL="redis://localhost:6379"

Initialize Database:-

npx prisma generate
npx prisma migrate dev --name init

6. Start Application

npm run dev

Server will start at:- http://localhost:3000

Production Build:-

npm run build
npm start

Need DB postgresql and redis in local system and update postgresql url in .env file

Key Capabilities :-

Feature flag definition with global default state

User-level overrides

Group-level overrides

Region-level overrides

Deterministic percentage rollout

Strict evaluation precedence

Redis-based distributed caching

PostgreSQL-backed persistence

Input validation using schema-based validation

Clean layered architecture


System Architecture:-

Client
  ↓
Express Router
  ↓
Service Layer (Business Logic)
  ↓
Repository Layer
  ↓
PostgreSQL Database
  ↓
Redis Cache (Evaluation Optimization)



API Reference :-

Base URL:

http://localhost:3000/features

Feature Management

POST /features

GET /features

GET /features/:key

DELETE /features/:key

Global Configuration

PATCH /features/:key/global

PATCH /features/:key/rollout

Evaluation

POST /features/:key/evaluate

User Overrides

POST /features/:key/user-override

DELETE /features/:key/user-override/:userId

Group Overrides

POST /features/:key/group-override

DELETE /features/:key/group-override/:groupId

Region Overrides

POST /features/:key/region-override

DELETE /features/:key/region-override/:region

Sample Example Request

Request

POST /features/new_dashboard/evaluate

{
  "userId": "user123",
  "groupId": "beta",
  "region": "IN"
}


Response

{
  "key": "new_dashboard",
  "enabled": true,
  "source": "GROUP_OVERRIDE"
}
