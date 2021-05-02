import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 50px;
    display:flex;
    flex:1;
    justify-content:center;
    align-items:center;
`;

export const Content = styled.div`
    /* background: #fff; */
    padding: 50px;
    border-radius: 10px;
    box-shadow: 1px 1px 20px 10px #dcdcdc;

    button{
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        background: #b20710;
        height: 42px;
        border: 2px solid #b20710;
        border-radius: 5px;
        width: 40%;
        font-weight: bold;
        transition: all 0.2s;
    }

    button:hover{
        opacity: 0.98;
        box-shadow: 0 1px 6px 0 #b20710;

    }
`;

export const Footer = styled.div`
  margin-top: 40px;
  padding: 30px 25px;
  display:flex;
  justify-content:center;
  align-items:center;
`;

export const DotsContainer = styled.div`
  flex-direction: row;
  margin: 0 auto 25px;
`;

export const Dots = styled.div`
  margin: 0 10px;
  border-radius: 4px;
  height: 8px;
  width: 35px;
  background: ${({ isFilled }) => (isFilled ? "#b20710" : "#999")};
`;
