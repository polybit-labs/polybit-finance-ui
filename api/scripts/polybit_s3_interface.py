import requests
from web3 import Web3
from scripts.polybit_chain_info import get_polybit_abis
import os
from pathlib import Path
import json
from scripts.utils import unix_to_datetime, datetime_to_unix

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)
S3PATH = "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/detfs/"
S3HISTPRICEPATH = (
    "https://polybit-finance.s3.ap-southeast-1.amazonaws.com/historical_prices/"
)


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


def get_product_data(url):
    print("Getting product data from S3 Bucket")

    try:
        res = requests.get(url + "/product-data.json")
        data = res.json()
        return data
    except:
        print("Could not retrieve product data from S3")
    return ""


def get_performance_data(url):
    print("Getting performance data from S3 Bucket")

    try:
        res = requests.get(url + "/performance-data.json")
        data = res.json()
        return data
    except:
        print("Could not retrieve performance data from S3")
    return ""


def get_top_detf_data():
    print("Getting top 3 data from S3 Bucket")

    top_three_return_one_week = []
    top_three_return_one_month = []
    top_three_return_three_months = []
    top_three_return_one_year = []

    try:
        res = requests.get(S3PATH + "bnb-smart-chain/top_three_return_one_week.json")
        top_three_return_one_week = res.json()
    except:
        print("Could not retrieve summary detf data from S3")
    try:
        res = requests.get(S3PATH + "bnb-smart-chain/top_three_return_one_month.json")
        top_three_return_one_month = res.json()
    except:
        print("Could not retrieve summary detf data from S3")
    try:
        res = requests.get(
            S3PATH + "bnb-smart-chain/top_three_return_three_months.json"
        )
        top_three_return_three_months = res.json()
    except:
        print("Could not retrieve summary detf data from S3")
    try:
        res = requests.get(S3PATH + "bnb-smart-chain/top_three_return_one_year.json")
        top_three_return_one_year = res.json()
    except:
        print("Could not retrieve summary detf data from S3")
    return [
        top_three_return_one_week,
        top_three_return_one_month,
        top_three_return_three_months,
        top_three_return_one_year,
    ]


def get_historical_price(date):
    date = unix_to_datetime(date)
    historical_price = []
    try:
        res = requests.get(
            S3HISTPRICEPATH + "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.json"
        )
        prices = res.json()

        for i in range(0, len(prices)):
            if prices[i]["date"] == date:
                historical_price = prices[i]
    except:
        print("Could not retrieve historical prices from S3")

    return historical_price


def get_historical_prices(date):
    date = unix_to_datetime(date)
    historical_prices = []
    try:
        res = requests.get(
            S3HISTPRICEPATH + "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.json"
        )
        historical_prices = res.json()
    except:
        print("Could not retrieve historical prices from S3")

    return historical_prices
