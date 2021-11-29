import { bot } from '.'
import { supportedNetworks } from './utils/index'
import { isNetworkConnected } from './utils/offchainUtils'
import { isDef } from '@subsocial/utils'
import { startWithUpperCase } from './resolvers/utils'

export const MINUTE = 60 * 1000

export const checkNetworks = async (userIds: string[]) => {
	const disconnectedNetworksPromise = supportedNetworks
		.map(async (network) => {
			const isConnected = await isNetworkConnected(network)

			if (!isConnected) {
				return network
			}

			return undefined
		})

  const disconnectedNetworks = await Promise.all(disconnectedNetworksPromise)

	let message = '❌ Disconnected networks: \n\n'

	disconnectedNetworks.filter(isDef).map((network) => {
		message += `${startWithUpperCase(network)}\n`
	})

	userIds.map(async (userId) => {
		await bot.telegram.sendMessage(userId, message)
	})
}


