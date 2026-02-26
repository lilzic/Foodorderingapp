import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from "npm:hono@3";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Logger middleware
app.use("*", logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Fix/verify existing account endpoint
app.post("/make-server-7817ccb1/fix-account", async (c) => {
  try {
    const { email } = await c.req.json();

    // Find the user
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);

    if (!existingUser) {
      return c.json({ error: 'No account found with this email. Please sign up.' }, 404);
    }

    console.log(`Fixing account for: ${email}, current verified status: ${existingUser.email_confirmed_at !== null}`);

    // Update user to confirm email
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { email_confirm: true }
    );

    if (error) {
      console.log(`Error updating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Ensure user data exists in KV store
    const favoritesData = await kv.get(`user:${existingUser.id}:favorites`);
    if (!favoritesData) {
      await kv.set(`user:${existingUser.id}:favorites`, JSON.stringify([]));
    }
    
    const profileData = await kv.get(`user:${existingUser.id}:profile`);
    if (!profileData) {
      await kv.set(`user:${existingUser.id}:profile`, JSON.stringify({
        name: existingUser.user_metadata?.name || 'User',
        email: existingUser.email,
        createdAt: new Date().toISOString(),
      }));
    }

    return c.json({
      message: "Account verified successfully. You can now sign in.",
      userId: existingUser.id,
    });
  } catch (error) {
    console.log(`Fix account error: ${error}`);
    return c.json({ error: "Failed to fix account" }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-7817ccb1/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    console.log(`Signup attempt for email: ${email}`);

    // First, check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);

    if (existingUser) {
      console.log(`User already exists with email: ${email}, verified: ${existingUser.email_confirmed_at !== null}`);
      
      // If user exists but email is not confirmed, update to confirm it
      if (!existingUser.email_confirmed_at) {
        console.log(`Verifying existing unconfirmed user: ${existingUser.id}`);
        
        // Update the user to confirm email and update password
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { 
            email_confirm: true,
            password: password,
            user_metadata: { name }
          }
        );

        if (updateError) {
          console.log(`Error updating user: ${updateError.message}`);
          return c.json({ error: updateError.message }, 400);
        }

        // Ensure user data exists in KV store
        const favoritesData = await kv.get(`user:${existingUser.id}:favorites`);
        if (!favoritesData) {
          await kv.set(`user:${existingUser.id}:favorites`, JSON.stringify([]));
        }
        
        const profileData = await kv.get(`user:${existingUser.id}:profile`);
        if (!profileData) {
          await kv.set(`user:${existingUser.id}:profile`, JSON.stringify({
            name,
            email,
            createdAt: new Date().toISOString(),
          }));
        }

        return c.json({
          message: "Account verified successfully. You can now sign in.",
          userId: existingUser.id,
        });
      } else {
        // User exists and is verified, they should sign in
        return c.json({ 
          error: 'This email is already registered. Please sign in instead.',
          code: 'DUPLICATE_EMAIL'
        }, 409);
      }
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User created successfully: ${data.user.id}`);

    // Initialize user data in KV store
    await kv.set(`user:${data.user.id}:favorites`, JSON.stringify([]));
    await kv.set(`user:${data.user.id}:profile`, JSON.stringify({
      name,
      email,
      createdAt: new Date().toISOString(),
    }));

    return c.json({
      message: "Account created successfully. You can now sign in.",
      userId: data.user.id,
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Add to favorites
app.post("/make-server-7817ccb1/favorites", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { itemId } = await c.req.json();
    
    const favoritesData = await kv.get(`user:${user.id}:favorites`);
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];
    
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
      await kv.set(`user:${user.id}:favorites`, JSON.stringify(favorites));
    }

    return c.json({ favorites });
  } catch (error) {
    console.log(`Add to favorites error: ${error}`);
    return c.json({ error: "Failed to add to favorites" }, 500);
  }
});

// Remove from favorites
app.delete("/make-server-7817ccb1/favorites/:itemId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const itemId = c.req.param("itemId");
    
    const favoritesData = await kv.get(`user:${user.id}:favorites`);
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];
    
    const updatedFavorites = favorites.filter((id: string) => id !== itemId);
    await kv.set(`user:${user.id}:favorites`, JSON.stringify(updatedFavorites));

    return c.json({ favorites: updatedFavorites });
  } catch (error) {
    console.log(`Remove from favorites error: ${error}`);
    return c.json({ error: "Failed to remove from favorites" }, 500);
  }
});

// Get favorites
app.get("/make-server-7817ccb1/favorites", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const favoritesData = await kv.get(`user:${user.id}:favorites`);
    const favorites = favoritesData ? JSON.parse(favoritesData) : [];

    return c.json({ favorites });
  } catch (error) {
    console.log(`Get favorites error: ${error}`);
    return c.json({ error: "Failed to get favorites" }, 500);
  }
});

// Create order (with encryption)
app.post("/make-server-7817ccb1/orders", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const orderData = await c.req.json();
    
    // Encrypt sensitive payment information
    const encryptedOrder = {
      ...orderData,
      userId: user.id,
      userEmail: user.email,
      status: "pending",
      createdAt: new Date().toISOString(),
      // Payment info is encrypted on client side before sending
    };

    const orderId = `order:${Date.now()}:${user.id}`;
    await kv.set(orderId, JSON.stringify(encryptedOrder));

    // Add to user's orders list
    const userOrdersData = await kv.get(`user:${user.id}:orders`);
    const userOrders = userOrdersData ? JSON.parse(userOrdersData) : [];
    userOrders.push(orderId);
    await kv.set(`user:${user.id}:orders`, JSON.stringify(userOrders));

    // Add to admin orders list
    const adminOrdersData = await kv.get("admin:orders");
    const adminOrders = adminOrdersData ? JSON.parse(adminOrdersData) : [];
    adminOrders.push(orderId);
    await kv.set("admin:orders", JSON.stringify(adminOrders));

    return c.json({
      message: "Order created successfully",
      orderId,
      order: encryptedOrder,
    });
  } catch (error) {
    console.log(`Create order error: ${error}`);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get user orders
app.get("/make-server-7817ccb1/orders", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userOrdersData = await kv.get(`user:${user.id}:orders`);
    const orderIds = userOrdersData ? JSON.parse(userOrdersData) : [];

    const orders = [];
    for (const orderId of orderIds) {
      const orderData = await kv.get(orderId);
      if (orderData) {
        const order = JSON.parse(orderData);
        orders.push({
          ...order,
          orderId: orderId,
        });
      }
    }

    return c.json({ orders });
  } catch (error) {
    console.log(`Get orders error: ${error}`);
    return c.json({ error: "Failed to get orders" }, 500);
  }
});

// Admin: Get all orders
app.get("/make-server-7817ccb1/admin/orders", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is admin
    const isAdminData = await kv.get(`admin:${user.id}`);
    if (!isAdminData) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }

    const adminOrdersData = await kv.get("admin:orders");
    const orderIds = adminOrdersData ? JSON.parse(adminOrdersData) : [];

    const orders = [];
    for (const orderId of orderIds) {
      const orderData = await kv.get(orderId);
      if (orderData) {
        const order = JSON.parse(orderData);
        orders.push({
          ...order,
          orderId: orderId,
        });
      }
    }

    return c.json({ orders });
  } catch (error) {
    console.log(`Get admin orders error: ${error}`);
    return c.json({ error: "Failed to get orders" }, 500);
  }
});

// Admin: Update order status
app.put("/make-server-7817ccb1/admin/orders/:orderId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is admin
    const isAdminData = await kv.get(`admin:${user.id}`);
    if (!isAdminData) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }

    const orderId = c.req.param("orderId");
    const { status } = await c.req.json();

    const orderData = await kv.get(orderId);
    if (!orderData) {
      return c.json({ error: "Order not found" }, 404);
    }

    const order = JSON.parse(orderData);
    order.status = status;
    order.updatedAt = new Date().toISOString();

    await kv.set(orderId, JSON.stringify(order));

    return c.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.log(`Update order error: ${error}`);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// Get user profile
app.get("/make-server-7817ccb1/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profileData = await kv.get(`user:${user.id}:profile`);
    const profile = profileData ? JSON.parse(profileData) : null;

    // Check if user is admin
    const isAdminData = await kv.get(`admin:${user.id}`);
    const isAdmin = !!isAdminData;

    return c.json({ 
      profile: { 
        ...profile, 
        id: user.id,
        accessToken: accessToken,
        isAdmin: isAdmin
      } 
    });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Request password reset
app.post("/make-server-7817ccb1/request-password-reset", async (c) => {
  try {
    const { email } = await c.req.json();

    // Find user by email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const user = existingUsers?.users.find(u => u.email === email);

    if (!user) {
      // For security, don't reveal if email exists
      return c.json({ message: "If the email exists, a reset code has been sent." });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code with expiry (10 minutes)
    await kv.set(`reset:${email}`, JSON.stringify({
      code: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    }));

    // In production, send this via email. For now, log it
    console.log(`Password reset code for ${email}: ${resetCode}`);
    console.log(`⚠️ IMPORTANT: In production, this would be sent via email`);

    return c.json({ 
      message: "If the email exists, a reset code has been sent.",
      // For development only - remove in production
      resetCode: resetCode 
    });
  } catch (error) {
    console.log(`Request password reset error: ${error}`);
    return c.json({ error: "Failed to request password reset" }, 500);
  }
});

// Reset password
app.post("/make-server-7817ccb1/reset-password", async (c) => {
  try {
    const { email, resetCode, newPassword } = await c.req.json();

    // Verify reset code
    const resetData = await kv.get(`reset:${email}`);
    if (!resetData) {
      return c.json({ error: "Invalid or expired reset code" }, 400);
    }

    const { code, expiresAt } = JSON.parse(resetData);

    if (Date.now() > expiresAt) {
      await kv.del(`reset:${email}`);
      return c.json({ error: "Reset code has expired" }, 400);
    }

    if (code !== resetCode) {
      return c.json({ error: "Invalid reset code" }, 400);
    }

    // Find user
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const user = existingUsers?.users.find(u => u.email === email);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Update password
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.log(`Error updating password: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Delete reset code
    await kv.del(`reset:${email}`);

    console.log(`Password reset successful for ${email}`);

    return c.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(`Reset password error: ${error}`);
    return c.json({ error: "Failed to reset password" }, 500);
  }
});

// Get payment details (for checkout)
app.get("/make-server-7817ccb1/payment-details", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    // Check if user is admin for admin-specific requests
    if (accessToken) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (user && !error) {
        const isAdminData = await kv.get(`admin:${user.id}`);
        // Admin can see full details
      }
    }

    const detailsData = await kv.get("payment:details");
    const details = detailsData ? JSON.parse(detailsData) : {
      bankName: "First Bank of Nigeria",
      accountName: "Sacy's Kitchen",
      accountNumber: "0123456789",
      creditCardName: "Sacy's Kitchen",
      creditCardNumber: "**** **** **** 1234",
    };

    return c.json({ details });
  } catch (error) {
    console.log(`Get payment details error: ${error}`);
    return c.json({ error: "Failed to get payment details" }, 500);
  }
});

// Update payment details (admin only)
app.post("/make-server-7817ccb1/payment-details", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is admin
    const isAdminData = await kv.get(`admin:${user.id}`);
    if (!isAdminData) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }

    const { details } = await c.req.json();
    await kv.set("payment:details", JSON.stringify(details));

    console.log(`Payment details updated by admin ${user.id}`);

    return c.json({ message: "Payment details updated successfully" });
  } catch (error) {
    console.log(`Update payment details error: ${error}`);
    return c.json({ error: "Failed to update payment details" }, 500);
  }
});

Deno.serve(app.fetch);