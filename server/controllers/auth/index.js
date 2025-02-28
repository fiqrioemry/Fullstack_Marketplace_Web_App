const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const passport = require('passport');
const { redis } = require('../../config/redis');
const { User, Store } = require('../../models');
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

    await redis.setex(`otp:${email}`, 600, otp);

    await sendEmailOTP(email, otp);

    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const storedOtp = await redis.get(`otp:${email}`);

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
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const userData = await User.findOne({
      where: { email },
      include: [
        { model: Store, as: 'store', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    if (!userData) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // for google signin that set password as null
    if (!userData.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = generateAccessToken(userData);

    const refreshToken = generateRefreshToken(userData);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const user = {
      userId: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      role: userData.role,
      avatar: userData.avatar,
      storeId: userData.store?.id,
      storeName: userData.store?.name,
      storeAvatar: userData.store?.avatar,
    };

    return res.status(200).json({
      message: 'Login successfully',
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  const userId = req.user.userId;

  delete req.headers.authorization;

  res.clearCookie('refreshToken');

  await redis.del(`user:${userId}`);

  return res.status(200).json({ message: 'Logout successfully' });
}

async function authCheck(req, res) {
  const userId = req.user.userId;

  try {
    const cachedUser = await redis.get(`user:${userId}`);

    if (cachedUser) {
      return res.status(200).json({ user: JSON.parse(cachedUser) });
    }

    const userData = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Store, as: 'store', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    const user = {
      userId: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      role: userData.role,
      avatar: userData.avatar,
      storeId: userData.store?.id,
      storeName: userData.store?.name,
      storeAvatar: userData.store?.avatar,
    };

    await redis.setex(`user:${userId}`, 900, JSON.stringify(user));

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Unauthorized !!! Please Login ',
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

    const accessToken = generateAccessToken(user);

    res.status(200).json(accessToken);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createStore(req, res) {
  const userId = req.user.userId;
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

    await redis.setex(`user:${userId}`, 900, JSON.stringify(payload));

    res.status(201).json({
      message: 'Store Created Successfully',
      store,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function googleAuth(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next,
  );
}

async function googleAuthCallback(req, res) {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    try {
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.CLIENT_URL}/signin`);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })(req, res);
}

module.exports = {
  login,
  logout,
  sendOTP,
  register,
  authCheck,
  verifyOTP,
  refreshToken,
  createStore,
  googleAuthCallback,
  googleAuth,
};
