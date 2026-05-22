import styled from "styled-components";

const ButtonAgg = styled.button`
    background: ${(props) => props.color === 1 ? '#43523A' : '#ffffff'};
    color: ${(props) => props.color === 1 ? '#ffffff' : '#363636'};
    cursor: pointer;

    border: 0;
    border-radius: 5px;
    padding: 10px 20px;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

function BotonGeneral({ data, onClick }) {
    return(
        <ButtonAgg color={data.color} onClick={onClick}>
            <i className={data.icon}></i>
            {data.texto}
        </ButtonAgg>
    );
}

export default BotonGeneral;