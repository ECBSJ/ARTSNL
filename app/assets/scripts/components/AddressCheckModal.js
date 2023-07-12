import React, { useEffect, useState } from "react"

function AddressCheckModal({ setIsModalDropDownOpen, isModalDropDownOpen, data }) {
  let address = data
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
      <div className="address-quadrant-container">
        {array.map((quadrant, index) => {
          console.log(index + ": " + quadrant)
          return (
            <span style={index % 2 === 0 ? { color: "lightSeaGreen" } : { color: "gray" }} className="address-quadrant-text" key={index}>
              {quadrant}
            </span>
          )
        })}
      </div>
      <div style={{ width: "100%", fontSize: "0.4em", color: "darkGray", marginTop: "20px" }}>Is the receiver address correct?</div>
      <div className="address-quadrant-buttons-container">
        <button style={{ backgroundColor: "limegreen" }}>YES</button>
        <button onClick={() => setIsModalDropDownOpen(!isModalDropDownOpen)} style={{ backgroundColor: "red" }}>
          NO
        </button>
      </div>
    </>
  )
}

export default AddressCheckModal
