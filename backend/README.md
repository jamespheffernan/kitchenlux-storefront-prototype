# KitchenLux Prototype API

Express and MongoDB API for the KitchenLux storefront prototype.

Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, and use a disposable MongoDB database. The server does not seed data automatically. The optional seeder refuses to run unless all seed credentials and `ALLOW_SEED_WRITE=1` are supplied.

```bash
npm install
npm test
npm start
```

The image routes return generated SVG placeholders, so no downloaded or customer-supplied media is required.
