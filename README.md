# KitchenLux Storefront Prototype

An archived full-stack product prototype for browsing, booking, and managing kitchenware rentals for vacation stays.

This repository is a cleaned technical snapshot of an earlier KitchenLux storefront. It is not the current KitchenLux website, a production service, or evidence that the example inventory, team, customer stories, prices, or fulfilment model went live.

## What it demonstrates

- React storefront with catalog, cart, booking, account, host, referral, and administration flows
- Express and MongoDB API with JWT authentication and role-based routes
- Custom kit builder with reusable templates and pricing rules
- Stripe-oriented checkout and order models
- Responsive product and operations interfaces

## Safety boundary

The private source repository contained deployment artifacts, downloaded third-party images, stale production claims, fictional testimonials, and automatic production seeding with a fixed administrator password. They are not part of this public snapshot.

This version:

- never creates a default administrator at server startup;
- requires explicit environment values before the optional seed command writes data;
- generates local SVG product placeholders instead of bundling downloaded photographs;
- contains no real customer, order, payment, database, or credential data;
- defaults to local development URLs and does not deploy anywhere automatically.

## Requirements

- Node.js 22 or newer
- MongoDB running locally or an explicitly supplied test database

## Setup

Install each workspace:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create local environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set a strong `JWT_SECRET` and review every value before starting the application.

To load the synthetic product catalog into a disposable database, provide explicit seed credentials and acknowledge the write:

```bash
ALLOW_SEED_WRITE=1 \
SEED_ADMIN_EMAIL=admin@example.test \
SEED_ADMIN_PASSWORD='replace-with-a-long-random-value' \
npm run data:import
```

Then run the API and frontend in separate terminals:

```bash
npm run server
npm run client
```

## Verification

```bash
npm test
npm run build
npm run audit
```

## Repository origin

The original KitchenLux repository remains private because its full history includes business and deployment context that is not part of this reusable prototype. This public repository starts with a reviewed source-only snapshot.

## License

MIT. See [LICENSE](LICENSE).
