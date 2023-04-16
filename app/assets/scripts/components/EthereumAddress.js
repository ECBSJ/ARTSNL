import React, { useEffect, useContext } from "react"
import { ethers } from "ethers"
import * as uint8arraytools from "uint8array-tools"
import { useNavigate } from "react-router-dom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function EthereumAddress() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  let provider = new ethers.InfuraProvider(1, "19e6398ef2ee4861bfa95987d08fbc50")
  let prepareETHpubKey = appState.keys.bufferPubKey.slice(1, 65)
  let keccakPubKey = ethers.keccak256(prepareETHpubKey)
  let removed_0x = keccakPubKey.slice(2)
  let prepareETHpubAdd = Buffer.from(removed_0x, "hex")
  let ETHpubAdd = prepareETHpubAdd.slice(-20)
  let finalETHpubAdd = "0x" + uint8arraytools.toHex(ETHpubAdd)
  console.log(finalETHpubAdd)
  console.log(ethers.isAddress(finalETHpubAdd))

  function handleNext() {
    navigate("/WalletMain")
  }

  return (
    <>
      {finalETHpubAdd}
      <button onClick={handleNext}>To Wallet Main</button>
    </>
  )
}

export default EthereumAddress
