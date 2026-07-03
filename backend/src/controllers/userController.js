const users = {};

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { role, state_id, page = 1, limit = 20 } = req.query;
      
      let usersList = Object.values(users);

      if (role) usersList = usersList.filter(u => u.role === role);
      if (state_id) usersList = usersList.filter(u => u.state_id === state_id);

      const startIndex = (page - 1) * limit;
      const paginatedUsers = usersList.slice(startIndex, startIndex + parseInt(limit));

      paginatedUsers.forEach(u => delete u.password_hash);

      res.json({
        success: true,
        data: paginatedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: usersList.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USERS_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = users[id];

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      delete user.password_hash;
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USER_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const user = users[req.user.id];

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      delete user.password_hash;
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_PROFILE_ERROR',
          message: error.message
        }
      });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, full_name, role, state_id } = req.body;

      if (!username || !email) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username and email are required'
          }
        });
      }

      const user = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        full_name,
        role: role || 'viewer',
        state_id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      users[user.id] = user;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_USER_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = users[id];

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      Object.assign(user, req.body, { updated_at: new Date() });
      users[id] = user;

      delete user.password_hash;
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_USER_ERROR',
          message: error.message
        }
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      if (!users[id]) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      delete users[id];

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_USER_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = UserController;
