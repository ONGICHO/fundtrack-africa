const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = {};

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, full_name } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username, email, and password are required'
          }
        });
      }

      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

      const user = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        password_hash: hashedPassword,
        full_name,
        role: 'viewer',
        is_active: true,
        created_at: new Date()
      };

      users[user.id] = user;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user_id: user.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message
        }
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username and password are required'
          }
        });
      }

      const user = Object.values(users).find(u => u.username === username);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          }
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          }
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: error.message
        }
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const user = req.user;

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      res.json({
        success: true,
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_ERROR',
          message: error.message
        }
      });
    }
  }

  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = AuthController;
