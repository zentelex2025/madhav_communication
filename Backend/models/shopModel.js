import { query } from '../config/db.js';

export const shopModel = {
  async getSettings() {
    const res = await query('SELECT * FROM shop_settings LIMIT 1');
    return res.rows[0] || null;
  },

  async updateSettings(data) {
    const fields = [
      'shop_name', 'tagline', 'address', 'phone', 'whatsapp_number', 'email',
      'gstin', 'hsn_default', 'salesman_name', 'bank_name', 'account_no',
      'ifsc_code', 'upi_id', 'terms_1', 'terms_2', 'jurisdiction', 'default_gst_percent'
    ];

    const updates = [];
    const values = [];
    let idx = 1;

    for (const key of fields) {
      if (data[key] !== undefined) {
        updates.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (updates.length === 0) return await this.getSettings();

    const sql = `UPDATE shop_settings SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *`;
    const res = await query(sql, values);
    return res.rows[0];
  }
};
