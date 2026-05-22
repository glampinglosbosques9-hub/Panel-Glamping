import LinearCard from "../../../components/molecules/cards/linearCard";
import { useFetch } from "../../../hooks/fetchConnect";
import { useEffect } from "react";
import { formatCurrency } from "../../../utils/formattersUtil";

export default function PagosCard({ refreshTrigger }) {
  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
    fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/payments/stats`);
  }, [refreshTrigger]);

  const pagosCardData = [
    {
      bgColor: '',
      texto: 'Pagos exitosos',
      colorTitulo: '#28a745',
      titulo: data?.successful_payments ? data.successful_payments[0]["Pagos exitosos"] : '0',
      icon: 'bi bi-cash-stack',
    },
    {
      bgColor: '',
      texto: 'Pagos rechazados',
      colorTitulo: '#ffc107',
      titulo: data?.rejected_payments ? data.rejected_payments[0]["Pagos rechazados"] : '0',
      icon: 'bi bi-cash-stack',
    },
    {
      bgColor: '',
      texto: 'Reembolsos pendientes',
      colorTitulo: '#dc3545',
      titulo: data?.pending_refunds ? data.pending_refunds[0]["Reembolsos pendientes"] : '0',
      icon: 'bi bi-cash-stack',
    },
    {
      bgColor: 'verde',
      texto: 'Ingresos',
      titulo: formatCurrency(data?.revenue ? data.revenue[0]["Ingresos"] : 0),
      icon: 'bi bi-cash-stack',
    },
  ];

  return (
    <>
      {loading && <p>Cargando estadísticas...</p>}
      {error && <p>Error al cargar datos</p>}
      
      <LinearCard
        data={pagosCardData}
      />
    </>
  );
}