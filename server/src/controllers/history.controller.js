import SavedSearch from '../models/SavedSearch.js';

// Replaces saveRecent()/renderRecent() — now tied to the logged-in user in
// MongoDB instead of the browser's localStorage, so it survives across devices.

export async function listHistory(req, res, next) {
  try {
    const items = await SavedSearch.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(20);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function addHistory(req, res, next) {
  try {
    const { cityId, from, to, durationMin } = req.body;
    if (!cityId || !from || !to) {
      return res.status(400).json({ message: 'cityId, from and to are required' });
    }
    const item = await SavedSearch.create({
      user: req.user._id,
      cityId,
      from,
      to,
      durationMin,
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function deleteHistory(req, res, next) {
  try {
    await SavedSearch.deleteOne({ _id: req.params.id, user: req.user._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
