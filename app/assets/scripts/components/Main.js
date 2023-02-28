import React, { useEffect, useState } from "react"
import * as bitcoin from "../../../../bitcoinjs-lib"
import * as crypto from "crypto"
import { Link } from "react-router-dom"
import * as wif from "wif"
import { sha256 } from "js-sha256"
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"

function Main() {
  const ECPair = ECPairFactory(ecc)
  const Mainnet = bitcoin.networks.bitcoin

  const randomBinaryBits = "1010100101000101011010101101010010100101010010010100111010100101001010010101110010100100101010010100101001111011001010100101001010010100101001010010100111100001010101001010101010010101011001111100101010010101010010101111001010100101010010100101111010101010"
  let sha_d = sha256(randomBinaryBits)

  let privateKey = Buffer.from(sha_d, "hex")
  console.log(privateKey)

  let WIF_key = wif.encode(128, privateKey, true)
  console.log(WIF_key)

  let aKeyPair = ECPair.fromWIF(WIF_key, Mainnet)
  console.log("new WIF", aKeyPair.toWIF())

  // const [someObject, setSomeObject] = useState({
  //   key0: "value0",
  // })
  // console.log(someObject)

  // function handleObjectUpdate() {
  //   let newObject = {
  //     key1: "value1",
  //     key2: "value2",
  //     key3: "value3",
  //   }

  //   setSomeObject((someObject) => ({
  //     ...someObject,
  //     ...newObject,
  //   }))

  //   console.log(someObject)
  // }

  return (
    <>
      <div>Welcome to artisanal.</div>
      <Link to="/WalletSelection">Start</Link>
      {/* <button onClick={() => handleObjectUpdate()}>click</button> */}
    </>
  )
}

export default Main
