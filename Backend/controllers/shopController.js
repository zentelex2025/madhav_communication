import { shopModel } from '../models/shopModel.js';

export const shopController = {
  async getSettings(req, res) {
    try {
      const settings = await shopModel.getSettings();
      return res.json({ success: true, settings });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch shop settings' });
    }
  },

  async updateSettings(req, res) {
    try {
      const settings = await shopModel.updateSettings(req.body);
      return res.json({ success: true, message: 'Shop settings updated successfully', settings });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update shop settings' });
    }
  }
};
