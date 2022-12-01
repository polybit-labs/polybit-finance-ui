import time
from flask import Flask, request
import get_prices
import rebalance

app = Flask(__name__)


@app.route("/api/rebalancer", methods=["POST"])
def get_current_time():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    weth_input_amount = data["weth_input_amount"]

    order_data = rebalance.rebalance(
        provider=provider,
        detf_address=detf_address,
        weth_input_amount=weth_input_amount,
    )
    print(order_data)
    return order_data  # {"data": provider}


if __name__ == "__main__":
    app.run(debug=True)
