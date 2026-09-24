import User from '../models/User.js';

// Replaces the account-panel edits from openEP()/togPref()/pickAvatar()
export async function updateMe(req, res, next) {
  try {
    const { name, avatar, preferences } = req.body;
    const update = {};
    if (name) update.name = name;
    if (avatar) update.avatar = avatar;
    if (preferences) update.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
