import styled, { css } from 'styled-components';

export const Container = styled.div`
  background: #f7f8f9;
  border-radius: 10px;
  padding: 16px;
  width: 100%;

  margin-top: 10px;
  margin-bottom: 10px;

  border: 2px solid #d5dde0;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${(props) => props.isErrorred
    && css`
      border-color: #c53030;
    `}

  ${(props) => props.isFocused
    && css`
      color: #32bab6;
      border-color: #32bab6;
    `}

    ${(props) => props.isFilled
    && css`
      color: #32bab6;
    `}

    input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #3e4958;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Title = styled.span`
  color: #3e4958;
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: flex-start;
`;
