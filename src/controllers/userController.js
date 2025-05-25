import userService from '../services/userService.js'

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

async function getUsers(req, res) {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      role: req.query.role,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
    };

    const result = await userService.getAllUsers(options);
    
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

async function login(req, res) {
  try {
    const result = await userService.authenticateUser(req.body.email, req.body.password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
}

async function getProfile(req, res) {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getProfile
};

export default userController;
