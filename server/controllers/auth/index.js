const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { User, Store } = require('../../models');
const { client } = require('../../utils/redis');
const createSlug = require('../../utils/createSlug');
const generateOtp = require('../../utils/generateOtp');
const sendEmailOTP = require('../../utils/sendEmailOTP');
const randomAvatar = require('../../utils/randomAvatar');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/generateToken');

async function sendOTP(req, res) {
  const email = req.body.email;
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const otp = await generateOtp();

    await client.setEx(`otp:${email}`, 600, otp);

    await sendEmailOTP(email, otp);

    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    // send error
    return res.status(500).json({ message: error.message });
  }
}

async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const storedOtp = await client.get(`otp:${email}`);

    if (!storedOtp) return res.status(400).json({ message: 'OTP is expired' });

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    } else {
      return res.status(200).json({ message: 'OTP is verified.' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred', error: error.message });
  }
}

async function register(req, res) {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      avatar: randomAvatar(),
    });

    res.status(201).json({
      message: 'Registration Successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({ message: 'All fields are required' });

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Store, as: 'store', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Login successfully',
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  const { userId } = req.user;

  delete req.headers.authorization;

  res.clearCookie('refreshToken');

  await client.del(`user:${userId}`);

  return res.status(200).json({ message: 'Logout is success' });
}

async function authCheck(req, res) {
  const { userId } = req.user;

  try {
    const cachedUser = await client.get(`user:${userId}`);

    if (cachedUser) {
      return res.status(200).json({ payload: JSON.parse(cachedUser) });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Store, as: 'store', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    const payload = {
      userId: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      avatar: user.avatar,
      storeId: user.store?.id,
      storeName: user.store?.name,
      storeAvatar: user.store?.avatar,
    };

    await client.setEx(`user:${userId}`, 900, JSON.stringify(payload));

    res.status(200).json({ payload });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to get Authorization',
      error: error.message,
    });
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Unauthorized !!! Please Login',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    if (!decoded) {
      return res.status(401).json({
        message: 'Unauthorized !!! Session Expired',
      });
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: ['id'],
      include: [{ model: Store, as: 'store', attributes: ['id'] }],
    });

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized !!! User not found',
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, storeId: user.store?.id, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: '1d' },
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to refresh token',
      error: error.message,
    });
  }
}

async function resetPassword(req, res) {}

async function forgotPassword(req, res) {}

async function createStore(req, res) {
  const { userId } = req.user;

  const { name, description, city } = req.body;

  try {
    const slug = createSlug(name);

    if (!name || !description || !city)
      return res.status(400).json({ message: 'All fields required' });

    const existingStore = await Store.findOne({
      where: {
        [Op.or]: [{ userId }, { slug }],
      },
    });

    if (existingStore) {
      if (existingStore.userId === userId) {
        return res.status(400).json({
          message: 'You already have a store.',
        });
      }

      if (existingStore.slug === slug) {
        return res.status(400).json({
          message: 'Store name already exists.',
        });
      }
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const store = await Store.create({
      userId,
      name,
      slug,
      city,
      description,
      avatar: randomAvatar(),
    });

    await user.update({ role: 'seller' });

    // await client.setEx(`user:${userId}`, 900, JSON.stringify(payload));

    res.status(201).json({
      message: 'Store is created',
      store,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to create new store', error: error.message });
  }
}

module.exports = {
  login,
  logout,
  sendOTP,
  register,
  authCheck,
  verifyOTP,
  refreshToken,
  resetPassword,
  createStore,
  forgotPassword,
};
