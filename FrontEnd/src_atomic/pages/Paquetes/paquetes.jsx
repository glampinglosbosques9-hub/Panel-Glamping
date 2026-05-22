import styled from "styled-components";
import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/fetchConnect";

import { useFilters } from "../../hooks/useFilters";
import { deleteUtils } from "../../utils/deleteUtils";
import { activateUtils } from "../../utils/activateUtils";

import BotonAgregar from "../../components/atoms/buttons/botonAgregar";
import BotonTab from "../../components/atoms/buttons/button";
import TablaGeneral from "../../components/organisms/tabla";

import ModalAgregar from "./modales/modalAgregar";
import ModalEditar from "./modales/modalEditar";
import ModalEditarTipo from "./modales/modalEditarTipo";

import PaquetesCards from "./componentsData/paquetesCards";
import PaquetesSearch, {
  paquetesFilterConfig,
} from "./componentsData/paquetesSearch";

const CardsCont = styled.div`
  margin: 50px 0;
  display: grid;
  grid-template-columns: 65% 30%;
  align-items: center;
  gap: 20px;

  @media (max-width: 1300px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ModulosExtra = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 10px;
    background-color: #eeeeeeff;
    color: #363636;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      background-color: #d9d9d9ff;
    }
    &.active {
      background-color: #43523A;
      color: white;
    }
  }
`;

const Botones = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 750px) {
    flex-direction: column;
    gap: 10px;
  }
`;

function Paquetes() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [paqueteAEditar, setPaqueteAEditar] = useState(null);
  const { data, loading, error, fetchData } = useFetch();

  const [paquetes, setPaquetes] = useState(null);
  const [activeTab, setActiveTab] = useState('packages');
  const { displayData, setFilterMode, fetchFilters } = useFilters(
    data,
    paquetes,
    paquetesFilterConfig,
  );
  const [refreshStatsTrigger, setRefreshStatsTrigger] = useState(0);

  const handleFetchData = () => {
    setPaquetes(null);
    fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/${activeTab}`);
    fetchFilters();
    setRefreshStatsTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/packages`);
  }, [fetchData]);

  const editarPaquete = (paquete) => {
    setPaqueteAEditar(paquete);
    setModalEditarAbierto(true);
  };

  return (
    <>
      <CardsCont>
        <PaquetesCards refreshTrigger={refreshStatsTrigger} />
      </CardsCont>

      <ModulosExtra>
        <button
          className={activeTab === 'packages' ? 'active' : ''}
          onClick={() => {
            setActiveTab('packages');
            setPaquetes(null);
            fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/packages`);
          }}
        >paquetes</button>
        <button
          className={activeTab === 'packages/types' ? 'active' : ''}
          onClick={() => {
            setActiveTab('packages/types');
            setPaquetes(null);
            fetchData(`${import.meta.env.VITE_API_BASE_URL}/api/packages/types`);
          }}
        >tipos de paquetes</button>
      </ModulosExtra>

      <Botones>
        <PaquetesSearch onResult={setPaquetes} onFilterChange={setFilterMode} />
        <BotonAgregar
          modulo="Agregar tipo"
          color={1}
          onClick={() => setModalAbierto(true)}
        />
      </Botones>

      {loading && <p style={{ marginTop: "20px" }}>Cargando paquetes...</p>}
      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>Error: {error}</p>
      )}
      {displayData && (
        <TablaGeneral
          data={displayData}
          onEdit={editarPaquete}
        />
      )}

      {modalAbierto && (
        <ModalAgregar
          setModalAbierto={setModalAbierto}
          fetchData={handleFetchData}
        />
      )}

      {modalEditarAbierto && activeTab === 'packages' && paqueteAEditar && (
        <ModalEditar
          setModalAbierto={setModalEditarAbierto}
          fetchData={handleFetchData}
          paqueteAEditar={paqueteAEditar}
        />
      )}

      {modalEditarAbierto && activeTab === 'packages/types' && paqueteAEditar && (
        <ModalEditarTipo
          setModalAbierto={setModalEditarAbierto}
          fetchData={handleFetchData}
          tipoAEditar={paqueteAEditar}
        />
      )}
    </>
  );
}

export default Paquetes;
