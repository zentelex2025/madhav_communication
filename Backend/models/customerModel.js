import { query } from '../config/db.js';

export const customerModel = {
  async search(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return [];
    const term = `%${searchTerm.trim()}%`;
    const res = await query(
      `SELECT * FROM customers WHERE name ILIKE $1 OR phone ILIKE $1 LIMIT 10`,
      [term]
    );
    return res.rows;
  },

  async getOrCreate({ name, phone, address = '', email = '', gstin = '' }) {
    if (!name || !phone) {
      throw new Error('Customer name and phone number are required.');
    }

    // Check if customer with this phone exists
    const existing = await query('SELECT * FROM customers WHERE phone = $1 LIMIT 1', [phone.trim()]);
    if (existing.rows.length > 0) {
      // Update name/address if changed
      const updated = await query(
        `UPDATE customers SET name = $1, address = COALESCE(NULLIF($2, ''), address), email = COALESCE(NULLIF($3, ''), email), gstin = COALESCE(NULLIF($4, ''), gstin) WHERE id = $5 RETURNING *`,
        [name.trim(), address.trim(), email.trim(), gstin.trim(), existing.rows[0].id]
      );
      return updated.rows[0];
    }

    const res = await query(
      `INSERT INTO customers (name, phone, address, email, gstin) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim(), phone.trim(), address.trim(), email.trim(), gstin.trim()]
    );
    return res.rows[0];
  }
};
