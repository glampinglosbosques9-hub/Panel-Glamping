import SquareCard from "../../components/molecules/cards/squareCard";
import { reservasCardData } from "./componentsData/reservasData";
import styled from "styled-components";

import { useFilters } from "../../hooks/useFilters";
import { deleteUtils } from "../../utils/deleteUtils";
import { activateUtils } from "../../utils/activateUtils";

import BotonAgregar from "../../components/atoms/buttons/botonAgregar";
import LinearGraph from "../../components/organisms/graphs/linearGraph";
import TablaGeneral from "../../components/organisms/tabla";
import { useFetch } from "../../hooks/fetchConnect";
import { useState, useEffect } from "react";

import 
  ReservasSearch, 
  { reservationFilterConfig } 
from "./componentsData/reservasSearch";

import ModalClientes from "./modales/modalClientes";
import ModalPaquete from "./modales/modalPaquete";
import ModalEditar from "./modales/modalEditar";
import ModalComprobante from "./modales/modalComprobante";

const CardsCont = styled.div`
  margin: 50px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Botones = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 750px) {
    flex-direction: column;
    gap: 10px;
  }
`;

function Reservas({ modulo }) {
  const { data, loading, error, fetchData } = useFetch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedComprobante, setSelectedComprobante] = useState(null);

  const [reservas, setReservas] = useState(null);
  const { displayData, setFilterMode, fetchFilters } = useFilters(
    data,
    reservas,
    reservationFilterConfig
  );
  const [refreshStatsTrigger, setRefreshStatsTrigger] = useState(0);
  const { data: statsData, fetchData: fetchStats } = useFetch();

  const handleFetchData = () => {
    setReservas(null);
    fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`);
    fetchFilters();
    setRefreshStatsTrigger((prev) => prev + 1);
  }

  useEffect(() => {
    fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`);
    fetchStats(`${import.meta.env.VITE_API_BASE_URL}/api/reservations/stats`);
  }, [fetchData, fetchStats, refreshStatsTrigger]);

  const handleClientClick = (fila) => {
    setSelectedClient(fila);
  };

  const handlePackageClick = (fila) => {
    setSelectedPackage(fila);
  };

  const handleFacturaClick = (fila) => {
    setSelectedComprobante(fila);
  };
  
  const editarReserva = (reserva) => {
    setSelectedReserva(reserva);
    setModalEditarAbierto(true);
  };

  const closeMenu = () => {
    setSelectedClient(null);
    setSelectedPackage(null);
    setSelectedReserva(null);
    setSelectedComprobante(null);
  };

  const activarReserva = (reserva) => {
    activateUtils.activarRegistro(
      "reservations",
      reserva.id,
      "reserva de: " + reserva.cliente,
      handleFetchData,
    );
  };

  const onColumnClickHandlers = {
    cliente: handleClientClick,
    paquete: handlePackageClick,
    'Pago restante': handleFacturaClick
  };

  const handleStateChange = async (reserva, nuevoEstado) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reservations/updateStatus/${reserva.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        handleFetchData();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error actualizando el estado:", error);
      alert("Error actualizando el estado");
    }
  };

  const stateChangeConfig = {
    col: 'estado',
    options: ['por evaluar', 'Aceptado', 'Cancelado', 'Pago invalido'],
    onChange: handleStateChange
  };

  return (
    <>
      <CardsCont>
        <LinearGraph data={statsData?.revenue_graph} title="Ganancias por mes" />
        <SquareCard squareData={reservasCardData} />
      </CardsCont>
      <Botones>
        <ReservasSearch onResult={setReservas} onFilterChange={setFilterMode} />
      </Botones>

      {loading && <p style={{ marginTop: '20px' }}>Cargando reservas...</p>}
      {error && <p style={{ marginTop: '20px', color: 'red' }}>Error: {error}</p>}
      {displayData && (
        <TablaGeneral
          data={displayData}
          onColumnClick={onColumnClickHandlers}
          onActive={activarReserva}
          onEdit={editarReserva}
          onStateChange={stateChangeConfig}
        />
      )}

      {selectedClient && (
        <ModalClientes
          id={selectedClient.cliente_id}
          onClose={closeMenu}
        />
      )}

      {selectedPackage && (
        <ModalPaquete
          id={selectedPackage.paquete_id}
          onClose={closeMenu}
        />
      )}

      {selectedComprobante && (
        <ModalComprobante
          reserva={selectedComprobante}
          onClose={closeMenu}
        />
      )}

      {selectedReserva && (
        <ModalEditar
          reservaAEditar={selectedReserva}
          setModalAbierto={closeMenu}
          fetchData={handleFetchData}
        />
      )}
    </>
  );
}

export default Reservas;
