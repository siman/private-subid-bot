import { RelayChain } from './types'

export const defaultContributionLink: Record<RelayChain, string> = {
  kusama:
    'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama-rpc.polkadot.io#/parachains/crowdloan',
  polkadot:
    'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/parachains/crowdloan',
}

export type ContributionInfo = {
  contribLink?: string
  refBonus?: string
}

type ContributionByNetwork = Record<string, ContributionInfo>

export const kusamaContributionInfoByNetwork: ContributionByNetwork = {
  integritee: {
    contribLink: 'https://crowdloan.integritee.network/',
  },
  bitCountry: {
    contribLink:
      'https://ksmcrowdloan.bit.country/crowdloan?referralCode=EGGt1JS6HhKkSXq9P12BtmXiGwrGHaVxPtRrot8hDewz66Z',
    refBonus: '2.5%',
  },
  quartz: {
    contribLink: 'https://unique.network/quartz/crowdloan/contribute/',
  },
  picasso: {
    contribLink: 'https://crowdloan.composable.finance/kusama',
  },
}

export const polkadotContributionInfoByNetwork: ContributionByNetwork = {
  acala: {
    contribLink:
      'https://acala.network/acala/join-acala?ref=0x4ab52bb8245e545fc6b7861df6cf6a2db175f95c99f6b4b27e8f3bb3e9d10c4b',
    refBonus: '5%',
  },
  moonbeam: {
    contribLink: 'https://crowdloan.moonbeam.foundation/',
  },
  astar: {
    contribLink:
      'https://crowdloan.astar.network/?referral=12gxN2DdKhwsSKiuLKEyS6EgRJfG9vKTaWnAdSbXmWTyRFaG',
    refBonus: '1%',
  },
  parallel: {
    contribLink:
      'https://crowdloan.parallel.fi/#/auction/contribute/polkadot/2012?referral=0x9fe857c39295267fa451e45337fd50658624b01b82f759d1e8843e43c16ed577',
    refBonus: '5%',
  },
  manta: {
    contribLink: 'https://crowdloan.manta.network/?referral=4ab52bb8245e545fc6b7861df6cf6a2db175f95c99f6b4b27e8f3bb3e9d10c4b',
    refBonus: '2.5%',
  }
}

export const contributionInfoByRelayChain: Record<
  RelayChain,
  ContributionByNetwork
  > = {
  kusama: kusamaContributionInfoByNetwork,
  polkadot: polkadotContributionInfoByNetwork,
}
