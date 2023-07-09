function Suspensify(promise) {
  let status = "pending"
  let result

  let suspender = promise.then(
    res => {
      status = "success"
      result = res
    },
    error => {
      status = "error"
      result = error
    }
  )

  return {
    read() {
      if (status === "pending") {
        console.log("threw suspender")
        throw suspender
      } else if (status === "error") {
        console.log("threw error")
        throw result
      } else if (status === "success") {
        console.log("threw success")
        return result
      }
    }
  }
}

export default Suspensify

// EXAMPLE ON USING SUSPENSIFY
// const [promise, setPromise] = useState()

// async function grabData() {
//   let result = await fetch("https://mempool.space/api/block/000000000000000015dc777b3ff2611091336355d3f0ee9766a2cf3be8e4b1ce/txids")

//   return result.json()
// }

// const onClick = () => {
//   setPromise(Suspensify(grabData()))
// }

// if (promise) {
//   let readPromise = promise.read()
// }
