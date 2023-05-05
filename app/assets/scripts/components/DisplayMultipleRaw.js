import React, { useEffect, useState, useContext } from "react"
import * as ecc from "tiny-secp256k1"
import * as uint8arraytools from "uint8array-tools"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

// IMPORT COMPONENTS
import GeneratePubKey from "./GeneratePubKey"
import Display3Formats from "./Display3Formats"
import AcceptKeyPair from "./AcceptKeyPair"

function DisplayMultipleRaw({ bits, entropy }) {
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)

  // all types are string
  const [binary, setBinary] = useState()
  const [decimal, setDecimal] = useState()
  const [hex, setHex] = useState()

  const [privKeyBuf, setPrivKeyBuf] = useState()

  // type string
  const [pubKeyX, setPubKeyX] = useState()
  const [pubKeyY, setPubKeyY] = useState()
  // type string
  const [compressedPubKey, setCompressedPubKey] = useState()
  // type Uint8Array
  const [uncompressedBufferPub, setUncompressedBufferPub] = useState()
  const [showCompressed, setShowCompressed] = useState(false)

  const [displayPubKey, setDisplayPubKey] = useState(false)
  const [displayAccept, setDisplayAccept] = useState(false)

  function convertFromBits() {
    let bigIntBinary = BigInt("0b" + bits)
    let decimalString = bigIntBinary.toString(10)
    let hexString = bigIntBinary.toString(16)

    setBinary(bits)
    setDecimal(decimalString)
    setHex(hexString)
  }

  function convertFromEntropy() {
    let binaryString = BigInt("0x" + entropy.toString("hex")).toString(2)
    let decimalString = BigInt("0x" + entropy.toString("hex")).toString(10)

    setBinary(binaryString)
    setDecimal(decimalString)
    setHex(entropy.toString("hex"))
  }

  useEffect(() => {
    if (bits) {
      convertFromBits()
    } else {
      convertFromEntropy()
    }
  }, [])

  function handlePublicKeyGen() {
    let privateKeyBuffer = Buffer.from(hex, "hex")
    setPrivKeyBuf(privateKeyBuffer)

    let result = ecc.pointFromScalar(privateKeyBuffer, false)
    setUncompressedBufferPub(result)

    // GENERATE X AND Y COORDINATES OF PUBKEY
    let xCoordinate = result.slice(1, 33)
    let yCoordinate = result.slice(33, 65)
    let xCoordHexString = uint8arraytools.toHex(xCoordinate)
    let yCoordHexString = uint8arraytools.toHex(yCoordinate)
    let xCoordDecString = BigInt("0x" + xCoordHexString).toString(10)
    let yCoordDecString = BigInt("0x" + yCoordHexString).toString(10)
    setPubKeyX(xCoordDecString)
    setPubKeyY(yCoordDecString)

    // Generate compressed
    let compressedFormat = ecc.pointFromScalar(privateKeyBuffer, true)
    setCompressedPubKey(uint8arraytools.toHex(compressedFormat))

    setDisplayPubKey(true)
  }

  function handleShowCompressedPubKey() {
    setShowCompressed(!showCompressed)
  }

  function handleDisplayAccept() {
    setDisplayPubKey(false)
    setDisplayAccept(true)
  }

  function handleAccept() {
    appDispatch({ type: "setBufferPrivKey", value: privKeyBuf })
    appDispatch({ type: "setBufferPubKey", value: uncompressedBufferPub })
  }

  return (
    <>
      {displayPubKey ? (
        <>
          <GeneratePubKey showCompressed={showCompressed} compressedPubKey={compressedPubKey} pubKeyX={pubKeyX} pubKeyY={pubKeyY} handleShowCompressedPubKey={handleShowCompressedPubKey} handleDisplayAccept={handleDisplayAccept} />
        </>
      ) : displayAccept ? (
        <>
          <AcceptKeyPair uncompressedBufferPub={uncompressedBufferPub} privKeyBuf={privKeyBuf} uint8arraytools={uint8arraytools} handleAccept={handleAccept} navigate={navigate} />
        </>
      ) : (
        <>
          <Display3Formats binary={binary} decimal={decimal} hex={hex} handlePublicKeyGen={handlePublicKeyGen} />
        </>
      )}
    </>
  )
}

export default DisplayMultipleRaw
