import { query } from '../config/db.js';

export const cartModel = {
  async getOrCreateCart(sessionId) {
    let res = await query('SELECT * FROM carts WHERE session_id = $1', [sessionId]);
    if (res.rows.length === 0) {
      res = await query('INSERT INTO carts (session_id) VALUES ($1) RETURNING *', [sessionId]);
    }
    const cart = res.rows[0];

    const itemsRes = await query(`
      SELECT 
        ci.*,
        p.brand,
        p.model,
        p.variant,
        p.color,
        p.hsn_code,
        p.selling_price as original_price,
        p.stock_quantity,
        pu.imei_1,
        pu.imei_2,
        pu.status as unit_status,
        (
          SELECT pi.image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id AND pi.is_primary = true 
          LIMIT 1
        ) as primary_image
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      LEFT JOIN product_units pu ON pu.id = ci.unit_id
      WHERE ci.cart_id = $1
      ORDER BY ci.id ASC
    `, [cart.id]);

    return {
      ...cart,
      items: itemsRes.rows,
    };
  },

  async addItem(sessionId, { productId, unitId = null, quantity = 1, rate, discount = 0 }) {
    const cart = await this.getOrCreateCart(sessionId);

    // If unitId is provided, verify it is available
    if (unitId) {
      const unitCheck = await query('SELECT status FROM product_units WHERE id = $1', [unitId]);
      if (unitCheck.rows.length === 0 || unitCheck.rows[0].status !== 'available') {
        throw new Error('Selected phone unit/IMEI is already sold or unavailable.');
      }
    }

    // Check if product already in cart
    const existing = await query(
      'SELECT id, quantity, discount FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND (unit_id = $3 OR ($3 IS NULL AND unit_id IS NULL))',
      [cart.id, productId, unitId]
    );

    if (existing.rows.length > 0 && !unitId) {
      // Increment quantity for non-serialized items
      await query(
        'UPDATE cart_items SET quantity = quantity + $1, discount = $2 WHERE id = $3',
        [quantity, discount, existing.rows[0].id]
      );
    } else {
      await query(
        'INSERT INTO cart_items (cart_id, product_id, unit_id, quantity, rate, discount) VALUES ($1, $2, $3, $4, $5, $6)',
        [cart.id, productId, unitId, quantity, rate, discount]
      );
    }

    return await this.getOrCreateCart(sessionId);
  },

  async updateItem(itemId, { quantity, discount, unitId }) {
    const updates = [];
    const values = [];
    let idx = 1;

    if (quantity !== undefined) {
      updates.push(`quantity = $${idx}`);
      values.push(Math.max(1, Number(quantity)));
      idx++;
    }

    if (discount !== undefined) {
      updates.push(`discount = $${idx}`);
      values.push(Math.max(0, Number(discount)));
      idx++;
    }

    if (unitId !== undefined) {
      updates.push(`unit_id = $${idx}`);
      values.push(unitId || null);
      idx++;
    }

    if (updates.length > 0) {
      values.push(itemId);
      await query(`UPDATE cart_items SET ${updates.join(', ')} WHERE id = $${idx}`, values);
    }

    return { success: true };
  },

  async removeItem(itemId) {
    await query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    return { success: true };
  },

  async clearCart(sessionId) {
    const cart = await query('SELECT id FROM carts WHERE session_id = $1', [sessionId]);
    if (cart.rows.length > 0) {
      await query('DELETE FROM cart_items WHERE cart_id = $1', [cart.rows[0].id]);
    }
    return { success: true };
  }
};
