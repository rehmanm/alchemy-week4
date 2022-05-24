import type { NextPage } from 'next'
import { useState } from 'react';

const Home: NextPage = () => {
  const [wallet, setWalletAddress] = useState<string>('')
  const [collection, setCollectionAddress] = useState<string>('')
  const [NFTs, setNFTs] = useState([])

  const fetchNfts = async () => {
    let nfts
    console.log('fetching nfts')
    if (!collection.length) {
      var requestOption = {
        method: 'GET',
      }
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
      console.log(apiKey)
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`
      const fetchURL = `${baseURL}?owner=${wallet}`

      nfts = await fetch(fetchURL, requestOption).then((data) => data.json())
    } else {
    }

    if (nfts) {
      console.log(nfts)
      setNFTs(nfts)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div>
        <input
          type="text"
          placeholder="Add your wallet address"
          value={wallet}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Add you collection address"
          value={collection}
          onChange={(e) => setCollectionAddress(e.target.value)}
        />
        <label>
          <input type="checkbox" />
        </label>
        <button
          onClick={() => {
            fetchNfts()
          }}
        >
          Let's go!
        </button>
      </div>
    </div>
  )
}

export default Home
