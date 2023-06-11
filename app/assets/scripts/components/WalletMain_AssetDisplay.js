import React, { useEffect, useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { IconContext } from "react-icons"
import { FaBitcoin, FaEthereum } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function WalletMain_AssetDisplay({ isAssetDisplayOpen, setIsAssetDisplayOpen, isBitcoinWalletOpen, setIsBitcoinWalletOpen, isEthereumWalletOpen, setIsEthereumWalletOpen }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const navigate = useNavigate()

  return (
    <>
      <div className="wallet-main__overlay">
        <IconContext.Provider value={{ size: "300px" }}>
          <div
            onClick={() => {
              if (appState.bitcoin.address) {
                setIsAssetDisplayOpen(!isAssetDisplayOpen)
                setIsBitcoinWalletOpen(!isBitcoinWalletOpen)
              } else {
                navigate("/BitcoinAddress")
              }
            }}
            className="wallet-main__asset-display wallet-main__asset-display--bitcoin"
          >
            {appState.bitcoin.address ? (
              <div className="wallet-main__asset-display--label">
                <div style={{ fontSize: ".4em" }}>{appState.isTestnet ? appState.bitcoin.testnetAddress : appState.bitcoin.address}</div>
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
          <div
            onClick={() => {
              if (appState.ethereum.address) {
                setIsAssetDisplayOpen(!isAssetDisplayOpen)
                setIsEthereumWalletOpen(!isEthereumWalletOpen)
              } else {
                navigate("/EthereumAddress")
              }
            }}
            className="wallet-main__asset-display wallet-main__asset-display--ethereum"
          >
            {appState.ethereum.address ? (
              <div className="wallet-main__asset-display--label">
                <div style={{ fontSize: ".4em" }}>{appState.ethereum.address}</div>
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
      </div>
    </>
  )
}

export default WalletMain_AssetDisplay
