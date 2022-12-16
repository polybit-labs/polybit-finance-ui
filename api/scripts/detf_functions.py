from web3 import Web3
from scripts.token_prices import get_token_prices, get_token_price
from scripts.polybit_chain_info import get_polybit_abis
from scripts.polybit_s3_interface import (
    get_product_data,
    get_product_url,
    get_historical_price,
)
from scripts.detf_factory_functions import get_detf_accounts
from scripts.utils import datetime_to_unix, unix_to_datetime
import os
from pathlib import Path
from datetime import datetime

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)


def get_owner(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    owner = detf.functions.walletOwner().call()

    return owner


def get_status(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    status = detf.functions.getDETFStatus().call()

    return status


def get_product_id(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    product_id = detf.functions.getProductId().call()
    product_category = detf.functions.getProductCategory().call()
    product_dimension = detf.functions.getProductDimension().call()

    return product_id, product_category, product_dimension


def get_owned_assets(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    owned_assets = detf.functions.getOwnedAssets().call()
    owned_assets_prices = get_token_prices(owned_assets)

    return owned_assets, owned_assets_prices


def get_owned_assets_detailed(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    owned_assets = detf.functions.getOwnedAssets().call()

    if len(owned_assets) > 0:
        owned_assets_prices = get_token_prices(owned_assets)
        owned_assets_balances = []

        total_balance = 0
        for i in range(0, len(owned_assets)):
            token_balance, token_balance_in_weth = detf.functions.getTokenBalance(
                owned_assets[i], owned_assets_prices[i]
            ).call()
            owned_assets_balances.append(token_balance_in_weth)
            total_balance = total_balance + token_balance_in_weth

        owned_assets_weights = []
        for i in range(0, len(owned_assets_balances)):
            token_weight = owned_assets_balances[i] / total_balance
            owned_assets_weights.append(token_weight)

    owned_assets_detailed = []

    for i in range(0, len(owned_assets)):
        owned_assets_detailed.append(
            {
                "token_address": owned_assets[i],
                "token_weight": owned_assets_weights[i],
                "token_price": owned_assets_prices[i],
                "token_balance": owned_assets_balances[i],
            }
        )

    return owned_assets_detailed


def get_target_assets(provider, detf_address):
    url = get_product_url(provider, detf_address)
    product_data = get_product_data(url)

    target_assets = []
    target_assets_weights = []
    target_assets_prices = []

    for i in range(0, len(product_data["tokens"])):
        target_assets.append(product_data["tokens"][i]["address"])
        target_assets_weights.append(
            int(10**8 * product_data["tokens"][i]["dimension"]["weight"])
        )
        target_assets_prices.append(
            get_token_price(product_data["tokens"][i]["address"])
        )
    return target_assets, target_assets_weights, target_assets_prices


def get_total_balance_in_weth(provider, detf_address, owned_assets_prices):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    balance_in_weth = detf.functions.getTotalBalanceInWeth(owned_assets_prices).call()
    return balance_in_weth


def get_final_balance_in_weth(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    final_balance_in_weth = detf.functions.getFinalBalance().call()
    return final_balance_in_weth


def get_deposits(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    deposits = detf.functions.getDeposits().call()
    total_deposits = 0
    print(deposits)
    for i in range(0, len(deposits)):
        total_deposits = total_deposits + int(deposits[i][1])
    return deposits, total_deposits


def get_time_lock(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    time_lock = detf.functions.getTimeLock().call()
    time_lock_remaining = detf.functions.getTimeLockRemaining().call()

    return time_lock, time_lock_remaining


def get_detf_timestamps(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    creation_timestamp = detf.functions.getCreationTimestamp().call()
    close_timestamp = detf.functions.getCloseTimestamp().call()

    return creation_timestamp, close_timestamp


def get_detf_account_data(provider, wallet_owner):
    account_data = []
    detf_accounts = get_detf_accounts(provider, wallet_owner)

    for i in range(0, len(detf_accounts)):
        status = get_status(provider, detf_accounts[i])
        creation_timestamp, close_timestamp = get_detf_timestamps(
            provider, detf_accounts[i]
        )
        print("STATUS",status)
        product_id, product_category, product_dimension = get_product_id(
            provider, detf_accounts[i]
        )
        print("PRODUCT",product_category, product_dimension)

        owned_assets, owned_assets_prices = get_owned_assets(provider, detf_accounts[i])
        balance_in_weth = get_total_balance_in_weth(
            provider, detf_accounts[i], owned_assets_prices
        )
        deposits, total_deposits = get_deposits(provider, detf_accounts[i])
        time_lock, time_lock_remaining = get_time_lock(provider, detf_accounts[i])

        return_weth = 0
        return_percentage = 0
        if (status == 1) & (total_deposits > 0):
            return_weth = balance_in_weth - total_deposits
            return_percentage = return_weth / total_deposits

        final_return_weth = 0
        final_return_percentage = 0
        final_return = {}

        final_balance_in_weth = get_final_balance_in_weth(provider, detf_accounts[i])
        if (status == 0) & (total_deposits > 0):
            final_return_weth = final_balance_in_weth - total_deposits
            final_return_percentage = final_return_weth / total_deposits
            prices = get_historical_price(close_timestamp)
            final_return = {
                "aud": final_return_weth / 10**18 * prices["aud"],
                "bnb": final_return_weth / 10**18 * prices["bnb"],
                "cny": final_return_weth / 10**18 * prices["cny"],
                "eur": final_return_weth / 10**18 * prices["eur"],
                "idr": final_return_weth / 10**18 * prices["idr"],
                "jpy": final_return_weth / 10**18 * prices["jpy"],
                "krw": final_return_weth / 10**18 * prices["krw"],
                "rub": final_return_weth / 10**18 * prices["rub"],
                "twd": final_return_weth / 10**18 * prices["twd"],
                "usd": final_return_weth / 10**18 * prices["usd"],
            }

        account_data.append(
            {
                "detf_address": detf_accounts[i],
                "product_id": product_id,
                "category": product_category,
                "dimension": product_dimension,
                "status": status,
                "creation_timestamp": creation_timestamp,
                "close_timestamp": close_timestamp,
                "balance_in_weth": balance_in_weth,
                "deposits": deposits,
                "total_deposits": total_deposits,
                "time_lock": time_lock,
                "time_lock_remaining": time_lock_remaining,
                "return_weth": return_weth,
                "return_percentage": return_percentage,
                "final_return_weth": final_return_weth,
                "final_return_percentage": final_return_percentage,
                "final_return": final_return,
                "final_balance_in_weth": final_balance_in_weth,
            }
        )
    return account_data
