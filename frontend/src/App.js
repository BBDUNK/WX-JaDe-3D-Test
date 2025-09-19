
import React, { useState } from 'react';
// 为了让表单好看一点，我们可以创建一个 App.css 文件并添加一些样式
import './App.css'; 

function App() {
  // --- 1. 使用 useState 来创建组件的“记忆” ---
  // 分别用来记住用户选择的文件、材料和数量
  const [modelFile, setModelFile] = useState(null);
  const [material, setMaterial] = useState('PLA');
  const [quantity, setQuantity] = useState(1);

  // 用来显示操作反馈信息，比如“提交成功！”
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. 定义事件处理函数 ---

  // 当用户选择了文件时，更新 modelFile 的“记忆”
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setModelFile(e.target.files[0]);
    }
  };

  // 当用户点击“提交订单”按钮时执行
  // 注意这里的 `async` 关键字，它是使用 `await` 的前提
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认的刷新页面行为
    if (!modelFile) {
      alert('请先上传您的3D模型文件。');
      return;
    }

    setIsSubmitting(true);
    setFeedback('正在提交订单...');

    const orderData = {
      userId: 101, // 这里暂时写死，真实应用中会从登录信息获取
      modelFile: modelFile.name,
      material: material,
      quantity: parseInt(quantity),
    };

    // --- 3. 连接后端的真实请求 ---
    try {
      // 我们后端的地址
      const API_ENDPOINT = 'http://localhost:3001/api/orders';

      // 使用 fetch 函数向后端发送 POST 请求
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 告诉后端我们发送的是JSON
        },
        body: JSON.stringify(orderData), // 把我们的JS对象转换成JSON字符串
      });

      // 如果后端没有返回成功状态 (比如 200, 201), 就抛出一个错误
      if (!response.ok) {
        throw new Error('订单提交失败，请检查后端服务器是否正在运行！');
      }

      // 解析后端返回的 JSON 数据
      const result = await response.json();
      setFeedback(`✅ 真实订单提交成功！订单号: #${result.id}`);

    } catch (error) {
      console.error("提交出错:", error);
      setFeedback(`❌ 提交失败: ${error.message}`);
    } finally {
      // 无论成功还是失败，最后都要把按钮变回可点击状态
      setIsSubmitting(false);
    }
  };


  // --- 4. 返回要渲染到页面上的HTML结构 (JSX) ---
  return (
    <div className="App">
      <div className="form-container">
        <h2>提交您的3D打印订单</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>1. 上传模型文件 (.stl, .obj)</label>
            <input type="file" onChange={handleFileChange} accept=".stl,.obj" required />
          </div>
          
          <div className="form-group">
            <label>2. 选择材料</label>
            <select value={material} onChange={(e) => setMaterial(e.target.value)}>
              <option value="PLA">PLA (通用)</option>
              <option value="ABS">ABS (耐用)</option>
              <option value="PETG">PETG (坚韧)</option>
            </select>
          </div>

          <div className="form-group">
            <label>3. 输入数量</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '正在提交...' : '提交订单'}
          </button>
          
          {feedback && <p className="feedback">{feedback}</p>}
        </form>
      </div>
    </div>
  );
}

/*
  可选步骤: 创建一个 `src/App.css` 文件，把下面的样式代码粘贴进去，可以让页面更好看。
  
  .App {
    font-family: sans-serif;
    text-align: center;
  }

  .form-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background-color: #f9f9f9;
  }

  h2 {
    margin-bottom: 25px;
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #0056b3;
  }

  button:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }

  .feedback {
    margin-top: 20px;
    font-weight: bold;
  }
*/

export default App;

