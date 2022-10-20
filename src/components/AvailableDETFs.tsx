import { useState, ChangeEvent } from 'react'
import map from "../chain-info/map.json"
import { Interface } from 'ethers/lib/utils'
import { useContractRead, usePrepareContractWrite, useContractWrite, useAccount } from 'wagmi'
import "./AvailableDETFs.css"
import { Progress } from './Progress'
import { Link } from 'react-router-dom'


export function AvailableDETFs() {
    const detfFactoryAddress: Array<string> = map["5777"]["detf_factory"]
    const detfOracleFactoryAddress: Array<string> = map["5777"]["detf_oracle_factory"]
    const [selectedDETFOracleAddress, setSelectedDETFOracleAddress] = useState("0xFfCCB1487c32bd782C411f19156B5A694B729f86")

    const { address } = useAccount()

    const IPolybitDETFFactory = new Interface([
        "function getListOfDETFs() external view returns (address[] memory)",
        "function createDETF(address _walletOwner,address _polybitDETFOracleAddress,uint256 _riskWeighting) external"
    ])

    const IPolybitDETFOracleFactory = new Interface([
        "function getListOfOracles() external view returns (address[] memory)"
    ])

    const IPolybitDETFOracle = new Interface([
        "function getDetfName() external view returns (string)",
        "function getTotalLiquidity() external view returns (uint256)"
    ])

    function GetListOfDETFOracles() {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: detfOracleFactoryAddress[0],
            contractInterface: IPolybitDETFOracleFactory,
            functionName: "getListOfOracles"
        })
        return data
    }
    const detfOracles = GetListOfDETFOracles()

    function GetNameOfDETF(_address: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: _address,
            contractInterface: IPolybitDETFOracle,
            functionName: "getDetfName"
        })
        const name = data ? data : ""
        return name
    }

    function GetLiquidityOfDETF(_address: string) {
        const { data, isError, isLoading } = useContractRead({
            addressOrName: _address,
            contractInterface: IPolybitDETFOracle,
            functionName: "getTotalLiquidity"
        })
        const liquidity = data ? data : "0"
        return liquidity
    }

    return (
        <>
            <div>
                <div><b>List of available DETF Strategies</b></div>
                <div>{detfOracles ? detfOracles.map(oracleAddress =>
                    <div key={oracleAddress}>
                        <div>Strategy Name: {GetNameOfDETF(oracleAddress)}</div>
                        <div>Address: {oracleAddress}</div>
                        <div>Total Liquidity: {GetLiquidityOfDETF(oracleAddress).toString()}</div>
                        <Link to="/establish-detf" state={{ detfName: GetNameOfDETF(oracleAddress), detfOracleAddress: oracleAddress, processOrigin: "establish", activeStage: 1 }}><u>Deposit</u></Link>
                    </div>)
                    : "No DETF Oracles are available."
                }
                </div >
            </div >
        </>
    )
}

