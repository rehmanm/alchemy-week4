export interface Nft {
  media: {
    gateway: string
  }[]
  title: string
  id: { tokenId: string }
  contract: { address: string }
}
