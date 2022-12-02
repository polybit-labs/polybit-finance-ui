from web3 import Web3
from scripts.polybit_chain_info import get_polybit_abis, get_polybit_addresses
import os
from pathlib import Path

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)


def get_detf_accounts(provider, wallet_owner):
    w3 = Web3(Web3.HTTPProvider(provider))
    (rebalancer_address, router_address, detf_factory_address) = get_polybit_addresses()
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()

    detf_factory = w3.eth.contract(address=detf_factory_address, abi=detf_factory_abi)
    detfs = detf_factory.functions.getDETFAccounts(wallet_owner).call()
    return detfs
