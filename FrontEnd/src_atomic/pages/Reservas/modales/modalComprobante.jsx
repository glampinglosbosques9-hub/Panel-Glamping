import styled from "styled-components";
import ModalPlantilla from "../../../components/organisms/Modales/modalPlantilla";
import { formatCurrency } from "../../../utils/formattersUtil";

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: #fdfdfd;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: #777;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  align-self: flex-start;
  background-color: ${(props) => props.$bgColor || '#f0f0f0'};
  color: ${(props) => props.$textColor || '#555'};
`;

const ReceiptSection = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PreviewFrame = styled.div`
  width: 100%;
  border: 1.5px dashed #ccc;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  box-sizing: border-box;
`;

const PreviewImg = styled.img`
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.03);
  }
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #43523A;
  color: white !important;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.2s;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #2E3A27;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #777;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  i {
    font-size: 2.2rem;
    color: #ccc;
  }

  p.title {
    font-size: 0.9rem;
    font-weight: bold;
    color: #555;
    margin: 0;
  }

  p.desc {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }
`;

function ModalComprobante({ reserva, onClose }) {
  if (!reserva) return null;

  // Determine badge colors based on state
  const getBadgeStyles = (estado) => {
    const est = String(estado).toLowerCase();
    if (est.includes("pagado")) {
      return { bg: "#e6f4ea", text: "#137333" };
    }
    if (est.includes("confirmado") || est.includes("confirmada")) {
      return { bg: "#e8f0fe", text: "#1a73e8" };
    }
    if (est.includes("pendiente") || est.includes("temporal")) {
      return { bg: "#fef7e0", text: "#b06000" };
    }
    if (est.includes("cancelado") || est.includes("cancelada")) {
      return { bg: "#fce8e6", text: "#c5221f" };
    }
    return { bg: "#f1f3f4", text: "#5f6368" };
  };

  const badgeStyles = getBadgeStyles(reserva.estado);
  const hasReceipt = reserva.factura_url && reserva.factura_url !== "N / A" && reserva.factura_url !== "";

  return (
    <ModalPlantilla titulo="Comprobante de Reserva" onClose={onClose}>
      <InfoGrid>
        <InfoItem>
          <Label>Factura ID</Label>
          <Value>#{reserva.factura_id || "N/A"}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Estado</Label>
          <Badge $bgColor={badgeStyles.bg} $textColor={badgeStyles.text}>
            {reserva.estado || "Desconocido"}
          </Badge>
        </InfoItem>
        <InfoItem>
          <Label>Cliente</Label>
          <Value>{reserva.cliente || "N/A"}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Paquete</Label>
          <Value>{reserva.paquete || "N/A"}</Value>
        </InfoItem>
        <InfoItem style={{ gridColumn: "span 2" }}>
          <Label>Pago Restante</Label>
          <Value style={{ color: "#d93025" }}>
            {formatCurrency(reserva["Pago restante"] || reserva.pago_restante)}
          </Value>
        </InfoItem>
      </InfoGrid>

      <ReceiptSection>
        <Label>Archivo de Comprobante</Label>
        {hasReceipt ? (
          <PreviewFrame>
            <PreviewImg
              src={reserva.factura_url}
              alt="Comprobante de pago"
              onClick={() => window.open(reserva.factura_url, "_blank")}
              title="Click para ver en pantalla completa"
            />
            <ActionButton
              href={reserva.factura_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: "10px" }}
            >
              <i className="bi bi-box-arrow-up-right"></i> Ver Pantalla Completa
            </ActionButton>
          </PreviewFrame>
        ) : (
          <PreviewFrame>
            <EmptyState>
              <i className="bi bi-file-earmark-x-fill"></i>
              <p className="title">Sin comprobante digital</p>
              <p className="desc">No se ha subido una captura de pago para esta reserva.</p>
            </EmptyState>
          </PreviewFrame>
        )}
      </ReceiptSection>
    </ModalPlantilla>
  );
}

export default ModalComprobante;
