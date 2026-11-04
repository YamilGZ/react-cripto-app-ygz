import axios from 'axios'
import { CryptoCurrenciesResponseSchema, CoinGeckoMarketsResponseSchema, CryptoPriceSchema } from '../schema/crypto-schema'
import type { Pair } from '../types'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets'

/**
 * Obtiene la tasa de cambio actual desde USD hacia otra moneda.
 * Utiliza la API pública de open.er-api.com (ExchangeRate-API).
 *
 * @param moneda - Código ISO de la moneda destino.
 * @returns Factor de conversión o null si falla la consulta.
 */
export const obtenerTasaUSD = async (moneda: string): Promise<number | null> => {
    if (moneda === 'USD') {
        return 1
    }

    try {
        const { data } = await axios.get('https://open.er-api.com/v6/latest/USD')
        const tasa = data?.rates?.[moneda]
        return typeof tasa === 'number' ? tasa : null
    } catch (error) {
        console.error('Error al obtener tasa de cambio:', error)
        return null
    }
}

/**
 * Obtiene las principales criptomonedas por capitalización de mercado desde CoinGecko.
 */
export async function getCryptos() {
    const url = `${COINGECKO_API_URL}?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`
    try {
        const { data } = await axios.get(url)
        const result = CryptoCurrenciesResponseSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        console.error('Error al consultar CoinGecko:', error)
    }
}

/**
 * Obtiene la cotización actual de una criptomoneda en la moneda fiduciaria seleccionada.
 * Si la moneda es PYG, consulta en USD y convierte usando la tasa del día.
 */
export async function fetchCurrentCryptoPrice(pair: Pair) {
    const monedaTarget = pair.currency.toUpperCase()
    const monedaAPI = monedaTarget === 'PYG' ? 'usd' : monedaTarget.toLowerCase()

    try {
        const { data } = await axios.get(COINGECKO_API_URL, {
            params: {
                vs_currency: monedaAPI,
                ids: pair.criptocurrency,
                order: 'market_cap_desc',
                per_page: 1,
                page: 1,
                sparkline: false,
            },
        })

        const parsed = CoinGeckoMarketsResponseSchema.safeParse(data)
        if (!parsed.success || parsed.data.length === 0) {
            return
        }

        const cripto = parsed.data[0]

        const resultado = CryptoPriceSchema.parse({
            id: cripto.id,
            symbol: cripto.symbol,
            name: cripto.name,
            image: cripto.image,
            currency: monedaTarget,
            current_price: cripto.current_price ?? 0,
            high_24h: cripto.high_24h ?? 0,
            low_24h: cripto.low_24h ?? 0,
            price_change_percentage_24h: cripto.price_change_percentage_24h ?? 0,
            last_updated: cripto.last_updated ?? '',
        })

        if (monedaTarget === 'PYG') {
            const tasa = await obtenerTasaUSD('PYG')
            if (tasa) {
                resultado.current_price = resultado.current_price * tasa
                resultado.high_24h = resultado.high_24h * tasa
                resultado.low_24h = resultado.low_24h * tasa
            }
        }

        return resultado
    } catch (error) {
        console.error('Error al cotizar:', error)
    }
}
