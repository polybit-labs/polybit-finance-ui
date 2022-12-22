from flask import Flask, request
from scripts.token_prices import (
    get_token_price,
    get_token_prices,
    get_token_price_vs_currency,
)
from scripts.rebalance import rebalance
from scripts.sell_to_close import sell_to_close
from scripts.first_deposit import first_deposit
from scripts.detf_functions import (
    get_owned_assets,
    get_owned_assets_detailed,
    get_target_assets,
    get_detf_account_data,
    get_detf_account_data_all,
    get_owner,
    get_status,
)
from scripts.detf_factory_functions import get_detf_accounts
from scripts.polybit_s3_interface import (
    get_product_data,
    get_performance_data,
    get_performance_data_range,
    get_top_detf_data,
    get_historical_prices,
)

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
    return order_data


@app.route("/api/get_price", methods=["POST"])
def get_price():
    data = request.json
    token_address = data["token_address"]
    price = get_token_price(token_address)
    return {"token_price": price}


@app.route("/api/get_price_vs_currency", methods=["POST"])
def get_price_vs_currency():
    data = request.json
    token_address = data["token_address"]
    prices = get_token_price_vs_currency(token_address)
    return prices


@app.route("/api/get_prices", methods=["POST"])
def get_prices():
    data = request.json
    prices = get_token_prices(data)
    return prices


@app.route("/api/get_historical_prices", methods=["POST"])
def get_historical_prices_data():
    data = request.json
    date = data["date"]
    prices = get_historical_prices(date)
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
    detf_address = data["detf_address"]
    account_data = get_detf_account_data(provider=provider, detf_address=detf_address)
    return account_data

@app.route("/api/get_detf_accounts_data_all", methods=["POST"])
def get_detf_accounts_data_all():
    data = request.json
    provider = data["rpc_provider"]
    wallet_owner = data["wallet_owner"]
    account_data = get_detf_account_data_all(provider=provider, wallet_owner=wallet_owner)
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


@app.route("/api/get_owned_assets_detailed", methods=["POST"])
def get_owned_assets_detailed_data():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    owned_assets_detailed = get_owned_assets_detailed(
        provider=provider, detf_address=detf_address
    )
    return owned_assets_detailed


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
    url = data["url"]
    product_data = get_product_data(url=url)
    return product_data


@app.route("/api/get_performance_data", methods=["POST"])
def get_performance_data_from_s3():
    data = request.json
    url = data["url"]
    performance_data = get_performance_data(url=url)
    return performance_data

get_performance_data_range
@app.route("/api/get_performance_data_range", methods=["POST"])
def get_performance_data_range_from_s3():
    data = request.json
    url = data["url"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    performance_data_range = get_performance_data_range(url=url,start_date=start_date,end_date=end_date)
    return performance_data_range

@app.route("/api/get_top_detf_data")
def get_top_detf_data_from_s3():
    detf_data = get_top_detf_data()
    return detf_data


@app.route("/api/get_owner", methods=["POST"])
def get_owned_address():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    owner = get_owner(provider=provider, detf_address=detf_address)
    return {"owner": owner}


@app.route("/api/get_status", methods=["POST"])
def get_detf_status():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]
    status = get_status(provider=provider, detf_address=detf_address)
    return {"status": status}


@app.route("/api/sell_to_close", methods=["POST"])
def sell_to_close_order():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]

    order_data = sell_to_close(
        provider=provider,
        detf_address=detf_address,
    )
    return order_data

@app.route("/api/first_deposit", methods=["POST"])
def first_deposit_order():
    data = request.json
    provider = data["rpc_provider"]
    detf_address = data["detf_address"]

    order_data = first_deposit(
        provider=provider,
        detf_address=detf_address,
    )
    return order_data