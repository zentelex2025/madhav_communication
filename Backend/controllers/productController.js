import { productModel } from '../models/productModel.js';

export const productController = {
  async getPublicProducts(req, res) {
    try {
      const { search, brand, condition, minPrice, maxPrice, ram, storage } = req.query;
      const products = await productModel.getAll({
        search, brand, condition, minPrice, maxPrice, ram, storage,
        isPublic: true,
      });
      return res.json({ success: true, products });
    } catch (err) {
      console.error('Error fetching public products:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
  },

  async getAdminProducts(req, res) {
    try {
      const { search, brand, condition } = req.query;
      const products = await productModel.getAll({
        search, brand, condition,
        isPublic: false,
      });
      return res.json({ success: true, products });
    } catch (err) {
      console.error('Error fetching admin products:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
    }
  },

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productModel.getById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
  },

  async createProduct(req, res) {
    try {
      const { brand, model, variant, color, selling_price } = req.body;
      if (!brand || !model || !variant || !color || selling_price === undefined) {
        return res.status(400).json({ success: false, message: 'Brand, model, variant, color, and selling price are required.' });
      }

      const product = await productModel.create(req.body);
      return res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (err) {
      console.error('Create product error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to create product' });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await productModel.update(id, req.body);
      return res.json({ success: true, message: 'Product updated successfully', product });
    } catch (err) {
      console.error('Update product error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to update product' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await productModel.delete(id);
      return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
  },

  async toggleVisibility(req, res) {
    try {
      const { id } = req.params;
      const result = await productModel.toggleVisibility(id);
      return res.json({ success: true, message: 'Visibility updated', is_visible: result.is_visible });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to toggle visibility' });
    }
  },

  async addUnit(req, res) {
    try {
      const { id } = req.params;
      const unit = await productModel.addUnit(id, req.body);
      return res.status(201).json({ success: true, message: 'IMEI unit added successfully', unit });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Failed to add IMEI unit' });
    }
  },

  async deleteUnit(req, res) {
    try {
      const { unitId } = req.params;
      await productModel.deleteUnit(unitId);
      return res.json({ success: true, message: 'IMEI unit removed successfully' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Failed to delete IMEI unit' });
    }
  },

  async getDashboard(req, res) {
    try {
      const stats = await productModel.getDashboardStats();
      return res.json({ success: true, stats });
    } catch (err) {
      console.error('Dashboard stats error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
    }
  }
};
