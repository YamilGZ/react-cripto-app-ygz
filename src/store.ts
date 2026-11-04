import { create } from 'zustand'
import type { Cryptocurrency, CryptoPrice, Pair } from './types'
import { devtools } from 'zustand/middleware'
import { fetchCurrentCryptoPrice, getCryptos } from './services/CryptoService'

type CryptoStore = {
    cryptocurrencies: Cryptocurrency[]
    result: CryptoPrice
    loading: boolean
    fetchCryptos: () => Promise<void>
    fetchData: (pair: Pair) => Promise<void>
}

export const useCryptoStore = create<CryptoStore>()(devtools((set) => ({
    cryptocurrencies: [],
    result: {
        id: '',
        symbol: '',
        name: '',
        image: '',
        currency: '',
        current_price: 0,
        high_24h: 0,
        low_24h: 0,
        price_change_percentage_24h: 0,
        last_updated: ''
    },
    loading: false,
    fetchCryptos: async () => {
        const cryptocurrencies = (await getCryptos()) ?? []
        set(() => ({
            cryptocurrencies
        }))
    },
    fetchData: async (pair) => {
        set(() => ({
            loading: true
        }))
        const result = await fetchCurrentCryptoPrice(pair)
        set(() => ({
            result,
            loading: false
        }))
    }
})))
