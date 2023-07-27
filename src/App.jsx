import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectButton, useWallet } from '@suiet/wallet-kit'
import { JsonRpcProvider, devnetConnection, testnetConnection, mainnetConnection, TransactionBlock } from '@mysten/sui.js';

function App() {

  /**
   * Style
   */
  const displayBlock = {
    display: 'block'
  }

  const displayNone = {
    display: 'none'
  }

  const wallet = useWallet()

  /**
   * sui fullnode rpc url
   */
  const devRpcUrl = "https://fullnode.devtnet.sui.io";
  const testRpcUrl = "https://fullnode.testnet.sui.io";
  const mainRpcUrl = "https://fullnode.mainnet.sui.io";

  // connect to Testnet
  const provider = new JsonRpcProvider(testnetConnection);

  // owend Objects
  const [owendObjects, setOwendObjects] = useState("");

  // object
  const [object, setObject] = useState("");
  const [objectId, setObjectId] = useState("0xdacd23ce2857df4c8748dd295f9652fef7e56404d2c45482e2a3c1bdd8646848");

  // dynamic Fields
  const [dynamicFields, setDynamicFields] = useState("");
  const [parentId, setParentId] = useState("");

  // dynamic Field Object
  const [dynamicFieldObject, setDynamicFieldObject] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  const [coins, setCoins] = useState("");
  const [coinType, setCoinType] = useState("0x2::sui::SUI");

  const [splitAmount, setSplitAmount] = useState(0);

  // pretty json format
  const jsonFormat = (str) => {
    return JSON.stringify(str, null, 2);
  }

  const getOwnedObjectsFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      provider.getOwnedObjects({
        owner: wallet?.account?.address,
        options: {
          showType: true,
          showOwner: true,
          showContent: true,
        }
      }).then(data => {
        console.log("getOwnedObjectsFunction");
        console.log(data);
        setOwendObjects(jsonFormat(data.data));
      });
    }
  }

  const getObjectFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      provider.getObject({
        id: objectId,
        options: {
          showType: true,
          showOwner: true,
          showContent: true,
        }
      }).then(data => {
        console.log("getObjectFunction");
        console.log(data);
        setObject(jsonFormat(data.data));
      });
    }
  }

  const changeObjectId = (e) => {
    setObjectId(e.target.value);
  }

  const getDynamicFieldsFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      provider.getDynamicFields({
        parentId: parentId,
      }).then(data => {
        console.log("getDynamicFieldsFunction");
        console.log(data);
        setDynamicFields(jsonFormat(data.data));
      });
    }
  }

  const changeParentId = (e) => {
    setParentId(e.target.value);
  }

  const getDynamicFieldObjectFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      provider.getDynamicFieldObject({
        parentId: parentId,
        name: {
          type: type,
          value: value
        }
      }).then(data => {
        console.log("getDynamicFieldObjectFunction");
        console.log(data);
        setDynamicFieldObject(jsonFormat(data.data));
      });
    }
  }

  const changeType = (e) => {
    setType(e.target.value);
  }
  const changeValue = (e) => {
    setValue(e.target.value);
  }

  const getCoinsFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      provider.getCoins({
        // coinType: coinType,
        owner: wallet?.address,
      }).then(data => {
        console.log("getCoinsFunction");
        console.log(data);
        setCoins(jsonFormat(data.data));
      });
    }
  }

  const changeCoinType = (e) => {
    setCoinType(e.target.value);
  }

  const splitCoinFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      let txObj = new TransactionBlock();

      let [coins] = txObj.splitCoins(txObj.gas, [txObj.pure(splitAmount*1000000000)]);

      txObj.transferObjects([coins], txObj.pure(wallet.account.address));

      wallet.signAndExecuteTransactionBlock({
        transactionBlock: txObj,
        options: { showEffects: true },
      }).then(data => {
        console.log("splitCoinFunction");
        console.log(data);
      });
    }
  }

  const changeSplitAmount = (e) => {
    setSplitAmount(e.target.value);
  }

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <ConnectButton />
      <div style={{ ...wallet?.connected ? displayBlock : displayNone }}>
        <p>錢包連線狀態 : {wallet?.status}</p>
        <p>連線網路名稱 : {wallet?.chain.name}</p>
        <p>錢包地址 : {wallet?.account?.address}</p>
      </div>

      <div style={{ ...wallet?.connected ? displayBlock : displayNone }}>

        {/* getOwnedObjects */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>get Owned Objects</h3>
          <p><button onClick={getOwnedObjectsFunction}>get Owned Objects</button></p>
          <textarea
            style={{ ...owendObjects ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={owendObjects}></textarea>
        </div>

        {/* getObject */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>get Object</h3>
          <p>input object id : <input onChange={changeObjectId} style={{ width: '500px' }} value={objectId} /></p>
          <p><button onClick={getObjectFunction}>get Object</button></p>
          <textarea
            style={{ ...object ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={object}></textarea>
        </div>

        {/* getDynamicFields */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>get Dynamic Fields</h3>
          <p>input parent id : <input onChange={changeParentId} style={{ width: '500px' }} value={parentId} /></p>
          <p><button onClick={getDynamicFieldsFunction}>get Dynamic Fields</button></p>
          <textarea
            style={{ ...dynamicFields ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={dynamicFields}></textarea>
        </div>

        {/* getDynamicFieldObject */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>get Dynamic Field Object</h3>
          <p>input parent id : <input onChange={changeParentId} style={{ width: '500px' }} value={parentId} /></p>
          <p>input type : <input onChange={changeType} style={{ width: '500px' }} value={type} /></p>
          <p>input value : <input onChange={changeValue} style={{ width: '500px' }} value={value} /></p>
          <p><button onClick={getDynamicFieldObjectFunction}>get Dynamic Field Object</button></p>
          <textarea
            style={{ ...dynamicFieldObject ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={dynamicFieldObject}></textarea>
        </div>

        {/* getCoins */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>get Coins</h3>
          <p>input coin type : <input onChange={changeCoinType} style={{ width: '500px' }} value={coinType} /></p>
          <p><button onClick={getCoinsFunction}>get Coins</button></p>
          <textarea
            style={{ ...coins ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={coins}></textarea>
        </div>

        {/* splitCoin */}
        <div style={{ border: 'groove', marginBottom: '20px' }}>
          <h3>split Coin</h3>
          <p>input split amount : <input onChange={changeSplitAmount} style={{ width: '500px' }} value={splitAmount} /></p>
          <p><button onClick={splitCoinFunction}>split Coin</button></p>
          {/* <textarea
            style={{ ...dynamicFieldObject ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={dynamicFieldObject}></textarea> */}
        </div>

      </div>

    </div >
  )
}

export default App
