import React, { useEffect, useContext, useState } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

// IMPORT REACT COMPONENTS
import AddressDetailsPage from "./AddressDetailsPage"

function WalletMain() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const [bitcoinAddressData, setBitcoinAddressData] = useState({})
  const [isAddressDetailsPageOpen, setIsAddressDetailsPageOpen] = useState(false)

  async function getBitcoinAddressData(address) {
    setIsAddressDetailsPageOpen(true)

    const {
      bitcoin: { addresses },
    } = await mempoolJS({
      hostname: "mempool.space",
    })

    const addressResult = await addresses.getAddress({ address })

    if (addressResult) {
      setBitcoinAddressData({ ...addressResult })
      console.log(addressResult)
    }
  }

  return (
    <>
      {isAddressDetailsPageOpen ? (
        <AddressDetailsPage />
      ) : (
        <div>
          <div>Your Wallets.</div>
          <div onClick={() => getBitcoinAddressData(appState.bitcoin.address)}>{appState.bitcoin.address}</div>
        </div>
      )}
    </>
  )
}

export default WalletMain
