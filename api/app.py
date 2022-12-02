import time
from flask import Flask, request
from scripts import rebalance
from scripts.token_prices import get_token_price, get_token_prices
from scripts.rebalance import rebalance
from scripts.detf_functions import (
    get_owned_assets,
    get_target_assets,
    get_detf_account_data,
)
from scripts.detf_factory_functions import get_detf_accounts
from scripts.polybit_s3_interface import get_product_data, get_performance_data

app = Flask(__name__)


@app.route("/api/rebalancer", methods=["POST"])
def rebalancer():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    weth_input_amount = data["weth_input_amount"]

    order_data = rebalance(
        provider=provider,
        detf_address=detf_address,
        weth_input_amount=weth_input_amount,
    )
    return order_data  # {"data": provider}


@app.route("/api/get_price", methods=["POST"])
def get_price():
    data = request.json
    price = get_token_price(data["token_address"])
    return {"token_price": price}


@app.route("/api/get_prices", methods=["POST"])
def get_prices():
    data = request.json
    prices = get_token_prices(data)
    return prices


@app.route("/api/get_detf_accounts", methods=["POST"])
def get_detfs_accounts_data():
    data = request.json
    provider = data["rpc_provider"]
    wallet_owner = data["wallet_owner"]
    detfs = get_detf_accounts(provider=provider, wallet_owner=wallet_owner)
    return detfs


@app.route("/api/get_detf_accounts_data", methods=["POST"])
def get_detf_accounts_data():
    data = request.json
    provider = data["rpc_provider"]
    wallet_owner = data["wallet_owner"]
    account_data = get_detf_account_data(provider=provider, wallet_owner=wallet_owner)
    return account_data


@app.route("/api/get_owned_assets", methods=["POST"])
def get_owned_assets_data():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    (
        owned_assets,
        owned_assets_prices,
    ) = get_owned_assets(provider=provider, detf_address=detf_address)
    return [owned_assets, owned_assets_prices]


@app.route("/api/get_target_assets", methods=["POST"])
def get_target_assets_data():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    print("Target Assets Request", data)
    target_assets, target_assets_weights, target_assets_prices = get_target_assets(
        provider=provider, detf_address=detf_address
    )
    print("Target Assets", target_assets)
    print("Target Assets Weights", target_assets_weights)
    print("Target Assets Prices", target_assets_prices)
    return [target_assets, target_assets_weights, target_assets_prices]


@app.route("/api/get_product_data", methods=["POST"])
def get_product_data_from_s3():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    product_data = get_product_data(provider=provider, detf_address=detf_address)
    return product_data


@app.route("/api/get_performance_data", methods=["POST"])
def get_performance_data_from_s3():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    performance_data = get_performance_data(
        provider=provider, detf_address=detf_address
    )
    return performance_data


app.run()
