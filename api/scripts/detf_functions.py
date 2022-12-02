from web3 import Web3
from scripts.token_prices import get_token_prices, get_token_price
from scripts.polybit_chain_info import get_polybit_abis
from scripts.polybit_s3_interface import get_product_data
from scripts.detf_factory_functions import get_detf_accounts
import os
from pathlib import Path

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)


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


def get_target_assets(provider, detf_address):
    product_data = get_product_data(provider, detf_address)

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


def get_deposits(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    deposits = detf.functions.getDeposits().call()
    total_deposits = 0
    for i in range(0, len(deposits)):
        total_deposits = total_deposits + deposits[i]
    return deposits, total_deposits


def get_time_lock(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    time_lock = detf.functions.getTimeLock().call()
    time_lock_remaining = detf.functions.getTimeLockRemaining().call()

    return time_lock, time_lock_remaining


def get_detf_account_data(provider, wallet_owner):
    account_data = []
    detf_accounts = get_detf_accounts(provider, wallet_owner)

    for i in range(0, len(detf_accounts)):
        product_id, product_category, product_dimension = get_product_id(
            provider, detf_accounts[i]
        )
        owned_assets, owned_assets_prices = get_owned_assets(provider, detf_accounts[i])
        balance_in_weth = get_total_balance_in_weth(
            provider, detf_accounts[i], owned_assets_prices
        )
        deposits, total_deposits = get_deposits(provider, detf_accounts[i])
        time_lock, time_lock_remaining = get_time_lock(provider, detf_accounts[i])

        if total_deposits == 0:
            return_weth = 0
            return_percentage = 0
        else:
            return_weth = balance_in_weth - total_deposits
            return_percentage = return_weth / total_deposits

        account_data.append(
            {
                "detf_address": detf_accounts[i],
                "productId": product_id,
                "category": product_category,
                "dimension": product_dimension,
                "balance_in_weth": balance_in_weth,
                "deposits": deposits,
                "total_deposits": total_deposits,
                "time_lock": time_lock,
                "time_lock_remaining": time_lock_remaining,
                "return_weth": return_weth,
                "return_percentage": return_percentage,
            }
        )
    return account_data
