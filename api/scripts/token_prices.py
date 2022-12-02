from dotenv import load_dotenv
import os
from pathlib import Path
import requests

path = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)
load_dotenv(dotenv_path=path + "/.env", verbose=True)

api_key = os.getenv("REACT_APP_COINGECKO_API_KEY")


def get_token_price(token):
    print("Getting token price from CoinGecko")
    url = (
        "https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/"
        + token.lower()
        + "?x_cg_pro_api_key="
        + api_key
    )
    try:
        res = requests.get(url)
        data = res.json()
        price = int(10**18 * data["market_data"]["current_price"]["bnb"])
        print(price)
        return price
    except:
        print("Could not retrieve data for", token)
    return ""


def get_token_prices(tokens):
    prices = []
    if tokens != []:
        print("Getting list of token prices from CoinGecko")
        for i in range(0, len(tokens)):
            url = (
                "https://pro-api.coingecko.com/api/v3/coins/binance-smart-chain/contract/"
                + tokens[i].lower()
                + "?x_cg_pro_api_key="
                + api_key
            )
            try:
                res = requests.get(url)
                data = res.json()
                price = int(10**18 * data["market_data"]["current_price"]["bnb"])
                prices.append(price)
            except:
                print("Could not retrieve data for", prices[i])
                continue
    return prices
