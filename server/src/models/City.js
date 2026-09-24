import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const lineSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    color: String,
    fare: [Number], // slab fares by distance bracket, cheapest to most expensive
    freq: String,
    firstLast: String,
    stations: [stationSchema],
  },
  { _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    name: String,
    lat: Number,
    lng: Number,
    category: String,
  },
  { _id: false }
);

const citySchema = new mongoose.Schema(
  {
    cityId: { type: String, required: true, unique: true }, // e.g. 'lucknow'
    name: { type: String, required: true },
    center: { lat: Number, lng: Number },
    zoom: { type: Number, default: 12 },
    busFarePerKm: { type: Number, default: 2 }, // simple bus fare model, tune per city
    lines: [lineSchema],
    places: [placeSchema],
  },
  { timestamps: true }
);

export default mongoose.model('City', citySchema);
