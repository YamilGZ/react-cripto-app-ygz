import { z } from 'zod'

export const CurrencySchema = z.object({
    code: z.string(),
    name: z.string()
})

export const CryptoCurrencyResponseSchema = z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string()
})

export const CryptoCurrenciesResponseSchema = z.array(CryptoCurrencyResponseSchema)

export const PairSchema = z.object({
    currency: z.string(),
    criptocurrency: z.string()
})

export const CoinGeckoMarketSchema = z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string(),
    current_price: z.number().nullable(),
    high_24h: z.number().nullable(),
    low_24h: z.number().nullable(),
    price_change_percentage_24h: z.number().nullable(),
    last_updated: z.string().nullable()
})

export const CoinGeckoMarketsResponseSchema = z.array(CoinGeckoMarketSchema)

export const CryptoPriceSchema = z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string(),
    currency: z.string(),
    current_price: z.number(),
    high_24h: z.number(),
    low_24h: z.number(),
    price_change_percentage_24h: z.number(),
    last_updated: z.string()
})
