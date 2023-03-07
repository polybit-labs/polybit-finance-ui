import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains, } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { bsc, bscTestnet } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'

window.Buffer = window.Buffer || require("buffer").Buffer;

const { chains, provider, webSocketProvider } = configureChains(
  [bscTestnet],
  [publicProvider()],
)
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Polybit Finance",
      },
    }),
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains: [bsc, bscTestnet],
      options: {
        projectId: "7e8202633169de49f617fc735aef0b0d",
        showQrModal: true
      },
    }),
    new WalletConnectLegacyConnector({
      chains: [bsc, bscTestnet],
      options: {
        qrcode: true
      },
    })
  ],
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <WagmiConfig client={client}>
    <App />
  </WagmiConfig>
);

