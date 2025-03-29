// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
//
const path = require("path");


dotenv.config();
const app = express();
// ✅ 配置 CORS，只允许你的前端地址
const corsOptions = {
  origin: "https://sharetea-zgyh.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 提供静态文件
app.use(express.static(path.join(__dirname, 'build')));

// 对于所有未知的路由，返回前端的 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const pool = new Pool({
  host: process.env.PSQL_HOST,
  user: process.env.PSQL_USER,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT
});

// 用户登录
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM employee WHERE employeename = $1 AND employeepassword = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      const employee = result.rows[0];
      const role = employee.employeetype === "Chef" ? "USER" : employee.employeetype;
      return res.json({
        success: true,
        user: {
          id: employee.employeeid,
          name: employee.employeename,
          role
        }
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 访客登录
app.post("/api/guest", (req, res) => {
  return res.json({
    success: true,
    user: {
      id: 0,
      name: "Guest",
      role: "USER"
    }
  });
});

// 获取所有菜单
app.get("/api/menu", async (req, res) => {
  try {
    const query = `
      SELECT 
        m.itemid,
        m.itemname,
        m.itemtype,  -- ✅ 加上这行
        m.itemprice,
        ARRAY_REMOVE(ARRAY_AGG(i.ingredientname), NULL) AS ingredients
      FROM menuitem m
      LEFT JOIN itemingredients mi ON m.itemid = mi.itemid
      LEFT JOIN ingredients i ON mi.ingredientid = i.ingredientid
      WHERE m.available = TRUE
      GROUP BY m.itemid, m.itemtype  -- ✅ 加上 m.itemtype
      ORDER BY m.itemid;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 获取指定类型菜单
app.get("/api/menu/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const query = `
      SELECT 
        m.itemid,
        m.itemname,
        m.itemtype,  -- ✅ 加上这行
        m.itemprice,
        ARRAY_REMOVE(ARRAY_AGG(i.ingredientname), NULL) AS ingredients
      FROM menuitem m
      LEFT JOIN itemingredients mi ON m.itemid = mi.itemid
      LEFT JOIN ingredients i ON mi.ingredientid = i.ingredientid
      WHERE m.available = TRUE AND m.itemtype = $1
      GROUP BY m.itemid, m.itemtype  -- ✅ 加上 m.itemtype
      ORDER BY m.itemid;
    `;
    const result = await pool.query(query, [type]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu by type:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 提交订单
app.post("/api/orders", async (req, res) => {
  const { customerName, userId, items, paymentMethod } = req.body;

  console.log("📥 New Simple Order Received:");
  console.log("➡️ Customer:", customerName);
  console.log("➡️ User ID:", userId);
  console.log("➡️ Items:", items);
  console.log("➡️ Payment:", paymentMethod);

  if (!customerName || !userId || !Array.isArray(items) || items.length === 0) {
    console.warn("⚠️ Missing required fields");
    return res.status(400).json({ success: false, message: "Missing order details" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔧 修复自增序列
    await client.query(`
      SELECT setval('transactions_id_seq', (SELECT COALESCE(MAX(id), 0) FROM transactions));
    `);

    for (const item of items) {
      if (!item.itemid || item.price === undefined) {
        throw new Error(`❌ Invalid item format: ${JSON.stringify(item)}`);
      }

      await client.query(
        `INSERT INTO transactions (sale_id, menu_item_id, quantity, price, paymentmethod, transactioncategory)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          0,                        // dummy sale_id (e.g., 0 or null)
          item.itemid,
          1,
          item.price,
          paymentMethod,
          "Sale"
        ]
      );

      console.log(`✅ Inserted item ${item.itemid} into transactions`);
    }

    await client.query("COMMIT");
    client.release();

    console.log("✅ All transactions saved (no orders inserted)");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    client.release();

    console.error("🔥 Error saving transactions:", err.message);
    res.status(500).json({ success: false, message: "Failed to save transactions" });
  }
});



// 添加饮料
app.post("/api/menu/add", async (req, res) => {
  const { itemname, itemtype, itemprice } = req.body;
  try {
    const result = await pool.query("SELECT COALESCE(MAX(itemid), 0) + 1 AS nextid FROM menuitem");
    const nextId = result.rows[0].nextid;

    await pool.query(
      "INSERT INTO menuitem (itemid, itemname, itemtype, itemprice, available) VALUES ($1, $2, $3, $4, TRUE)",
      [nextId, itemname, itemtype, itemprice]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding drink:", err);
    res.status(500).json({ success: false, message: "Failed to add drink" });
  }
});

// 删除饮料
// 改成 POST
app.post("/api/menu/delete", async (req, res) => {
  const { itemname } = req.body;
  try {
    await pool.query("DELETE FROM menuitem WHERE itemname = $1", [itemname]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting drink:", err);
    res.status(500).json({ success: false, message: "Failed to delete drink" });
  }
});





// backend/server.js 中添加以下接口（确保你已经连接好了 PostgreSQL）
// === Inventory API ===

// Getting All Inventory Records
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.inventoryid,
        i.quantity,
        i.menuitemid,
        m.itemname,
        i.timestamp,
        i.restockdate,
        i.lastupdated
      FROM inventory i
      JOIN menuitem m ON i.menuitemid = m.itemid
      ORDER BY i.inventoryid;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add a New Inventory Record
// 添加库存记录
// Add or update inventory record
app.post('/api/inventory/add', async (req, res) => {
  const { menuitemid, quantity } = req.body;

  if (!menuitemid || !quantity) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const now = new Date();

    // Check if an inventory record exists for the given menuitemid
    const result = await pool.query('SELECT * FROM inventory WHERE menuitemid = $1', [menuitemid]);

    if (result.rows.length > 0) {
      // Update the existing record if found
      await pool.query(
        'UPDATE inventory SET quantity = quantity + $1, lastupdated = $2 WHERE menuitemid = $3',
        [quantity, now, menuitemid]
      );
      return res.json({ success: true, message: 'Inventory updated successfully' });
    } else {
      // Insert a new record if not found
      await pool.query(
        'INSERT INTO inventory (timestamp, menuitemid, quantity, restockdate, lastupdated) VALUES ($1, $2, $3, $1, $1)',
        [now, menuitemid, quantity]
      );
      return res.json({ success: true, message: 'Inventory added successfully' });
    }
  } catch (err) {
    console.error('Error adding or updating inventory:', err);
    res.status(500).json({ error: 'Failed to add or update inventory' });
  }
});





// Delete an Inventory Record
app.delete('/api/inventory/delete', async (req, res) => {
  const { inventoryid } = req.body;

  if (!inventoryid) {
    return res.status(400).json({ error: 'Missing inventory ID' });
  }

  try {
    await pool.query('DELETE FROM inventory WHERE inventoryid = $1', [inventoryid]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting inventory:', err);
    res.status(500).json({ error: 'Failed to delete inventory' });
  }
});

// Update an Inventory Record
app.post("/api/inventory/update", async (req, res) => {
  const { inventoryid, quantity } = req.body;

  if (!inventoryid || !quantity) {
    return res.status(400).json({ error: "Missing inventory ID or quantity" });
  }

  try {
    await pool.query("UPDATE inventory SET quantity = $1 WHERE inventoryid = $2", [quantity, inventoryid]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Trends

app.get('/api/trends', async (req, res) => {
  const { trendType, timeRange } = req.query;
  
  let timeFilter = "";
  if (timeRange === "Last 7 Days") {
    timeFilter = " WHERE SalesTimestamp >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (timeRange === "Last 30 Days") {
    timeFilter = " WHERE SalesTimestamp >= CURRENT_DATE - INTERVAL '30 days'";
  }

  let query = "";
  switch (trendType) {
    case "Daily Sales":
      query = `SELECT SalesTimestamp AS date, total_amount
               FROM sales
               ${timeFilter}
               ORDER BY SalesTimestamp ASC`;
      break;
    case "Peak Days":
      query = `SELECT SalesTimestamp AS date, total_amount
               FROM sales
               WHERE peak_day_flag = TRUE
               ${timeFilter}
               ORDER BY total_amount DESC`;
      break;
    case "Total Orders":
      query = `SELECT SalesTimestamp AS date, COUNT(*) as order_count
               FROM sales
               ${timeFilter}
               GROUP BY SalesTimestamp
               ORDER BY SalesTimestamp ASC`;
      break;
    case "Product Usage":
      query = `SELECT RestockDate AS usage_date, SUM(quantity) AS used_quantity
               FROM inventory
               ${timeFilter}
               GROUP BY RestockDate
               ORDER BY RestockDate ASC`;
      break;
    default:
      return res.status(400).json({ error: "Invalid trend type" });
  }

  try {
    const result = await pool.query(query);
    res.json(result.rows); // 返回查询结果给前端
  } catch (err) {
    console.error("Error fetching trend data:", err);
    res.status(500).json({ error: "Failed to fetch trend data" });
  }
});




// 获取所有员工
// 获取所有员工
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// 添加员工
app.post("/api/employees", async (req, res) => {
  const { employeename, employeepassword, employeetype } = req.body;
  try {
    await pool.query(
      "INSERT INTO employee (employeename, employeepassword, employeetype) VALUES ($1, $2, $3)",
      [employeename, employeepassword, employeetype]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// 更新员工
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { employeename, employeepassword, employeetype } = req.body;
  try {
    await pool.query(
      "UPDATE employee SET employeename = $1, employeepassword = $2, employeetype = $3 WHERE employeeid = $4",
      [employeename, employeepassword, employeetype, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// 删除员工
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employee WHERE employeeid = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

//Seasonl
app.get("/api/menu/seasonal", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menuitem WHERE itemtype = $1", ['Seasonal']);
    res.json(result.rows);  // 返回查询结果
  } catch (err) {
    console.error("Error fetching seasonal menu:", err);
    res.status(500).json({ error: "Failed to fetch seasonal menu items" });
  }
});
app.post("/api/menu/add", async (req, res) => {
  const { itemname, itemtype, itemprice } = req.body;
  if (!itemname || !itemtype || !itemprice) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const result = await pool.query(
      "INSERT INTO menuitem (itemname, itemtype, itemprice) VALUES ($1, $2, $3) RETURNING *",
      [itemname, "Seasonal", itemprice]  // 强制设置 itemtype 为 'Seasonal'
    );
    res.json(result.rows[0]);  // 返回新添加的菜单项
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});
app.post("/api/menu/delete", async (req, res) => {
  const { itemid } = req.body;
  if (!itemid) {
    return res.status(400).json({ error: 'Missing item ID' });
  }
  try {
    await pool.query('DELETE FROM menuitem WHERE itemid = $1', [itemid]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});


// 在 server.js 中添加
app.get('/api/productusage', async (req, res) => {
  const { startDate, endDate, timeRange } = req.query;
  let queryStartDate = startDate;
  let queryEndDate = endDate;

  // 根据时间范围计算起始和结束日期
  if (timeRange === 'Last 7 Days') {
    queryStartDate = new Date();
    queryStartDate.setDate(queryStartDate.getDate() - 7);
    queryStartDate = queryStartDate.toISOString().split('T')[0]; // 获取格式为YYYY-MM-DD的日期
    queryEndDate = new Date().toISOString().split('T')[0]; // 今天
  } else if (timeRange === 'Last 30 Days') {
    queryStartDate = new Date();
    queryStartDate.setDate(queryStartDate.getDate() - 30);
    queryStartDate = queryStartDate.toISOString().split('T')[0]; // 获取格式为YYYY-MM-DD的日期
    queryEndDate = new Date().toISOString().split('T')[0]; // 今天
  }

  // 使用自定义日期范围时直接使用传入的日期
  if (timeRange === 'Custom Range' && queryStartDate && queryEndDate) {
    queryStartDate = startDate;
    queryEndDate = endDate;
  }

  try {
    // 数据库查询
    const result = await pool.query(
      "SELECT m.itemname, SUM(i.quantity) AS total_used " +
      "FROM inventory i " +
      "JOIN menuitem m ON i.menuitemid = m.itemid " +
      "WHERE i.timestamp::DATE BETWEEN $1::DATE AND $2::DATE " +
      "GROUP BY m.itemname " +
      "ORDER BY total_used DESC",
      [queryStartDate, queryEndDate]
    );

    // 格式化数据
    const trendData = result.rows.map((row) => ({
      itemName: row.itemname,
      totalUsed: row.total_used,
    }));

    res.json(trendData);
  } catch (err) {
    console.error('Error fetching product usage data:', err);
    res.status(500).json({ error: 'Failed to fetch product usage data' });
  }
});

// X-Report
app.get('/api/xreport', async (req, res) => {
  const { startHour, endHour } = req.query;

  // 确保startHour 和 endHour 是有效的数字
  if (isNaN(startHour) || isNaN(endHour)) {
    return res.status(400).send("Invalid hours provided.");
  }

  // 构建SQL查询
  const query = `
    SELECT 
      EXTRACT(HOUR FROM s.SalesTimestamp) AS hour, 
      COUNT(DISTINCT t.id) AS total_transactions, 
      COALESCE(SUM(s.total_amount), 0) AS sales_revenue, 
      COALESCE(SUM(t.price * t.quantity), 0) AS total_sales, 
      COALESCE(SUM(CASE WHEN t.TransactionCategory = 'Return' THEN t.price * t.quantity ELSE 0 END), 0) AS total_returns, 
      COALESCE(SUM(CASE WHEN mi.ItemType = 'Drink' THEN t.quantity ELSE 0 END), 0) AS drink_sales, 
      COALESCE(SUM(CASE WHEN t.TransactionCategory = 'Void' THEN t.price * t.quantity ELSE 0 END), 0) AS voids, 
      COALESCE(SUM(CASE WHEN t.TransactionCategory = 'Discard' THEN t.price * t.quantity ELSE 0 END), 0) AS discards, 
      STRING_AGG(DISTINCT t.PaymentMethod, ', ') AS payment_methods 
    FROM Sales s
    LEFT JOIN Transactions t ON s.id = t.sale_id
    LEFT JOIN MenuItem mi ON t.menu_item_id = mi.ItemID
    LEFT JOIN Orders o ON o.OrderID = t.sale_id
    WHERE DATE(s.SalesTimestamp) = CURRENT_DATE 
      AND EXTRACT(HOUR FROM s.SalesTimestamp) BETWEEN $1 AND $2
    GROUP BY hour
    ORDER BY hour;
  `;

  try {
    const result = await pool.query(query, [startHour, endHour]);
    res.json(result.rows); // 返回查询结果
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch report data');
  }
});

// Z-Report API endpoint
// Z-Report API
app.get('/api/zreport', async (req, res) => {
  const { startHour, endHour } = req.query;

  console.log("Received Z-report request", { startHour, endHour });

  if (parseInt(startHour) > parseInt(endHour)) {
    return res.status(400).send('Start hour cannot be greater than end hour');
  }

  const query = `
    SELECT 
      EXTRACT(HOUR FROM s.SalesTimestamp) AS hour, 
      COUNT(DISTINCT t.id) AS total_transactions,
      COALESCE(SUM(s.total_amount), 0) AS sales_revenue,
      COALESCE(SUM(t.price * t.quantity), 0) AS total_sales,
      COALESCE(SUM(t.price * t.quantity) * 0.08, 0) AS total_tax,
      COALESCE(SUM(t.price * t.quantity) * 0.05, 0) AS service_charges,
      COALESCE(SUM(CASE WHEN t.TransactionCategory = 'Void' THEN ABS(t.price * t.quantity) ELSE 0 END), 0) AS voids,
      COALESCE(SUM(CASE WHEN t.TransactionCategory = 'Discard' THEN ABS(t.price * t.quantity) ELSE 0 END), 0) AS discards,
      COALESCE(SUM(CASE WHEN o.Rewards > 0 THEN o.Rewards ELSE 0 END), 0) AS discounts,
      STRING_AGG(DISTINCT e.EmployeeName, ', ') AS employee_signatures,
      STRING_AGG(DISTINCT t.PaymentMethod, ', ') AS payment_methods
    FROM Sales s
    LEFT JOIN Transactions t ON s.id = t.sale_id
    LEFT JOIN MenuItem mi ON t.menu_item_id = mi.ItemID
    LEFT JOIN Orders o ON o.OrderID = t.sale_id
    LEFT JOIN Employee e ON e.EmployeeID = o.UserID
    WHERE DATE(s.SalesTimestamp) = CURRENT_DATE
      AND EXTRACT(HOUR FROM s.SalesTimestamp) BETWEEN $1 AND $2
    GROUP BY hour
    ORDER BY hour;
  `;

  try {
    const result = await pool.query(query, [startHour, endHour]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Z-report data:', error);
    res.status(500).send('Error fetching report data');
  }
});
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('DB connection test failed:', err);
    res.status(500).send('Database connection error');
  }
});

// 加在 server.js 里，其他 app.use(cors()) 等配置后面

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY id DESC LIMIT 30'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});


// server.js
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({ user: payload });
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});


app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error("天气查询失败：", error.response?.data || error.message);
    res.status(500).json({ error: "获取天气失败，请检查城市名称" });
  }
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});