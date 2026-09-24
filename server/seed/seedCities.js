import 'dotenv/config';
import mongoose from 'mongoose';
import City from '../src/models/City.js';
import { cities } from './cityData.js';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding cities...');

  for (const city of cities) {
    await City.findOneAndUpdate({ cityId: city.cityId }, city, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    console.log(`Upserted city: ${city.name}`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
