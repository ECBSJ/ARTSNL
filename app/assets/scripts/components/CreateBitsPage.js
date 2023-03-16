import React, { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"

function CreateBitsPage({ bits, setBits, setOnCreateBitsPage, setOnDisplayMultipleRaw }) {
  const [hasErrors, setHasErrors] = useState()

  function checkErrors() {
    if (bits.length == 256) {
      setHasErrors(false)
    }
  }

  function handleAccept() {
    checkErrors()

    if (!hasErrors) {
      setOnCreateBitsPage(false)
      setOnDisplayMultipleRaw(true)
    }
  }

  return (
    <>
      <input onChange={(e) => setBits(e.target.value)} type="text" placeholder="Input 256 bits" />
      <div>{bits.length}</div>
      <button onClick={handleAccept}>Next</button>

      <button
        onClick={() => {
          setBits("")
          setOnCreateBitsPage(false)
        }}
      >
        Back to Creation Selection
      </button>
    </>
  )
}

export default CreateBitsPage
