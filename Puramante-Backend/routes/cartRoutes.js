import express from "express";
import Cart from "../model/Cart.js";
import User from "../model/User.js";

const router = express.Router();

// Get user's cart
// Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ userId: req.params.userId, items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, price, quantity, imageUrl } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, imageUrl });
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Remove item from cart
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// Clear user's cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// Merge local/guest cart items into user's server cart
router.post("/merge", async (req, res) => {
  try {
    const { userId: rawUserId, email, items = [] } = req.body;

    let userId = rawUserId;
    if (!userId && email) {
      const user = await User.findOne({ email }).select("_id");
      if (user) userId = user._id.toString();
    }

    if (!userId) {
      return res.status(400).json({ error: "userId or email is required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const existingByProductId = new Map(
      cart.items.map((it) => [it.productId.toString(), it])
    );

    for (const incoming of items) {
      const productId = (incoming.productId || incoming._id || incoming.id || "").toString();
      if (!productId) continue;

      const name = incoming.name || "";
      const price = Number(incoming.price || 0);
      const quantity = Math.max(1, Number(incoming.quantity || 1));
      const imageUrl = incoming.imageUrl || incoming.imageurl || "";

      const existing = existingByProductId.get(productId);
      if (existing) {
        existing.quantity = Math.max(1, Number(existing.quantity || 0) + quantity);
        // Optionally refresh other fields
        if (name) existing.name = name;
        if (!isNaN(price) && price >= 0) existing.price = price;
        if (imageUrl) existing.imageUrl = imageUrl;
      } else {
        cart.items.push({ productId, name, price, quantity, imageUrl });
        existingByProductId.set(productId, cart.items[cart.items.length - 1]);
      }
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    await cart.save();

    return res.status(200).json({ message: "Cart merged", cart });
  } catch (err) {
    return res.status(500).json({ error: "Failed to merge cart" });
  }
});
// Set absolute quantity for one item
router.put("/quantity", async (req, res) => {
  try {
    const { userId, productId, quantity, name, price = 0, imageUrl } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [], totalAmount: 0 });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    } else {
      // upsert behaviour (agar item missing ho to push)
      cart.items.push({ productId, name, price, quantity: Math.max(1, quantity), imageUrl });
    }

    cart.totalAmount = cart.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
    await cart.save();
    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

export default router;
