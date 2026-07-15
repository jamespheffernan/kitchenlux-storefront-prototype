const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { createApp } = require('./app');

dotenv.config();

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    throw new Error(`${key} must be set before starting the API`);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters');
}

const port = Number(process.env.PORT || 5001);
const app = createApp(process.env);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`KitchenLux prototype API listening on port ${port}`);
  });
});
