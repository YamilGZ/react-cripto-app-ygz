/**
 * Formatea un número como moneda usando el locale y currency apropiados.
 * Soporta PYG, USD, MXN, EUR y GBP.
 *
 * @param cantidad - Valor numérico a formatear.
 * @param moneda - Código ISO de la moneda (PYG, USD, MXN, EUR, GBP).
 * @returns Cadena formateada como moneda local.
 */
export const formatearCantidad = (cantidad: number, moneda: string): string => {
    const currencyMap: Record<string, string> = {
        PYG: 'es-PY',
        USD: 'en-US',
        MXN: 'es-MX',
        EUR: 'es-ES',
        GBP: 'en-GB',
    }

    return cantidad.toLocaleString(currencyMap[moneda] ?? 'en-US', {
        style: 'currency',
        currency: moneda,
    })
}
