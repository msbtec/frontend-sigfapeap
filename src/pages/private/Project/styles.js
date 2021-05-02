import styled from 'styled-components';

export const Link = styled.span`
  font-size: 14;
  color: #3699ff;

  &:hover {
    color: #3679ff;
    cursor: pointer;
  }
`;

export const Content = styled.div`
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
