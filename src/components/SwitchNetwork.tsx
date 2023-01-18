import { useState } from 'react'
import { useSwitchNetwork, useDisconnect } from 'wagmi'
import { Button } from './Button'
import { Connect } from './Connect'

export const SwitchNetwork = () => {
    const { disconnect } = useDisconnect()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    return (
        <>
            <div>
                <div><b>Check your network</b></div>
                <div>Currently Polybit is only supported on the BNB Smart Chain.</div>
                <div>[Warning] Please switch your network to continue</div>
                <div>
                    {<Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" onClick={() => switchNetwork?.(97)} />}
                    {!switchNetwork && <Button buttonStyle="primary" buttonSize="standard" text="Switch network in wallet" status="disabled" />}
                    {/*  {
                            chains.map((x) => (
                                <button
                                    disabled={!switchNetwork || x.id === chain?.id}
                                    key={x.id}
                                    onClick={() => switchNetwork?.(x.id)}
                                >
                                    {x.name}
                                    {isLoading && pendingChainId === x.id && ' (switching)'}
                                </button>
                            ))
                        } */}
                </div>
                <div>
                    {<Button buttonStyle="primary" buttonSize="standard" text="Disconnect Wallet" onClick={() => disconnect()} />}
                </div>
            </div>
            <div>{error && error.message}</div>
        </>
    )
}