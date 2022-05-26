import type { NextPage } from 'next'
import { useState } from 'react';

const Home: NextPage = () => {
  const [wallet, setWalletAddress] = useState<string>('')
  const [collection, setCollectionAddress] = useState<string>('')
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState<boolean>(false)

  const fetchNfts = async () => {
    let nfts
    console.log('fetching nfts')
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
    console.log(apiKey)
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`

    let requestOption = {
      method: 'GET',
    }

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`

      nfts = await fetch(fetchURL, requestOption).then((data) => data.json())
    } else {
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses[]=${collection}`

      nfts = await fetch(fetchURL, requestOption).then((data) => data.json())
    }

    if (nfts) {
      console.log(nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNftsForCollection = async () => {
    if (collection.length) {
      console.log('fetching nfts')
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
      console.log(apiKey)
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`

      let requestOption = {
        method: 'GET',
      }

      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${'true'}`

      let nfts = await fetch(fetchURL, requestOption).then((data) =>
        data.json()
      )
      if (nfts) {
        console.log(nfts)
        setNFTs(nfts.nfts)
      }
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
          <input
            type="checkbox"
            checked={fetchForCollection}
            onChange={(e) => setFetchForCollection(e.target.checked)}
          />
          Fetch for Collection
        </label>
        <button
          onClick={() => {
            if (fetchForCollection) {
              fetchNftsForCollection()
            } else {
              fetchNfts()
            }
          }}
        >
          Let's go!
        </button>
      </div>
    </div>
  )
}

export default Home
