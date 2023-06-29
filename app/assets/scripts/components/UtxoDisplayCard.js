import React, { useEffect } from "react"

function UtxoDisplayCard({ txid, vout, confirmed, block_height, block_hash, block_time, value }) {
  return (
    <>
      <div className="utxo__display-card">
        <span>&#123;</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>txid&#58; &#34;{txid.slice(0, 12) + "..." + txid.slice(-12)}&#34;,</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>vout&#58; {vout},</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>status&#58; &#123;</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>confirmed&#58; {confirmed ? "true" : "false"},</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_height&#58; {block_height},</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_hash&#58; &#34;{block_hash.slice(0, 21) + "..." + block_hash.slice(-10)}&#34;,</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>block_time&#58; {block_time}</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>&#125;,</span>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>value&#58; {value}</span>
        <br />
        <span>&#125;</span>
      </div>
    </>
  )
}

export default UtxoDisplayCard
