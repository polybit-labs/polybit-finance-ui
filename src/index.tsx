import ReactDOM from 'react-dom/client';
import App from './App';
import {
  Chain,
  WagmiConfig,
  createClient,
  configureChains,
} from 'wagmi'
//import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

window.Buffer = window.Buffer || require("buffer").Buffer;

const mainnet: Chain = {
  id: 56,
  name: "BNB Smart Chain",
  network: "BSC",
  rpcUrls: { default: "https://bsc-dataseed.binance.org/" },
  nativeCurrency: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18
  },
  blockExplorers: {
    default:
    {
      name: "bscscan.com",
      url: "https://bscscan.com"
    }
  }
};

const testnet: Chain = {
  id: 97, //97 // 0x61
  name: "tBNB Smart Chain",
  network: "BSC",
  rpcUrls: { default: "https://data-seed-prebsc-1-s1.binance.org:8545/" },
  testnet: true,
  nativeCurrency: {
    name: "Binance Coin Testnet",
    symbol: "tBNB",
    decimals: 18
  },
  blockExplorers: {
    default:
    {
      name: "bscscan.com",
      url: "https://testnet.bscscan.com"
    }
  }
};

const bscMainFork: Chain = {
  id: 5777,
  name: "tBNB Smart Chain",
  network: "BSC",
  rpcUrls: { default: "HTTP://127.0.0.1:8545" },
  testnet: true,
  nativeCurrency: {
    name: "BCS Fork",
    symbol: "BNB",
    decimals: 18
  },
};

const polybitBSCFork: Chain = {
  id: 56565656,
  name: "BNB Smart Chain",
  network: "BSC",
  rpcUrls: { default: "HTTP://13.229.230.199:8545" },
  testnet: true,
  nativeCurrency: {
    name: "BCS Fork",
    symbol: "BNB",
    decimals: 18
  },
}

const chains = [mainnet, testnet, bscMainFork, polybitBSCFork];
const infuraId = process.env.INFURA_ID;

const { provider, webSocketProvider } = configureChains(chains, [
  publicProvider(),
  infuraProvider({ apiKey: infuraId }),
  /* jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id !== bscTestnet.id) return null
      return { http: chain.rpcUrls.default }
    }
  } )*/
])

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Polybit Finance",
      },
    }),
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
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

