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
  const [structType, setStructType] = useState("0x727ce1d17ad799557e36756bcf9072eefc4826e6d2d18915bb2e9476dfba7675::puddle::PuddleCap");

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

  const [splitResult, setSplitResult] = useState("");
  const [splitCoin, setSplitCoin] = useState("");
  const [splitAmount, setSplitAmount] = useState(0);

  const [mergeResult, setMergeResult] = useState("");
  const [mainCoin, setMainCoin] = useState("");
  const [mergeCoin, setMergeCoin] = useState("");

  const [moveCallResult, setMoveCallResult] = useState("");
  const [packageId, setPackageId] = useState("0x727ce1d17ad799557e36756bcf9072eefc4826e6d2d18915bb2e9476dfba7675");
  const [moduleName, setModuleName] = useState("puddle");
  const [functionName, setFunctionName] = useState("create_puddle");

  const [name, setName] = useState("Test Demo Puddle");
  const [desc, setDesc] = useState("Test Demo Puddle");
  const [trader, setTrader] = useState(wallet?.account?.address);
  const [commissionPercentage, setCommissionPercentage] = useState("5");
  const [maxSupply, setMaxSupply] = useState("1000");

  // pretty json format
  const jsonFormat = (str) => {
    return JSON.stringify(str, null, 2);
  }

  const getOwnedObjectsFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      setOwendObjects("");

      let ownedObject = {
        owner: wallet?.account?.address,
        options: {
          showType: true,
          showOwner: true,
          showContent: true,
        }
      }
      if (structType !== ""){
        ownedObject.filter = {
          MatchAny: [
            {
              StructType: structType
            }
          ]
        }
      }
      provider.getOwnedObjects(
        ownedObject
      ).then(data => {
        console.log("getOwnedObjectsFunction");
        console.log(data);
        setOwendObjects(jsonFormat(data.data));
      });
    }
  }

  const changeStructType = (e) => {
    setStructType(e.target.value);
  }

  const getObjectFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      setObject("");
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
      setDynamicFields("");
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
      setDynamicFieldObject("");
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
      setCoins("");
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
      setSplitResult("");
      let txObj = new TransactionBlock();
      let main_coin = splitCoin === "" ? txObj.gas : txObj.object(splitCoin);

      let [coins] = txObj.splitCoins(main_coin, [txObj.pure(Number(splitAmount) * 1000000000)]);

      txObj.transferObjects([coins], txObj.pure(wallet.account.address));

      wallet.signAndExecuteTransactionBlock({
        transactionBlock: txObj,
        options: { showEffects: true },
      }).then(data => {
        console.log("splitCoinFunction");
        console.log(data.effects);
        setSplitResult(jsonFormat(data.effects));
      });
    }
  }

  const changeSplitCoin = (e) => {
    setSplitCoin(e.target.value);
  }
  const changeSplitAmount = (e) => {
    setSplitAmount(e.target.value);
  }

  const mergeCoinFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      setMergeResult("");
      let txObj = new TransactionBlock();
      let merge_coins = [];
      let main_coin = mainCoin === "" ? txObj.gas : txObj.object(mainCoin);

      for (let coin_object_id of mergeCoin.split(",")) {
        merge_coins.push(txObj.object(coin_object_id));
      }

      txObj.mergeCoins(main_coin, merge_coins);

      wallet.signAndExecuteTransactionBlock({
        transactionBlock: txObj,
        options: { showEffects: true },
      }).then(data => {
        console.log("mergeCoinFunction");
        console.log(data.effects);
        setMergeResult(jsonFormat(data.effects));
      });
    }
  }

  const changeMergeCoin = (e) => {
    setMergeCoin(e.target.value);
  }
  const changeMainCoin = (e) => {
    setMainCoin(e.target.value);
  }

  const moveCallFunction = () => {
    console.log(wallet?.connected);
    if (wallet?.connected) {
      setMergeResult("");
      let txObj = new TransactionBlock();

      let type_args = [
        coinType
      ];

      let args = [
        txObj.object(objectId),
        txObj.pure(Number(maxSupply) * 1000000000),
        txObj.object(trader),
        txObj.pure(Number(commissionPercentage)),
        txObj.pure(name),
        txObj.pure(desc),
      ];

      // call sui move smart contract
      txObj.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        typeArguments: type_args,
        arguments: args,
      })

      wallet.signAndExecuteTransactionBlock({
        transactionBlock: txObj,
        options: { showEffects: true },
      }).then(data => {
        console.log("moveCallFunction");
        console.log(data.effects);
        setMoveCallResult(jsonFormat(data.effects));
      });
    }
  }

  const changeName = (e) => {
    setName(e.target.value);
  }
  const changeDesc = (e) => {
    setDesc(e.target.value);
  }
  const changeTrader = (e) => {
    setTrader(e.target.value);
  }
  const changeCommissionPercentage = (e) => {
    setCommissionPercentage(e.target.value);
  }
  const changeMaxSupply = (e) => {
    setMaxSupply(e.target.value);
  }
  const changePackageId = (e) => {
    setPackageId(e.target.value);
  }
  const changeModuleName = (e) => {
    setModuleName(e.target.value);
  }
  const changeFunctionName = (e) => {
    setFunctionName(e.target.value);
  }
  

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <ConnectButton />
      <div style={{ ...wallet?.connected ? displayBlock : displayNone }}>
        <p>Wallet Connection Status : {wallet?.status}</p>
        <p>Connection Network Name : {wallet?.chain.name}</p>
        <p>Wallet Address : {wallet?.account?.address}</p>
      </div>

      <div style={{ ...wallet?.connected ? displayBlock : displayNone }}>

        {/* getOwnedObjects */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>get Owned Objects</h3>
          <p>struct type filter : <input onChange={changeStructType} style={{ width: '750px' }} value={structType} /></p>
          <p><button onClick={getOwnedObjectsFunction}>get Owned Objects</button></p>
          <textarea
            style={{ ...owendObjects ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={owendObjects}></textarea>
        </div>

        {/* getObject */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>get Object</h3>
          <p>object id : <input onChange={changeObjectId} style={{ width: '500px' }} value={objectId} /></p>
          <p><button onClick={getObjectFunction}>get Object</button></p>
          <textarea
            style={{ ...object ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={object}></textarea>
        </div>

        {/* getDynamicFields */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>get Dynamic Fields</h3>
          <p>parent id : <input onChange={changeParentId} style={{ width: '500px' }} value={parentId} /></p>
          <p><button onClick={getDynamicFieldsFunction}>get Dynamic Fields</button></p>
          <textarea
            style={{ ...dynamicFields ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={dynamicFields}></textarea>
        </div>

        {/* getDynamicFieldObject */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>get Dynamic Field Object</h3>
          <p>parent id : <input onChange={changeParentId} style={{ width: '500px' }} value={parentId} /></p>
          <p>type : <input onChange={changeType} style={{ width: '500px' }} value={type} /></p>
          <p>value : <input onChange={changeValue} style={{ width: '500px' }} value={value} /></p>
          <p><button onClick={getDynamicFieldObjectFunction}>get Dynamic Field Object</button></p>
          <textarea
            style={{ ...dynamicFieldObject ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={dynamicFieldObject}></textarea>
        </div>

        {/* getCoins */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>get Coins</h3>
          <p>coin type : <input onChange={changeCoinType} style={{ width: '500px' }} value={coinType} /></p>
          <p><button onClick={getCoinsFunction}>get Coins</button></p>
          <textarea
            style={{ ...coins ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={coins}></textarea>
        </div>

        {/* splitCoin */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>split Coin</h3>
          <p>split coin object id : <input onChange={changeSplitCoin} style={{ width: '500px' }} value={splitCoin} /></p>
          <p>split amount : <input onChange={changeSplitAmount} style={{ width: '500px' }} value={splitAmount} /></p>
          <p><button onClick={splitCoinFunction}>split Coin</button></p>
          <textarea
            style={{ ...splitResult ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={splitResult}></textarea>
        </div>

        {/* mergeCoin */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>merge Coin</h3>
          <p>main coin object id : <input onChange={changeMainCoin} style={{ width: '500px' }} value={mainCoin} /></p>
          <p>merge coin object id : <input onChange={changeMergeCoin} style={{ width: '500px' }} value={mergeCoin} /></p>
          <p><button onClick={mergeCoinFunction}>merge Coin</button></p>
          <textarea
            style={{ ...mergeResult ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={mergeResult}></textarea>
        </div>

        {/* moveCall */}
        <div style={{ border: 'groove', marginBottom: '20px', width: '1010px' }}>
          <h3>move call (create puddle)</h3>
          <p>packageId : <input onChange={changePackageId} style={{ width: '500px' }} value={packageId} /></p>
          <p>moduleName : <input onChange={changeModuleName} style={{ width: '500px' }} value={moduleName} /></p>
          <p>functionName : <input onChange={changeFunctionName} style={{ width: '500px' }} value={functionName} /></p>
          <br/>
          <p>object id : <input onChange={changeObjectId} style={{ width: '500px' }} value={objectId} /></p>
          <p>name : <input onChange={changeName} style={{ width: '500px' }} value={name} /></p>
          <p>desc : <input onChange={changeDesc} style={{ width: '500px' }} value={desc} /></p>
          <p>commissionPercentage : <input onChange={changeCommissionPercentage} style={{ width: '500px' }} value={commissionPercentage} /></p>
          <p>trader : <input onChange={changeTrader} style={{ width: '500px' }} value={trader} /></p>
          <p>maxSupply : <input onChange={changeMaxSupply} style={{ width: '500px' }} value={maxSupply} /></p>
          <p><button onClick={moveCallFunction}>move call</button></p>
          <textarea
            style={{ ...moveCallResult ? displayBlock : displayNone, height: '400px', width: '1000px' }}
            readOnly
            value={moveCallResult}></textarea>
        </div>

      </div>

    </div >
  )
}

export default App
