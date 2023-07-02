import React, { useEffect } from "react"

function UtxoCapsule({ selectedUtxoIndex, utxoData_Array }) {
  return (
    <>
      <button className="utxo-capsule">UTXO | Value: {utxoData_Array[selectedUtxoIndex].value}</button>
    </>
  )
}

export default UtxoCapsule
