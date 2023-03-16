import React, { useEffect, useState } from "react"

function DisplayMultipleRaw({ bits, entropy }) {
  const [binary, setBinary] = useState()
  const [decimal, setDecimal] = useState()
  const [hex, setHex] = useState()

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

  return (
    <>
      <div>Here are 3 formats to your private key.</div>
      <div>{binary}</div>
      <br />
      <div>{decimal}</div>
      <br />
      <div>{hex}</div>
    </>
  )
}

export default DisplayMultipleRaw
