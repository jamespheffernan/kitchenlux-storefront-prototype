const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const products = require('./data/products');

dotenv.config();

async function seed() {
  const required = ['MONGO_URI', 'SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);
  if (process.env.ALLOW_SEED_WRITE !== '1' || missing.length) {
    throw new Error(`Seeding requires ALLOW_SEED_WRITE=1 and explicit values for: ${required.join(', ')}`);
  }
  if (process.env.SEED_ADMIN_PASSWORD.length < 16) {
    throw new Error('SEED_ADMIN_PASSWORD must contain at least 16 characters');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
  const admin = await User.findOneAndUpdate(
    { email: process.env.SEED_ADMIN_EMAIL.toLowerCase() },
    {
      name: 'Prototype Administrator',
      email: process.env.SEED_ADMIN_EMAIL.toLowerCase(),
      password,
      isAdmin: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Product.deleteMany({});
  await Product.insertMany(products.map((product) => ({ ...product, user: admin._id })));
  console.log(`Seeded ${products.length} synthetic products`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
