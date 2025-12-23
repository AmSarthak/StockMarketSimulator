# 📈 Real-Time Stock Market Simulator (WebSocket + REST)

This project is a **real-time stock price simulation backend** built with **Node.js**, **Express**, and **WebSockets**.

It continuously updates stock prices at a fixed interval and broadcasts changes to all connected clients via WebSockets, while also exposing REST APIs as a fallback for polling-based clients.

Designed for:
- Frontend real-time charting practice
- WebSocket integration testing
- System design & interview preparation
- Learning push vs pull data models

---

## 🚀 Features

- ✅ Real-time stock price updates using WebSockets
- ✅ REST API fallback for fetching prices and history
- ✅ In-memory state management using Maps
- ✅ Rolling price history per stock (last 50 ticks)
- ✅ CORS enabled for frontend consumption
- ✅ Clean event-based WebSocket protocol

---

## 🧱 Architecture Overview


---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **ws** (WebSocket library)
- **CORS**
- No database (in-memory for simplicity)

---

## 📊 Stock Data Model

Each stock maintains:
- **Current LTP**
- **Rolling history (last 50 prices)**

```js
Map<ticker, LTP>
Map<ticker, number[]>

🌐 REST APIs
Get all tickers

GET /getTickers


Response:

[
  ["INFY", 1450],
  ["TCS", 3620]
]

Get current price of a stock

GET /getprice/:ticker


Response:

{
  "ticker": "INFY",
  "ltp": 1453,
  "timeStamp": 1730000000500
}

Get price history of a stock

GET /gethistory/:ticker


Response:

{
  "ticker": "INFY",
  "ltp": [1448, 1450, 1453, ...]
}