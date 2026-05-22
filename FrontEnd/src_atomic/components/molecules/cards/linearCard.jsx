import styled from 'styled-components';

const CardsContainer = styled.div`
margin: 50px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const Card = styled.button`
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s ease;

  display: grid;
  justify-items: center;
  align-content: center;
  gap: 15px;

  background: ${(props) => props.$bgColor == 'verde' ? '#43523A' : '#ffffff'};
  color: ${(props) => props.$bgColor === 'verde' ? '#ffffff' : '#1a1a1a'};

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: ${(props) => props.color || '#ffffff'};

  i {
    font-size: 20px;
    margin: 0;
  }

  h4 {
    font-size: 16px;
    margin: 0;
  }
`;

const CardText = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

function LinearCard({ data }) {
  return (
    <CardsContainer>
      {data.map((item, i) => (
        <Card key={i} $bgColor={item.bgColor}>
          <CardText>{item.texto}</CardText>
          <CardTitle color={item.colorTitulo}>
            <h4>{item.titulo}</h4>
            <i className={item.icon}></i>
          </CardTitle>
        </Card>
      ))}
    </CardsContainer>
  );
}

export default LinearCard;
