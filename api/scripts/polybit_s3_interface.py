import requests
from web3 import Web3
from scripts.polybit_chain_info import get_polybit_abis
import os
from pathlib import Path
import json

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)
S3PATH = "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/"


def get_product_url(provider, detf_address):
    w3 = Web3(Web3.HTTPProvider(provider))
    (detf_abi, detf_factory_abi, rebalancer_abi, router_abi) = get_polybit_abis()
    detf = w3.eth.contract(address=detf_address, abi=detf_abi)

    product_id = detf.functions.getProductId().call()

    f = open(PATH + "/src/product/detfIndex.json")
    detfIndex = json.load(f)

    for i in range(0, len(detfIndex)):
        if detfIndex[i]["productId"] == product_id:
            urlChainId = detfIndex[i]["urlChainId"]
            urlCategoryId = detfIndex[i]["urlCategoryId"]
            urlDimensionId = detfIndex[i]["urlDimensionId"]

    product_data_file_url = (
        S3PATH + str(urlChainId) + "/" + str(urlCategoryId) + "/" + str(urlDimensionId)
    )
    return product_data_file_url


def get_product_data(provider, detf_address):
    print("Getting product data from S3 Bucket")
    url = get_product_url(provider, detf_address)

    try:
        res = requests.get(url + "/product-data.json")
        data = res.json()
        return data
    except:
        print("Could not retrieve product data from S3")
    return ""


def get_performance_data(provider, detf_address):
    print("Getting performance data from S3 Bucket")
    url = get_product_url(provider, detf_address)

    try:
        res = requests.get(url + "/performance-data.json")
        data = res.json()
        return data
    except:
        print("Could not retrieve performance data from S3")
    return ""
