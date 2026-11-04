import { query } from '../config/db.js';

export const userModel = {
  async findByEmail(email) {
    const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return res.rows[0] || null;
  },

  async findById(id) {
    const res = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async updatePassword(id, newHash) {
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, id]);
  }
};
