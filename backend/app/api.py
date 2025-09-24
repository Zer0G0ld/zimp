import asyncio
from flask import Flask, jsonify
from app.scanner.discover import scan_network

app = Flask(__name__)

@app.get("/devices")
async def get_devices():
    devices = asyncio.run(scan_network(
        network="192.168.0.0/24",
        ping_timeout=1000,
        max_parallel=20
    ))
    return jsonify(devices)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7501, debug=True)
