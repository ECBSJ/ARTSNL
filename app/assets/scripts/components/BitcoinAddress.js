import React, { useEffect, useContext } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import * as base58 from "bs58"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function BitcoinAddress() {
  const navigate = useNavigate()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let riped = bitcoin.crypto.hash160(appState.keys.bufferPubKey)
  let prefix = Buffer.from("00", "hex")
  let prefix_riped = [prefix, riped]
  let combined_prefix_riped = Buffer.concat(prefix_riped)
  let checksum = bitcoin.crypto.sha256(bitcoin.crypto.sha256(combined_prefix_riped)).slice(0, 4)
  let arr = [prefix, riped, checksum]
  let combinedBuff = Buffer.concat(arr)
  let address = base58.encode(combinedBuff)

  function handleNext() {
    navigate("/WalletMain")
  }

  return (
    <>
      {address}
      <button onClick={handleNext}>To Wallet Main</button>
    </>
  )
}

export default BitcoinAddress
