const express = require('express');
const app = express();
const net = require('net');

// 监听端口
const PORT = 3000;

app.get('/check-port', (req, res) => {
    const port = req.query.port;

    if (!port || isNaN(port) || port < 1 || port > 65535) {
        return res.json({ success: false, message: 'Invalid port number.' });
    }

    // 创建一个 TCP 客户端来测试连接
    const socket = new net.Socket();
    socket.setTimeout(2000); // 设置超时为2秒

    socket.on('connect', () => {
        socket.end(); // 连接成功，关闭连接
        res.json({
            success: true,
            serverData: { message: '演示数据：服务器端口连接成功！', serverPort: port }
        });
    });

    socket.on('timeout', () => {
        socket.destroy();
        res.json({ success: false, message: '连接超时，无法连接到该端口！' });
    });

    socket.on('error', (err) => {
        socket.destroy();
        res.json({ success: false, message: '无法连接到该端口：' + err.message });
    });

    socket.connect(port, '127.0.0.1'); // 假设连接到本地服务器的端口
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});