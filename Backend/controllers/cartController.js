import { cartModel } from '../models/cartModel.js';

export const cartController = {
  async getCart(req, res) {
    try {
      const sessionId = req.headers['x-cart-session'] || req.query.sessionId || 'default-pos-session';
      const cart = await cartModel.getOrCreateCart(sessionId);
      return res.json({ success: true, cart });
    } catch (err) {
      console.error('Cart fetch error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch cart' });
    }
  },

  async addItem(req, res) {
    try {
      const sessionId = req.headers['x-cart-session'] || req.body.sessionId || 'default-pos-session';
      const { productId, unitId, quantity, rate, discount } = req.body;
      
      if (!productId || rate === undefined) {
        return res.status(400).json({ success: false, message: 'Product ID and rate are required' });
      }

      const cart = await cartModel.addItem(sessionId, {
        productId, unitId, quantity, rate, discount
      });
      return res.json({ success: true, message: 'Item added to cart', cart });
    } catch (err) {
      console.error('Cart add item error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Failed to add item to cart' });
    }
  },

  async updateItem(req, res) {
    try {
      const { itemId } = req.params;
      await cartModel.updateItem(itemId, req.body);
      return res.json({ success: true, message: 'Cart item updated' });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message || 'Failed to update item' });
    }
  },

  async removeItem(req, res) {
    try {
      const { itemId } = req.params;
      await cartModel.removeItem(itemId);
      return res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
  },

  async clearCart(req, res) {
    try {
      const sessionId = req.headers['x-cart-session'] || req.query.sessionId || 'default-pos-session';
      await cartModel.clearCart(sessionId);
      return res.json({ success: true, message: 'Cart cleared' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to clear cart' });
    }
  }
};
