import React, { useEffect, useState } from "react"

function AddressCheckModal() {
  let address = "18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX"
  let array = []

  function parseAddress(addressString) {
    for (let index = 0; index < addressString.length; index += 4) {
      let quadrantExtracted = addressString.substr(index, 4)
      array.push(quadrantExtracted)
    }
  }

  parseAddress(address)

  return (
    <>
      <div>Double check the address.</div>
      <div>
        {array.map((quadrant, index) => {
          console.log(index + ": " + quadrant)
          return <span key={index}>{quadrant}</span>
        })}
      </div>
    </>
  )
}

export default AddressCheckModal
