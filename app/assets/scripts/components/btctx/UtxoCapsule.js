import React from "react"
import { BsFileEarmarkLock2Fill } from "react-icons/bs"

function UtxoCapsule({ selectedUtxoIndex, utxoData_Array }) {
  return (
    <>
      <button className="utxo-capsule">
        <BsFileEarmarkLock2Fill style={{ color: "white" }} /> UTXO | Value: {utxoData_Array[selectedUtxoIndex].value}
      </button>
    </>
  )
}

export default UtxoCapsule
