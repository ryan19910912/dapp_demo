import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectButton, useWallet } from '@suiet/wallet-kit'
import { JsonRpcProvider, devnetConnection, testnetConnection, mainnetConnection } from '@mysten/sui.js';

function App() {

  const wallet = useWallet()

  /**
   * sui fullnode rpc url
   */
  const devRpcUrl = "https://fullnode.devtnet.sui.io";
  const testRpcUrl = "https://fullnode.testnet.sui.io";
  const mainRpcUrl = "https://fullnode.mainnet.sui.io";

  // connect to Testnet
  const provider = new JsonRpcProvider(devnetConnection);

  const jsonFormat = (str) => {
    return JSON.stringify(str, null, 2);
  }

  provider.getOwnedObjects({
    owner: "0x7e37a75bde4fbb88dd3c815bf892fe04369b9900481ee0d60747d9ba77ad215d",
    options: {
      showType: true,
      showDisplay: true,
      showContent: true,
    }
  }).then(data => {
    console.log("data = " + jsonFormat(data));
  });

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <ConnectButton />
      <p>錢包連線狀態 : {wallet?.status}</p>
      <p>連線網路名稱 : {wallet?.chain.name}</p>
      <p>錢包地址 : {wallet?.account?.address}</p>
    </div>
  )
}

export default App
