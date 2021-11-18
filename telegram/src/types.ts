import { Scenes, Context } from 'telegraf'
import { RelayChain } from './utils/types';

// type Pages = Record<string, number>

export interface CustomSession extends Scenes.SceneSession {
  address?: string
  page?: number
  onlyContributed?: boolean
  crowdloanStatus?: string
  relayChain?: RelayChain
}

export interface CustomTelegrafContext extends Context {
  session: CustomSession
  scene: Scenes.SceneContextScene<CustomTelegrafContext>
}

export type AdminPanelSceneState = {
  adminConfirmed?: boolean,
  isAnnouncementMode?: boolean,
  announcementMessage?: string
  photo?: string
}

type PartialSession = {
  id: string,
  data?: CustomSession
}

export type SessionsArrayObject = {
  sessions: PartialSession[]
}