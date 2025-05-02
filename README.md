# Conference Room Booking System

## Overview
A simple web-based tool for booking conference rooms, built with Cloudflare Pages (frontend), Cloudflare Workers (API/backend), and optionally Cloudflare D1 (database).

## Running Locally

### Prerequisites
- Node.js (for local development)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (for Cloudflare Workers)

### 1. Frontend (site/)
- Open `site/index.html` in your browser for a static preview.
- For local API integration, you may need to run a local server and proxy API requests to your Worker.

### 2. Backend (worker/)
- Navigate to the `worker/` directory.
- Run `wrangler dev` to start the Worker locally.

### 3. Database (Optional)
- If using Cloudflare D1, set up your database using the provided `schema.sql`.
- Update your Worker code to connect to D1 as needed.

## Deployment

### Deploy Frontend
- Push the `site/` directory to a GitHub repo and connect it to Cloudflare Pages.

### Deploy Backend
- Deploy the Worker using Wrangler:
  ```
  wrangler publish
  ```
- Ensure your API endpoints are accessible (e.g., `/api/rooms`, `/api/bookings`).

## Project Structure
- `site/` — Frontend code
- `worker/` — Backend API logic
- `schema.sql` — Database schema (for D1)
- `system.md` — Problem, solution, and system design
- `README.md` — This file 