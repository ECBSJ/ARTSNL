import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as bitcoin from "../../../../bitcoinjs-lib"
import { ethers } from "ethers"

import { IconContext } from "react-icons"
import { FaBitcoin, FaEthereum } from "react-icons/fa"
import { BsHddNetworkFill, BsHddNetwork, BsReception1, BsReception4 } from "react-icons/bs"
import { MdNavigateNext, MdMenu, MdLibraryBooks, MdCopyAll } from "react-icons/md"
import { TbRefresh } from "react-icons/tb"

// IMPORT REACT COMPONENTS
import AddressDetailsPage from "./AddressDetailsPage"

function WalletMain() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin
  let mempoolProvider = mempoolJS({
    hostname: "mempool.space"
  })

  let recentBlock = mempoolProvider.bitcoin.blocks.getBlocksTipHeight()
  console.log(recentBlock)

  let infuraProvider = new ethers.InfuraProvider(1, "19e6398ef2ee4861bfa95987d08fbc50")
  infuraProvider.getBlockNumber().then(console.log).catch(console.log)

  const [bitcoinAddressData, setBitcoinAddressData] = useState({})
  const [isAddressDetailsPageOpen, setIsAddressDetailsPageOpen] = useState(false)

  async function getBitcoinAddressData(address) {
    setIsAddressDetailsPageOpen(true)

    const {
      bitcoin: { addresses }
    } = await mempoolJS({
      hostname: "mempool.space"
    })

    const addressResult = await addresses.getAddress({ address })

    if (addressResult) {
      setBitcoinAddressData({ ...addressResult })
      console.log(addressResult)
    }
  }

  const [isTestnet, setIsTestnet] = useState(false)

  const static_privKey = "3fdde77e8b442bc89dc890adf8fd72b4314e99ea7a205b9dd302114c9aefc493"
  const static_publicKey = "0488a0dfca9af0d817962b25d1aa92d64e1645c94d452f6e75f61adc3f78d61b623637901afdf2efcb0bbf5badd82c2e559f22fe2f824438515614137443cb62ea"
  const static_btc_address = "19G4UV3YDkTYj4G3XSYeUkzp4Ew6voQFiR"
  const static_btc_testnet_address = "mon1mY8X2mtoWAjfF1X2JgD8vEXotDVsiY"
  const static_eth_address = "0x9189561aed3229361a1aca088323a3ab0750c5d6"

  return (
    <>
      <div className="wallet-main__overlay">
        <IconContext.Provider value={{ size: "300px" }}>
          <div className="wallet-main__asset-display wallet-main__asset-display--bitcoin">
            {static_btc_address ? (
              <div className="wallet-main__asset-display--label">
                <div style={{ fontSize: ".4em" }}>{isTestnet ? static_btc_testnet_address : static_btc_address}</div>
                <div>{isTestnet ? "tBTC" : "BTC"}</div>
                <div style={{ fontSize: ".6em" }}>{isTestnet ? "testnet" : "mainnet"}</div>
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
                <div>{isTestnet ? "gETH" : "ETH"}</div>
                <div style={{ fontSize: ".6em" }}>{isTestnet ? "goerli" : "mainnet"}</div>
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

      <div className="interface__block">
        <div className="interface__block-cell interface__block-cell--space-between">
          <div className="title-font title-font--large">
            <div className="title__subtitle">Your crypto journey starts here.</div>
            <div style={{ display: "inline-block" }} className="purple-font">
              🏠Your
            </div>{" "}
            Wallets
          </div>
          <MdMenu onClick={() => appDispatch({ type: "toggleMenu" })} className="icon" />
        </div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
      </div>
      <div className="interface__block">
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell"></div>
        <div className="interface__block-cell interface__block-cell__footer">
          <TbRefresh className="icon" />
          {isTestnet ? <BsHddNetwork onClick={() => setIsTestnet(!isTestnet)} className="icon" /> : <BsHddNetworkFill onClick={() => setIsTestnet(!isTestnet)} className="icon" />}
          <div className="icon">ARTSNL</div>
          <BsReception4 className="icon" />
          <MdLibraryBooks className="icon" />
        </div>
      </div>
    </>
  )
}

export default WalletMain
