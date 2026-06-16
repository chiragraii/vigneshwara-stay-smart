import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export class UserModel {
  /**
   * Create a new user with hashed password
   */
  static async create(userData: CreateUserData): Promise<User> {
    const { full_name, email, phone, password } = userData;

    // Hash password with bcrypt
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (full_name, email, phone, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, phone, email_verified, created_at, updated_at;
    `;

    const result = await pool.query(query, [full_name, email, phone, password_hash]);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT id, full_name, email, phone, email_verified, created_at, updated_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Verify password against stored hash
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user email verification status
   */
  static async verifyEmail(userId: number): Promise<void> {
    const query = 'UPDATE users SET email_verified = true WHERE id = $1';
    await pool.query(query, [userId]);
  }

  /**
   * Check if email already exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
