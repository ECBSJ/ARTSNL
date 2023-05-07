import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"
import * as bitcoin from "../../../../bitcoinjs-lib"

// IMPORT REACT COMPONENTS
import AddressDetailsPage from "./AddressDetailsPage"

function WalletMain() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

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

  useEffect(() => {
    let keyPair = ECPair.fromPrivateKey(appState.keys.bufferPrivKey, Mainnet)
    appDispatch({ type: "setKeyPair", value: keyPair })
    const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
    appDispatch({ type: "setBitcoinAddress", value: address })
  }, [])

  return (
    <>
      {isAddressDetailsPageOpen ? (
        <AddressDetailsPage />
      ) : (
        <div>
          <div>Your Wallets.</div>
          {/* <div onClick={() => getBitcoinAddressData(appState.bitcoin.address)}>{appState.bitcoin.address}</div> */}
        </div>
      )}
    </>
  )
}

export default WalletMain
