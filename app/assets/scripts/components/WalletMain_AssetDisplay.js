import React, { useEffect, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { IconContext } from "react-icons"
import { FaBitcoin, FaEthereum } from "react-icons/fa"

function WalletMain_AssetDisplay() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const static_privKey = "3fdde77e8b442bc89dc890adf8fd72b4314e99ea7a205b9dd302114c9aefc493"
  const static_publicKey = "0488a0dfca9af0d817962b25d1aa92d64e1645c94d452f6e75f61adc3f78d61b623637901afdf2efcb0bbf5badd82c2e559f22fe2f824438515614137443cb62ea"
  const static_btc_address = "19G4UV3YDkTYj4G3XSYeUkzp4Ew6voQFiR"
  const static_btc_testnet_address = "mon1mY8X2mtoWAjfF1X2JgD8vEXotDVsiY"
  const static_eth_address = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

  return (
    <>
      <IconContext.Provider value={{ size: "300px" }}>
        <div className="wallet-main__asset-display wallet-main__asset-display--bitcoin">
          {static_btc_address ? (
            <div className="wallet-main__asset-display--label">
              <div style={{ fontSize: ".4em" }}>{appState.isTestnet ? static_btc_testnet_address : static_btc_address}</div>
              <div style={{ fontFamily: "Russo One", fontSize: "2rem" }}>{appState.isTestnet ? "tBTC" : "BTC"}</div>
              <div style={{ fontSize: ".6em" }}>{appState.isTestnet ? "testnet" : "mainnet"}</div>
            </div>
          ) : (
            <div className="wallet-main__asset-display--label">
              <div>Create a BTC wallet.</div>
            </div>
          )}
          <FaBitcoin className="wallet-main__asset-display--bitcoin-logo" />
        </div>
        <div className="wallet-main__asset-display wallet-main__asset-display--ethereum">
          {static_eth_address ? (
            <div className="wallet-main__asset-display--label">
              <div style={{ fontSize: ".4em" }}>{static_eth_address}</div>
              <div style={{ fontFamily: "Russo One", fontSize: "2rem" }}>{appState.isTestnet ? "gETH" : "ETH"}</div>
              <div style={{ fontSize: ".6em" }}>{appState.isTestnet ? "goerli" : "mainnet"}</div>
            </div>
          ) : (
            <div className="wallet-main__asset-display--label">
              <div>Create an ETH wallet.</div>
            </div>
          )}
          <FaEthereum className="wallet-main__asset-display--ethereum-logo" />
        </div>
      </IconContext.Provider>
    </>
  )
}

export default WalletMain_AssetDisplay
