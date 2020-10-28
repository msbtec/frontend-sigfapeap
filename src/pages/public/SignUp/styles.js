import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 50px;
`;

export const Content = styled.div`
    padding: 50px;
    border-radius: 10px;
    box-shadow: 1px 1px 20px 10px #dcdcdc;

    button{
        margin-top: 40px;
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        background: #b20710;
        height: 42px;
        border: 2px solid #b20710;
        border-radius: 5px;
        width: 20%;
        font-weight: bold;
        transition: all 0.2s;
    }

    button:hover{
        opacity: 0.98;
        box-shadow: 0 1px 6px 0 #b20710;

    }
`;
