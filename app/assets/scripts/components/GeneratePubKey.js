import React, { useEffect } from "react"

function GeneratePubKey({ showCompressed, compressedPubKey, pubKeyX, pubKeyY, handleShowCompressedPubKey, handleDisplayAccept }) {
  return (
    <>
      <div>{showCompressed ? compressedPubKey : "(" + pubKeyX + ", " + pubKeyY + ")"}</div>
      <div>This is your public key as a point on the secp256k1 elliptic cryptography curve.</div>
      <button onClick={handleShowCompressedPubKey}>{showCompressed ? "Show Uncompressed" : "Show Compressed"}</button>
      <button onClick={handleDisplayAccept}>Next</button>
    </>
  )
}

export default GeneratePubKey
