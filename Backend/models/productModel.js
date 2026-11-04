import { query } from '../config/db.js';

export const productModel = {
  async getAll({ search, brand, condition, minPrice, maxPrice, ram, storage, isPublic = false, limit = 50, offset = 0 } = {}) {
    const conditions = [];
    const params = [];
    let idx = 1;

    if (isPublic) {
      conditions.push(`p.is_visible = true`);
    }

    if (search && search.trim()) {
      conditions.push(`(p.brand ILIKE $${idx} OR p.model ILIKE $${idx} OR p.variant ILIKE $${idx} OR p.color ILIKE $${idx})`);
      params.push(`%${search.trim()}%`);
      idx++;
    }

    if (brand && brand !== 'All') {
      conditions.push(`p.brand ILIKE $${idx}`);
      params.push(brand);
      idx++;
    }

    if (condition && condition !== 'All') {
      conditions.push(`p.condition = $${idx}`);
      params.push(condition);
      idx++;
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      conditions.push(`p.selling_price >= $${idx}`);
      params.push(Number(minPrice));
      idx++;
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      conditions.push(`p.selling_price <= $${idx}`);
      params.push(Number(maxPrice));
      idx++;
    }

    if (ram && ram !== 'All') {
      conditions.push(`(p.variant ILIKE $${idx} OR (p.specs->>'ram') ILIKE $${idx})`);
      params.push(`%${ram}%`);
      idx++;
    }

    if (storage && storage !== 'All') {
      conditions.push(`(p.variant ILIKE $${idx} OR (p.specs->>'storage') ILIKE $${idx})`);
      params.push(`%${storage}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        p.*,
        (
          SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary))
          FROM product_images pi
          WHERE pi.product_id = p.id
        ) as images,
        (
          SELECT COUNT(*)::int
          FROM product_units pu
          WHERE pu.product_id = p.id AND pu.status = 'available'
        ) as available_units_count
      FROM products p
      ${whereClause}
      ORDER BY p.id ASC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    params.push(limit, offset);
    const res = await query(sql, params);
    return res.rows;
  },

  async getById(id) {
    const sql = `
      SELECT 
        p.*,
        (
          SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary))
          FROM product_images pi
          WHERE pi.product_id = p.id
        ) as images,
        (
          SELECT json_agg(json_build_object('id', pu.id, 'imei_1', pu.imei_1, 'imei_2', pu.imei_2, 'serial_no', pu.serial_no, 'status', pu.status))
          FROM product_units pu
          WHERE pu.product_id = p.id
        ) as units
      FROM products p
      WHERE p.id = $1
    `;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  },

  async create(data) {
    const {
      brand, model, variant, color, condition = 'New', hsn_code = '85171300',
      purchase_price = 0, selling_price, stock_quantity = 0, warranty_period = '1 Year Brand Warranty',
      description = '', specs = {}, is_visible = true, images = [], imeis = []
    } = data;

    const countUnits = imeis && imeis.length > 0 ? imeis.length : Number(stock_quantity);

    const insertSql = `
      INSERT INTO products (
        brand, model, variant, color, condition, hsn_code,
        purchase_price, selling_price, stock_quantity, warranty_period,
        description, specs, is_visible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const res = await query(insertSql, [
      brand, model, variant, color, condition, hsn_code,
      purchase_price, selling_price, countUnits, warranty_period,
      description, JSON.stringify(specs), is_visible
    ]);

    const product = res.rows[0];

    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const url = typeof img === 'string' ? img : img.image_url;
        const isPrimary = i === 0;
        await query(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)',
          [product.id, url, isPrimary]
        );
      }
    } else {
      // Default placeholder mobile image
      await query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)',
        [product.id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', true]
      );
    }

    // Insert IMEIs / Units
    if (imeis && imeis.length > 0) {
      for (const item of imeis) {
        const imei1 = typeof item === 'string' ? item : item.imei_1;
        const imei2 = item.imei_2 || null;
        const serialNo = item.serial_no || null;
        if (imei1 && imei1.trim()) {
          await query(
            'INSERT INTO product_units (product_id, imei_1, imei_2, serial_no, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (imei_1) DO NOTHING',
            [product.id, imei1.trim(), imei2, serialNo, 'available']
          );
        }
      }
    }

    return await this.getById(product.id);
  },

  async update(id, data) {
    const {
      brand, model, variant, color, condition, hsn_code,
      purchase_price, selling_price, warranty_period,
      description, specs, is_visible, images
    } = data;

    const updates = [];
    const values = [];
    let idx = 1;

    const fields = {
      brand, model, variant, color, condition, hsn_code,
      purchase_price, selling_price, warranty_period, description, is_visible
    };

    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        updates.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }

    if (specs !== undefined) {
      updates.push(`specs = $${idx}`);
      values.push(JSON.stringify(specs));
      idx++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      await query(`UPDATE products SET ${updates.join(', ')} WHERE id = $${idx}`, values);
    }

    // Update images if provided
    if (images && Array.isArray(images)) {
      await query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const url = typeof img === 'string' ? img : img.image_url;
        await query(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)',
          [id, url, i === 0]
        );
      }
    }

    // Re-sync stock_quantity from available units
    await this.syncStockCount(id);

    return await this.getById(id);
  },

  async delete(id) {
    await query('DELETE FROM products WHERE id = $1', [id]);
    return { success: true };
  },

  async toggleVisibility(id) {
    const res = await query('UPDATE products SET is_visible = NOT is_visible WHERE id = $1 RETURNING is_visible', [id]);
    return res.rows[0];
  },

  async addUnit(productId, { imei_1, imei_2, serial_no }) {
    if (!imei_1 || !imei_1.trim()) {
      throw new Error('IMEI 1 is required.');
    }
    const res = await query(
      'INSERT INTO product_units (product_id, imei_1, imei_2, serial_no, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [productId, imei_1.trim(), imei_2 || null, serial_no || null, 'available']
    );
    await this.syncStockCount(productId);
    return res.rows[0];
  },

  async deleteUnit(unitId) {
    const unitRes = await query('SELECT product_id, status FROM product_units WHERE id = $1', [unitId]);
    if (unitRes.rows.length === 0) throw new Error('Unit not found');
    if (unitRes.rows[0].status === 'sold') throw new Error('Cannot delete a sold unit.');

    const productId = unitRes.rows[0].product_id;
    await query('DELETE FROM product_units WHERE id = $1', [unitId]);
    await this.syncStockCount(productId);
    return { success: true };
  },

  async syncStockCount(productId) {
    const res = await query(
      `SELECT COUNT(*)::int as count FROM product_units WHERE product_id = $1 AND status = 'available'`,
      [productId]
    );
    const count = res.rows[0]?.count || 0;
    await query('UPDATE products SET stock_quantity = $1 WHERE id = $2', [count, productId]);
  },

  async getDashboardStats() {
    const today = new Date().toISOString().slice(0, 10);

    // Today sales & bills
    const todayRes = await query(`
      SELECT 
        COALESCE(SUM(grand_total), 0) as today_sales,
        COUNT(*)::int as today_bills
      FROM bills
      WHERE invoice_date = $1 AND status = 'paid'
    `, [today]);

    // All time totals
    const totalsRes = await query(`
      SELECT 
        COALESCE(SUM(grand_total), 0) as total_sales,
        COUNT(*)::int as total_bills
      FROM bills
      WHERE status = 'paid'
    `);

    // Total physical available stock
    const stockRes = await query(`
      SELECT 
        COALESCE(SUM(stock_quantity), 0)::int as total_stock_count,
        COUNT(*)::int as total_models_count
      FROM products
    `);

    // Low stock products (available stock <= 2)
    const lowStockRes = await query(`
      SELECT id, brand, model, variant, color, stock_quantity, selling_price
      FROM products
      WHERE stock_quantity <= 2
      ORDER BY stock_quantity ASC
    `);

    // Recent 5 bills
    const recentBillsRes = await query(`
      SELECT id, invoice_no, invoice_date, customer_name, customer_phone, grand_total, status
      FROM bills
      ORDER BY id DESC
      LIMIT 5
    `);

    return {
      todaySales: Number(todayRes.rows[0]?.today_sales || 0),
      todayBills: Number(todayRes.rows[0]?.today_bills || 0),
      totalSales: Number(totalsRes.rows[0]?.total_sales || 0),
      totalBills: Number(totalsRes.rows[0]?.total_bills || 0),
      totalStockCount: Number(stockRes.rows[0]?.total_stock_count || 0),
      totalModelsCount: Number(stockRes.rows[0]?.total_models_count || 0),
      lowStockCount: lowStockRes.rows.length,
      lowStockProducts: lowStockRes.rows,
      recentBills: recentBillsRes.rows,
    };
  }
};
