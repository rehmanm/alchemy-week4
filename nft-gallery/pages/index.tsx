import type { NextPage } from 'next'
import { useState } from 'react';

import { Nft } from '../models/nft';
import Loader from './components/loader';
import NFTCard from './components/nftCard';

const Home: NextPage = () => {
  const [wallet, setWalletAddress] = useState<string>('')
  const [collection, setCollectionAddress] = useState<string>('')
  const [NFTs, setNFTs] = useState<Nft[]>([])
  const [fetchForCollection, setFetchForCollection] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [showWalletAddressRequired, setShowWalletAddressRequired] =
    useState(false)

  const [pages, setPages] = useState<number[]>([])

  const getPagesArrays = (itemLength: number) => {
    if (itemLength && itemLength > 100) {
      let totalItem = itemLength
      let pageArray: number[] = []
      let currentPage = 1
      while (totalItem > 100) {
        pageArray.push(currentPage++)
        totalItem = totalItem - 100
      }
      pageArray.push(currentPage)
      console.log('pageArray', pageArray)
      return pageArray
    }
    return []
  }

  const fetchNfts = async (currentPage: number) => {
    if (!wallet && !fetchForCollection) {
      setShowWalletAddressRequired(true)
      return
    }
    let nfts
    console.log('fetching nfts')
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
    console.log(apiKey)
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`

    let requestOption = {
      method: 'GET',
    }
    let fetchURL
    setLoading(true)
    if (!collection.length) {
      fetchURL = `${baseURL}?owner=${wallet}&startToken=${currentPage * 100}`
    } else {
      fetchURL = `${baseURL}?owner=${wallet}&contractAddresses[]=${collection}&startToken=${
        currentPage * 100
      }`

      nfts = await fetch(fetchURL, requestOption)
        .then((data) => data.json())
        .catch((err) => {
          setLoading(false)
        })
    }
    console.log(fetchURL)
    nfts = await fetch(fetchURL, requestOption)
      .then((data) => data.json())
      .catch((err) => {
        setLoading(false)
      })

    if (nfts) {
      console.log('nft', nfts)
      setNFTs(nfts.ownedNfts)
      setPages(getPagesArrays(nfts.totalCount))
    }
    setLoading(false)
  }

  const fetchNftsForCollection = async (currentPage: number) => {
    if (collection.length) {
      console.log('fetching nfts')
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
      console.log(apiKey)
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection`

      let requestOption = {
        method: 'GET',
      }
      setLoading(true)
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${'true'}&startToken=${
        currentPage * 100
      }`

      let nfts = await fetch(fetchURL, requestOption)
        .then((data) => data.json())
        .catch((err) => {
          setLoading(false)
        })
      if (nfts) {
        console.log(nfts)
        setNFTs(nfts.nfts)
        setPages(getPagesArrays(nfts.totalCount))
      }
      setLoading(false)
    }
  }

  const getData = (page: number) => {
    if (fetchForCollection) {
      fetchNftsForCollection(page)
    } else {
      fetchNfts(page)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 py-8">
      <div className="flex w-full flex-col items-center justify-center gap-y-2">
        <input
          disabled={fetchForCollection}
          type={'text'}
          placeholder="Add your wallet address"
          className="w-2/5 rounded-lg bg-slate-100 py-2 px-2 text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => setWalletAddress(e.target.value)}
        ></input>
        {showWalletAddressRequired && (
          <div
            className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-800 "
            role="alert"
          >
            <strong className="font-bold">Error</strong>
            <span className="ml-5 block sm:inline ">
              Please provide wallet address
            </span>
          </div>
        )}
        <input
          type={'text'}
          placeholder="Add the collection address"
          className="w-2/5 rounded-lg bg-slate-100 py-2 px-2 text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => setCollectionAddress(e.target.value)}
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked)
            }}
            type={'checkbox'}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            'mt-3 w-1/5 rounded-sm bg-blue-400 px-4 py-2 text-white disabled:bg-slate-500'
          }
          onClick={() => {
            setShowWalletAddressRequired(false)

            getData(0)
          }}
        >
          Let's go!
        </button>
      </div>
      <div>
        {pages.length > 0
          ? pages.map((p) => {
              return (
                <span className="ml-5 block sm:inline">
                  <a
                    href="#"
                    onClick={() => {
                      getData(p - 1)
                    }}
                  >
                    {' '}
                    {p}
                  </a>
                </span>
              )
            })
          : ''}
      </div>

      <div className="mt-4 flex w-5/6 flex-wrap justify-center gap-y-12 gap-x-12">
        {NFTs.length > 0
          ? NFTs.map((nft) => {
              return <NFTCard nft={nft} />
            })
          : ''}
      </div>
      <Loader loading={loading} />
    </div>
  )
}

export default Home
