# Payment Link Platform - Frontend

## 1. Project Overview

This frontend application serves as the client-facing interface for a Payment Link Platform that enables merchants to create products, generate shareable payment links, and manage payment transactions.

Built with Next.js, the application provides:

- **Secure merchant authentication flow** - Signup, login, and protected dashboard access with role-based authorization
- **Merchant dashboard** - Comprehensive interface for managing products and payment links
- **Public payment pages** - Accessible via shareable links for customers to complete payments
- **Responsive user experience** - Mobile-friendly design optimized for both merchants and customers
- **Real-time payment feedback** - Live status updates during payment processing (pending, success, failure states)

The application communicates with a NestJS backend via REST APIs, treating the backend as the single source of truth for payment status, product availability, and transaction records. This architecture ensures data consistency and reliability across the platform.

## 2. Tech Stack Used

### Framework
- **Next.js 16.1.1**
  - Modern, production-ready React framework with App Router
  - Enables file-based routing, server-side rendering (SSR), and optimized performance
  - Provides clean structure for separating public pages (payment links) from protected merchant routes (dashboard)
  - Supports standalone output mode for Docker containerization

### State Management & Data Fetching
- **React Query (TanStack Query)**
  - Server-state management and API communication
  - Handles data fetching, caching, and synchronization
  - Manages loading and error states automatically
  - Ensures UI stays in sync with backend data without manual state handling

- **Zustand**
  - Lightweight client-side state management solution
  - Handles payment state on payment pages (waiting, success states)
  - Chosen for its simplicity and minimal boilerplate compared to heavier state solutions

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Modern icon library for consistent iconography

### HTTP Client
- **Axios** - Promise-based HTTP client for API requests with interceptors for authentication and error handling


## 3. How to Run the Project Locally

### Prerequisites
- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager
- Docker 
- Access to the backend API (running on port 4000 by default)

### Clone the Repository

```bash
git clone <repository-url>
cd payment-link-frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

#### For Local Development (Without Docker)

When running the project locally without Docker, you only need:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

This variable is used for client-side API calls and is accessible in the browser.

#### For Docker Container

When running the project in a Docker container, you need both environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
INTERNAL_API_URL=http://host.docker.internal:4000
```

**Explanation:**
- `NEXT_PUBLIC_BACKEND_URL` - Used for client-side API calls from the browser
- `INTERNAL_API_URL` - Used for server-side API calls  when running inside Docker. The `host.docker.internal` hostname allows the container to access services running on the host machine.

### Running with Docker

The project is configured for Docker deployment with a multi-stage build process:

1. **Create a .env file with the following env variables:**
   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   INTERNAL_API_URL=http://host.docker.internal:4000
   ```


2. **Build the Docker image:**
   ```bash
   docker build -t payment-link-frontend .
   ```

3. **Run the container:**
   ```bash
     docker run -p 3000:3000 payment-link-frontend
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** Ensure your backend API is running and accessible from the Docker container.`.

### Running Without Docker

1. **Set up environment variables:**
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 4. Assumptions Made

During development, several architectural decisions were made based on project requirements and constraints:

- **Custom Server-Side Authentication** - Implemented custom server-side authentication checks (`requireAuth()`, `requireRole()`) instead of using Next.js middleware/proxy. This approach only runs authentication checks on page reloads and route navigation, rather than on every request (including static assets and API routes), improving performance and reducing unnecessary backend calls.

- **Payment Status Polling** - Implemented polling mechanism (every 10 seconds) for payment status checks since the backend doesn't provide webhook support. This ensures users receive real-time payment confirmation without requiring backend webhook infrastructure.

- **Route Groups Architecture** - Created two route groups to organize the application structure:
  - `(admin)` - Contains admin-only pages with a root layout that enforces `ADMIN` role requirement
  - `(site)` - Contains general pages and merchant pages, with nested layouts for protected routes (products, profile, settings) that require authentication

- **Server-Side Layout Protection** - Authentication and authorization checks are performed at the layout level rather than individual pages, ensuring consistent protection across route groups and reducing code duplication.

- **Standalone Output Mode** - Configured Next.js to use standalone output mode for optimized Docker containerization, reducing image size and improving deployment efficiency.

- **Cookie-Based Authentication** - Uses HTTP-only cookies for storing authentication tokens, providing better security than localStorage for sensitive data.

- **Client-Side State for Payment Flow** - Uses Zustand store to manage payment state during the payment flow (waiting → success), allowing state persistence across page navigations.

## 5. Limitations & Possible Improvements

### Current Limitations

- **Polling Overhead** - Payment status checks use polling every 10 seconds, which increases network usage and backend load. This could be optimized with webhook support or Server-Sent Events (SSE) for real-time updates.

- **No Middleware Usage** - Custom authentication checks are implemented in layouts rather than using Next.js middleware. While this provides more control, it could be optimized with middleware for request-level authentication checks.

### Possible Improvements

- **Webhook Integration** - Replace polling mechanism with webhook support from the backend to receive real-time payment status updates, reducing network traffic and improving user experience.

- **Next.js Middleware for Authentication** - Implement Next.js middleware to handle authentication checks at the request level. This could be used for:
  - Rate limiting and security headers
  - Request logging and monitoring

- **Server-Sent Events (SSE)** - Implement SSE as an alternative to polling for real-time payment status updates, providing a more efficient one-way communication channel from server to client.

- **Error Boundary Implementation** - Add React Error Boundaries to gracefully handle and display errors, improving user experience during unexpected failures.

- **Caching Strategy** - Implement more sophisticated caching strategies for product listings and payment stats to reduce API calls and improve performance.

- **Internationalization (i18n)** - Add support for multiple languages and currencies to expand the platform's reach.

- **Progressive Web App (PWA)** - Convert the application to a PWA to enable offline functionality and mobile app-like experience.

- **Analytics & Monitoring** - Integrate analytics and error monitoring tools (e.g., Sentry, Google Analytics) for better observability and debugging.

- **Testing** - Add comprehensive test coverage (unit tests, integration tests, E2E tests) to ensure code quality and prevent regressions.

- **API Response Caching** - Implement client-side caching for frequently accessed data (products, user profile) to reduce redundant API calls.

- **Request Debouncing** - Add debouncing for search queries and form inputs to reduce unnecessary API calls during user input.
