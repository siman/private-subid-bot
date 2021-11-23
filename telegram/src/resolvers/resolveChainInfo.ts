import { ChainInfo } from '../utils/types'
import { getChainsInfo } from '../utils/offchainUtils'

let chainsInfo: ChainInfo

export const resolveChainsInfo = async () => {
  if (!chainsInfo) {
    chainsInfo = await getChainsInfo()
  }

  return chainsInfo
}
