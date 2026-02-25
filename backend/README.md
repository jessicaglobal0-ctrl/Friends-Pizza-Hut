# Friends Pizza Hut Backend

This backend will use Node.js with NestJS for a scalable, secure REST API.

## Features
- Role-based authentication (User, Admin, Rider)
- Secure JWT auth, Firebase Auth integration
- RESTful endpoints for all entities
- Real-time updates (WebSockets, FCM)
- Payment integration (JazzCash, Easypaisa, Card)
- PostgreSQL database

## Setup
1. Install Node.js and npm
2. Run `npm install` in this directory
3. Configure environment variables in `.env`
4. Run `npm run start:dev` to start the server

## Folder Structure
- src/
  - modules/
  - controllers/
  - services/
  - entities/
  - middlewares/
  - utils/
- test/
- .env
- package.json
- tsconfig.json

---

See docs/ for API documentation and database schema.
