const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate token and set HTTP-only cookie
      const token = generateToken(user._id, res);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isHost: user.isHost || false,
        token, // Still include token in response for backward compatibility
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    if (user) {
      // Generate token and set HTTP-only cookie
      const token = generateToken(user._id, res);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isHost: user.isHost || false,
        token, // Still include token in response for backward compatibility
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('rentalHistory');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isHost: user.isHost || false,
        phone: user.phone,
        address: user.address,
        rentalHistory: user.rentalHistory,
        hostInfo: user.hostInfo,
        referralEarnings: user.referralEarnings,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.phone) user.phone = req.body.phone;
      if (req.body.address) user.address = req.body.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // Generate token and set HTTP-only cookie
      const token = generateToken(updatedUser._id, res);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isHost: updatedUser.isHost || false,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token, // Still include token in response for backward compatibility
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

      if (req.body.phone) user.phone = req.body.phone;
      if (req.body.address) user.address = req.body.address;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        phone: updatedUser.phone,
        address: updatedUser.address,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Make user a host
// @route   PUT /api/users/profile/become-host
// @access  Private
const becomeHost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update user to be a host
      user.isHost = true;

      // Initialize hostInfo if not already present
      if (!user.hostInfo) {
        user.hostInfo = {
          propertyListings: [],
          paymentDetails: {
            preferredMethod: 'creditToAccount',
          },
          verificationStatus: 'unverified',
          verificationDocuments: [],
        };
      }

      // Initialize referralEarnings if not already present
      if (!user.referralEarnings) {
        user.referralEarnings = {
          totalEarned: 0,
          pendingPayout: 0,
          totalPaidOut: 0,
          transactions: [],
        };
      }

      const updatedUser = await user.save();

      // Generate token and set HTTP-only cookie
      const token = generateToken(updatedUser._id, res);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isHost: updatedUser.isHost,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  becomeHost,
};