import styled from "styled-components";

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: #222222;
  padding: 20px;
  height: 150px;
  border-radius: 5px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.$bgColor == 'verde' ? '#43523A' : '#ffffff'};
  color: ${(props) => props.$bgColor === 'verde' ? '#ffffff' : '#343434'};

  p, h5{
    width: 280px;
    margin: 0;
    font-size: 12px;

    @media (max-width: 400px) {
      width: 80%;
    }
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-items: start;
  gap: 0.5rem;
  width: 280px;

  i {
    font-size: 1.2rem;
  }

  @media (max-width: 400px) {
    width: 80%;
  }
`;

function RectangleCard({ rectangleData }) {
  return (
    <CardsContainer>
      {rectangleData.map((item, i) => (
        <Card key={i} $bgColor={item.bgColor}>
          <CardTitle>
            <i className={item.icono}></i>
            <h5>{item.titulo}</h5>
          </CardTitle>
          <h3>{item.info}</h3>
          <p>{item.texto}</p>
        </Card>
      ))}
    </CardsContainer>
  );
}

export default RectangleCard;