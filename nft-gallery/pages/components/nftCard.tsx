import * as React from 'react';

import { Nft } from '../../models/nft';

export interface INFTCardProps {
  nft: Nft
}

const NFTCard = (props: INFTCardProps) => {
  return (
    <div className="flex w-1/4 flex-col">
      <div className="rounded-md">
        <img
          className="h-128 w-full rounded-t-md object-cover"
          src={props.nft?.media[0].gateway}
        />
      </div>
      <div className="y-gap-2 h-110 flex flex-col rounded-b-md bg-slate-100 px-2 py-3 ">
        <div>
          <h2 className="text-xl text-gray-800">{props.nft?.title}</h2>
          <p className="text-gray-600">
            Id:{' '}
            {props.nft?.id.tokenId.substring(props.nft?.id.tokenId.length - 4)}
          </p>
          <p className=" text-gray-600">
            {`${props.nft?.contract.address.substring(
              0,
              4
            )}...${props.nft?.contract.address.substring(
              props.nft?.contract.address.length - 4
            )}`}{' '}
            <button
              className="align-middle"
              onClick={() =>
                navigator.clipboard.writeText(props.nft?.contract.address)
              }
            >
              <img src="https://img.icons8.com/small/16/000000/copy.png" />
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NFTCard
