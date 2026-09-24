import City from '../models/City.js';

export async function listCities(req, res, next) {
  try {
    const cities = await City.find({}, 'cityId name center zoom').sort('name');
    res.json({ cities });
  } catch (err) {
    next(err);
  }
}

export async function getCity(req, res, next) {
  try {
    const city = await City.findOne({ cityId: req.params.cityId });
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json({ city });
  } catch (err) {
    next(err);
  }
}
