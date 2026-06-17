import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6)
      return res.status(400).json({ msg: 'Invalid input' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
    user = new User({ email, password: hash });
    await user.save();

    res.json({ msg: 'Registered' });
  } catch (e) {
    res.status(500).json({ msg: 'Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'SECRET', { expiresIn: '7d' });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ msg: 'Error' });
  }
};
