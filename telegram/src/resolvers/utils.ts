import BN from 'bignumber.js'

export const BN_TEN = new BN(10)

type BalanceWithDecimals = {
	totalBalance: string
	decimals: number
}

export const getBalanceWithDecimals = ({
	totalBalance,
	decimals,
}: BalanceWithDecimals) => {
	return new BN(totalBalance).div(BN_TEN.pow(decimals))
}

export const startWithUpperCase = (str: string) => str.replace(/(?:^\s*|\s+)(\S?)/g, (b) => b.toUpperCase())

const getTotalBalance = (balance: BN, price: string) => (
  balance && price
    ? balance.multipliedBy(new BN(price))
    : new BN(0)
)

type BalanceType = {
  totalBalance: string
  priceField: string
  comparableValue: string
  tokenPrices: any[]
  decimals: number
  symbol: string
}

export const getBalances = ({
  totalBalance,
  decimals,
  symbol,
  tokenPrices,
  priceField,
  comparableValue
}: BalanceType) => {
  const stable = symbol.toLowerCase().includes('usd') ? 1 : 0

  const balanceValue = getBalanceWithDecimals({ totalBalance, decimals })

  const priceValue = (tokenPrices.find(x => x[priceField] === comparableValue.toLowerCase())?.current_price)?.toString() || stable

  const totalValue = getTotalBalance(balanceValue, priceValue)

  return {
    balanceValue,
    priceValue,
    totalValue,
  }
}

type ShortMoneyProps = {
  num: number
  prefix?: string
}

function moneyToString({ num, prefix }: ShortMoneyProps) {
  const fractions = num < 1 ? 2 : 1
  return `${prefix ? prefix : ''}${num.toFixed(fractions)}`
}

const num1K = 1000
const num1M = num1K ** 2
const num1B = num1K ** 3
const num1T = num1K ** 4

export function toShortMoney({ num, prefix }: ShortMoneyProps): string {
  if (num >= num1K && num < num1M) {
    return moneyToString({ num: num / num1K, prefix }) + 'k'
  } else if (num >= num1M && num < num1B) {
    return moneyToString({ num: num / num1M, prefix }) + 'm'
  } else if (num >= num1B && num < num1T) {
    return moneyToString({ num: num / num1B, prefix }) + 'b'
  }
  return moneyToString({ num, prefix })
}
