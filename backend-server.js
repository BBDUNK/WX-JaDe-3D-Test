// backend-server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // 在Vercel上，这个端口号会被自动覆盖，所以写多少都行

// 使用中间件
app.use(cors()); // 允许所有跨域请求
app.use(express.json()); // 解析JSON格式的请求体

// 一个“内存数据库”，用来存储订单
let ordersDB = [];
let nextOrderId = 1;

// =======================【新增代码】=======================
// 为根路径 / 添加一个欢迎页面
// 当有人直接访问您的 Vercel 网址时，就会看到这个信息
app.get('/', (req, res) => {
  res.status(200).send(
    '<h1>欢迎来到3D打印订单API服务！</h1><p>后端服务运行正常。请使用 /api/orders 路径进行交互。</p>'
  );
});
// =====================【新增代码结束】=====================


// --- API 路由 ---

// 1. 处理创建新订单的POST请求
app.post('/api/orders', (req, res) => {
  console.log('收到新的订单请求体:', req.body);
  const { userId, modelFile, material, quantity } = req.body;

  // 简单的验证
  if (!userId || !modelFile || !material || !quantity) {
    return res.status(400).json({ error: '请求缺少必要的订单信息' });
  }

  const newOrder = {
    id: nextOrderId++,
    userId,
    modelFile,
    material,
    quantity,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  ordersDB.push(newOrder);
  console.log('创建新订单成功:', newOrder);

  // 返回 201 Created 状态码和新创建的订单信息
  res.status(201).json(newOrder);
});

// 2. 处理获取所有订单的GET请求
app.get('/api/orders', (req, res) => {
  console.log('收到获取所有订单的请求');
  res.status(200).json(ordersDB);
});


// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 后端服务器已启动，正在监听所有网络接口的 ${PORT} 端口...`);
});