import { billModel } from '../models/billModel.js';
import { cartModel } from '../models/cartModel.js';

export const billController = {
  async getAllBills(req, res) {
    try {
      const { search, dateFrom, dateTo, limit, offset } = req.query;
      const bills = await billModel.getAll({ search, dateFrom, dateTo, limit, offset });
      return res.json({ success: true, bills });
    } catch (err) {
      console.error('Error fetching bills:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch bills' });
    }
  },

  async getBillById(req, res) {
    try {
      const { id } = req.params;
      const bill = await billModel.getById(id);
      if (!bill) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }
      return res.json({ success: true, bill });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch bill' });
    }
  },

  async getBillByInvoiceNo(req, res) {
    try {
      const { invoiceNo } = req.params;
      const bill = await billModel.getByInvoiceNo(invoiceNo);
      if (!bill) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      return res.json({ success: true, bill });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
    }
  },

  async getNextInvoiceNo(req, res) {
    try {
      const invoiceNo = await billModel.getNextInvoiceNumber();
      return res.json({ success: true, invoiceNo });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to generate invoice number' });
    }
  },

  async createBill(req, res) {
    try {
      const bill = await billModel.createBill(req.body);
      
      // If a cart sessionId was passed, clear that cart
      const sessionId = req.headers['x-cart-session'] || req.body.sessionId;
      if (sessionId) {
        await cartModel.clearCart(sessionId);
      }

      return res.status(201).json({
        success: true,
        message: 'Bill generated successfully',
        bill
      });
    } catch (err) {
      console.error('Bill creation error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to generate bill'
      });
    }
  }
};
