import { useMemo } from "react"
import { useCryptoStore } from "../store"
import { formatearCantidad } from "../helpers"
import Spinner from "./Spinner"

export default function CryptoPriceDisplay() {

    const result = useCryptoStore((state) => state.result)
    const loading = useCryptoStore((state) => state.loading)
    const hasResult = useMemo(() => result.id !== '', [result])

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

  return (
     <div className="result-wrapper">
            {loading ? <Spinner /> : hasResult && (
                <>
                    <h2>Cotización</h2>
                    <div className="result">
                        {result.image && (
                            <img
                                src={result.image}
                                alt={`Imagen ${result.name}`}
                            />
                        )}
                        <div>
                            <p className="crypto-name">
                                {result.name} ({result.symbol.toUpperCase()})
                            </p>
                            <p>El precio es de: <span>{formatearCantidad(result.current_price, result.currency || 'USD')}</span></p>
                            <p>Precio más alto del día: <span>{formatearCantidad(result.high_24h, result.currency || 'USD')}</span></p>
                            <p>Precio más bajo del día: <span>{formatearCantidad(result.low_24h, result.currency || 'USD')}</span></p>
                            <p>
                                Variación últimas 24 horas:{" "}
                                <span
                                    className={result.price_change_percentage_24h >= 0 ? 'alza' : 'baja'}
                                >
                                    {result.price_change_percentage_24h.toFixed(2)}%
                                </span>
                            </p>
                            <p>Última actualización: <span>{formatDate(result.last_updated)}</span></p>
                        </div>
                    </div>
                </>
            )}
        </div>
  )
}
