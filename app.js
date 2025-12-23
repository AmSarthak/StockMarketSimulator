const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const stockData = require('./data.js')
const cors = require('cors')

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({
    server
});

/** ===== STOCK STATE ===== */
const stockMap = new Map();

const historyData = new Map();

for (let i in stockData) {
    stockMap.set(stockData[i].ticker, stockData[i].LTP)
    historyData.set(stockData[i].ticker, [])
}

/** ===== REST (optional fallback) ===== */
app.get("/getTickers", (_, res) => {
    res.json(Array.from(stockMap));
});

app.get("/gethistory/:ticker", (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    res.json({
        ticker,
        ltp: historyData.get(ticker),
    });

});

app.get("/getprice/:ticker", (req, res) => {
    const ticker = req.params.ticker.toUpperCase();

    if (!stockMap.has(ticker)) {
        return res.status(404).json({
            error: "STOCK_NOT_FOUND",
            message: "Requested ticker does not exist",
        });
    }

    res.json({
        ticker,
        ltp: stockMap.get(ticker),
        timeStamp: Date.now(),
    });
});

function broadcast(data) {
    const payload = JSON.stringify(data);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

setInterval(() => {
    stockMap.forEach((value, key) => {
        const change = Math.floor(Math.random() * 21) - 10;
        stockMap.set(key, Math.abs(value + change));
        const lastVal = historyData.get(key);
        lastVal.push(Math.abs(value + change))
        if (lastVal.length == 51) {
            lastVal.shift();
        }
        historyData.set(key, lastVal)
    });

    broadcast({
        type: "TICKERS_UPDATE",
        data: Array.from(stockMap),
        timestamp: Date.now(),
    });

}, 500);

wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.send(JSON.stringify({
        type: "INIT",
        data: Array.from(stockMap),
        timestamp: Date.now(),
    }));

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(3002, () => {
    console.log("Server running on port 3002");
});