import { customerModel } from '../models/customerModel.js';

export const customerController = {
  async searchCustomers(req, res) {
    try {
      const { q } = req.query;
      const customers = await customerModel.search(q);
      return res.json({ success: true, customers });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to search customers' });
    }
  }
};
