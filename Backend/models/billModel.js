import { query } from '../config/db.js';
import { numberToIndianWords } from '../utils/numberToWords.js';
import { customerModel } from './customerModel.js';

export const billModel = {
  async getNextInvoiceNumber() {
    // Find highest invoice number in database
    const res = await query(`
      SELECT invoice_no 
      FROM bills 
      ORDER BY id DESC 
      LIMIT 1
    `);

    if (res.rows.length === 0) return '2687';

    const last = res.rows[0].invoice_no;
    const match = last.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10) + 1;
      return num.toString();
    }
    return '2687';
  },

  async getAll({ search, dateFrom, dateTo, limit = 50, offset = 0 } = {}) {
    const conditions = [];
    const params = [];
    let idx = 1;

    if (search && search.trim()) {
      conditions.push(`(b.invoice_no ILIKE $${idx} OR b.customer_name ILIKE $${idx} OR b.customer_phone ILIKE $${idx})`);
      params.push(`%${search.trim()}%`);
      idx++;
    }

    if (dateFrom) {
      conditions.push(`b.invoice_date >= $${idx}`);
      params.push(dateFrom);
      idx++;
    }

    if (dateTo) {
      conditions.push(`b.invoice_date <= $${idx}`);
      params.push(dateTo);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        b.*,
        p.payment_mode,
        p.finance_company,
        p.reference_no,
        (
          SELECT COUNT(*)::int 
          FROM bill_items bi 
          WHERE bi.bill_id = b.id
        ) as items_count,
        (
          SELECT COALESCE(SUM(bi.quantity), 0)::int
          FROM bill_items bi
          WHERE bi.bill_id = b.id
        ) as total_qty
      FROM bills b
      LEFT JOIN payments p ON p.bill_id = b.id
      ${whereClause}
      ORDER BY b.id DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    params.push(limit, offset);
    const res = await query(sql, params);
    return res.rows;
  },

  async getById(id) {
    const billRes = await query('SELECT * FROM bills WHERE id = $1', [id]);
    if (billRes.rows.length === 0) return null;
    const bill = billRes.rows[0];

    const itemsRes = await query(`
      SELECT bi.*, p.specs
      FROM bill_items bi
      LEFT JOIN products p ON p.id = bi.product_id
      WHERE bi.bill_id = $1
      ORDER BY bi.id ASC
    `, [id]);

    const paymentRes = await query('SELECT * FROM payments WHERE bill_id = $1 LIMIT 1', [id]);
    const shopSettingsRes = await query('SELECT * FROM shop_settings LIMIT 1');

    return {
      ...bill,
      items: itemsRes.rows,
      payment: paymentRes.rows[0] || null,
      shop: shopSettingsRes.rows[0] || null,
    };
  },

  async getByInvoiceNo(invoiceNo) {
    const res = await query('SELECT id FROM bills WHERE invoice_no = $1', [invoiceNo]);
    if (res.rows.length === 0) return null;
    return await this.getById(res.rows[0].id);
  },

  async createBill(data) {
    const {
      customerName,
      customerPhone,
      customerAddress = '',
      customerGstin = '',
      salesmanName = 'MANISH KUMAR MEHTA',
      invoiceDate = new Date().toISOString().slice(0, 10),
      customInvoiceNo,
      items = [], // array of { productId, unitId, imei1, imei2, rate, discount, financeName, loanNo }
      overallDiscount = 0,
      gstPercent = 18.00,
      paymentMode = 'Cash', // 'Cash', 'UPI', 'Card', 'EMI', 'Mixed'
      amountPaid,
      referenceNo = '',
      financeCompany = '',
      exchangeValue = 0,
      exchangePhoneDetails = '',
      notes = ''
    } = data;

    if (!customerName || !customerPhone) {
      throw new Error('Customer Name and Phone number are required.');
    }

    if (!items || items.length === 0) {
      throw new Error('Invoice must contain at least one product item.');
    }

    // 1. Validate all IMEI units: must be available and not already sold
    for (const item of items) {
      if (item.unitId) {
        const unitCheck = await query('SELECT status, imei_1 FROM product_units WHERE id = $1', [item.unitId]);
        if (unitCheck.rows.length === 0) {
          throw new Error(`Unit ${item.imei1 || item.unitId} not found.`);
        }
        if (unitCheck.rows[0].status === 'sold') {
          throw new Error(`IMEI ${unitCheck.rows[0].imei_1} has already been sold! Cannot sell duplicate unit.`);
        }
      } else if (item.imei1) {
        const unitCheck = await query('SELECT status, imei_1 FROM product_units WHERE imei_1 = $1', [item.imei1.trim()]);
        if (unitCheck.rows.length > 0 && unitCheck.rows[0].status === 'sold') {
          throw new Error(`IMEI ${item.imei1} has already been sold! Cannot sell duplicate unit.`);
        }
      }
    }

    // 2. Get or create customer
    const customer = await customerModel.getOrCreate({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      gstin: customerGstin
    });

    // 3. Invoice Number
    const invoiceNo = customInvoiceNo && customInvoiceNo.trim() ? customInvoiceNo.trim() : await this.getNextInvoiceNumber();

    // 4. Calculate amounts
    // In mobile phone retail billing (like Shri Narayan Telecom):
    // Total Amount Payable = Sum(item.rate - item.discount) - overallDiscount - exchangeValue
    let itemsTotal = 0;
    let totalItemDiscounts = 0;

    for (const item of items) {
      const lineTotal = (Number(item.rate) || 0) * (Number(item.quantity) || 1) - (Number(item.discount) || 0);
      itemsTotal += lineTotal;
      totalItemDiscounts += (Number(item.discount) || 0);
    }

    const netTotal = Math.max(0, itemsTotal - Number(overallDiscount));
    const grandTotal = Math.max(0, netTotal - Number(exchangeValue));

    // GST Breakdown (Inclusive calculation matching tax invoice)
    // Taxable + SGST (9%) + CGST (9%) = grandTotal
    const gstPct = Number(gstPercent) || 18.00;
    const taxableAmount = Math.round((grandTotal / (1 + (gstPct / 100))) * 100) / 100;
    const totalGstAmount = Math.round((grandTotal - taxableAmount) * 100) / 100;
    
    const halfGstRate = gstPct / 2;
    const sgstAmount = Math.round((totalGstAmount / 2) * 100) / 100;
    const cgstAmount = Math.round((totalGstAmount - sgstAmount) * 100) / 100;

    const roundoff = 0.00;
    const crDrNote = 0.00;
    const amountInWords = numberToIndianWords(grandTotal);

    // 5. Insert Bill
    const billInsertSql = `
      INSERT INTO bills (
        invoice_no, invoice_date, customer_id, customer_name, customer_phone, customer_address, customer_gstin,
        sales_man, sub_total, total_discount, gst_percent, taxable_amount, sgst_rate, sgst_amount, cgst_rate, cgst_amount,
        cr_dr_note, roundoff, grand_total, amount_in_words, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

    const billRes = await query(billInsertSql, [
      invoiceNo,
      invoiceDate,
      customer.id,
      customerName.trim(),
      customerPhone.trim(),
      customerAddress.trim(),
      customerGstin.trim(),
      salesmanName,
      taxableAmount,
      totalItemDiscounts + Number(overallDiscount),
      gstPct,
      taxableAmount,
      halfGstRate,
      sgstAmount,
      halfGstRate,
      cgstAmount,
      crDrNote,
      roundoff,
      grandTotal,
      amountInWords,
      notes,
      'paid'
    ]);

    const createdBill = billRes.rows[0];

    // 6. Insert Bill Items and update product units + product stock
    for (const item of items) {
      // Fetch product details
      const prodRes = await query('SELECT * FROM products WHERE id = $1', [item.productId]);
      const product = prodRes.rows[0] || {};

      const lineAmount = (Number(item.rate) || 0) * (Number(item.quantity) || 1) - (Number(item.discount) || 0);

      await query(`
        INSERT INTO bill_items (
          bill_id, product_id, unit_id, company, model_name, variant, color,
          imei_1, imei_2, finance_name, loan_no, hsn_sac, quantity, rate, discount, amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        createdBill.id,
        item.productId,
        item.unitId || null,
        product.brand || item.company || 'MOBILE',
        `${product.brand || ''} ${product.model || ''}(${product.variant || ''})${product.color || ''}`.trim(),
        product.variant || item.variant || '',
        product.color || item.color || '',
        item.imei1 || item.imei_1 || '',
        item.imei2 || item.imei_2 || '',
        item.financeName || financeCompany || '',
        item.loanNo || '',
        product.hsn_code || '85171300',
        Number(item.quantity) || 1,
        Number(item.rate),
        Number(item.discount) || 0,
        lineAmount
      ]);

      // If specific IMEI unit was sold:
      if (item.unitId) {
        await query(
          `UPDATE product_units SET status = 'sold', bill_id = $1, sold_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [createdBill.id, item.unitId]
        );
      } else if (item.imei1) {
        // If IMEI string provided without unitId, search and mark
        await query(
          `UPDATE product_units SET status = 'sold', bill_id = $1, sold_at = CURRENT_TIMESTAMP WHERE imei_1 = $2 AND status = 'available'`,
          [createdBill.id, item.imei1.trim()]
        );
      }

      // Re-calculate and decrement stock_quantity for this product
      const availRes = await query(
        `SELECT COUNT(*)::int as count FROM product_units WHERE product_id = $1 AND status = 'available'`,
        [item.productId]
      );
      const remainingCount = availRes.rows[0]?.count || 0;
      await query('UPDATE products SET stock_quantity = $1 WHERE id = $2', [remainingCount, item.productId]);
    }

    // 7. Insert Payment record
    const finalAmountPaid = amountPaid !== undefined ? Number(amountPaid) : grandTotal;
    await query(`
      INSERT INTO payments (
        bill_id, payment_mode, amount, reference_no, finance_company, exchange_value, exchange_phone_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      createdBill.id,
      paymentMode,
      finalAmountPaid,
      referenceNo,
      financeCompany,
      exchangeValue,
      exchangePhoneDetails
    ]);

    return await this.getById(createdBill.id);
  }
};
