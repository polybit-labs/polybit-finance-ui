import os
from pathlib import Path
import json

PATH = str(Path(os.path.abspath(os.path.dirname(__file__))).parent.parent)


def get_polybit_addresses():
    f = open(PATH + "/src/chain_info/polybitAddresses.json")
    json_file = json.load(f)
    rebalancer_address = json_file["56"]["rebalancer"]
    router_address = json_file["56"]["router"]
    detf_factory_address = json_file["56"]["detf_factory"]

    return rebalancer_address, router_address, detf_factory_address


def get_polybit_abis():
    # IPolybitDETF
    f = open(PATH + "/src/chain_info/IPolybitDETF.json")
    IPolybitDETF = json.load(f)

    # IPolybitDETFFactory
    f = open(PATH + "/src/chain_info/IPolybitDETFFactory.json")
    IPolybitDETFFactory = json.load(f)

    # IPolybitRebalancer
    f = open(PATH + "/src/chain_info/IPolybitRebalancer.json")
    IPolybitRebalancer = json.load(f)

    # IPolybitRouter
    f = open(PATH + "/src/chain_info/IPolybitRouter.json")
    IPolybitRouter = json.load(f)

    return IPolybitDETF, IPolybitDETFFactory, IPolybitRebalancer, IPolybitRouter
