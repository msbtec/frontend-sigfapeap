import React, { memo } from 'react';

import { FiX } from 'react-icons/fi';

import styled from 'styled-components';
import { StyledModal } from './styles';
import { Button } from "../Button";

const Buttons = styled.div`
    display: flex;
    align-items:center;
    justify-content:center;
    margin-top: 10px;

    &.wrap {
        flex-wrap: wrap;
    }

    button {
        margin: 5px;
    }

`;

function Confirm({ isOpen, toggleModal, submit }) {
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      {/* <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Atenção</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div> */}
      <div className="modal-body">
        <div className="icon">
          <FiX size="5em" />
        </div>
        <h1>Atenção!</h1>
        <p>Você realmente deseja excluir esse registro?</p>

        <Buttons className="wrap">
          <Button onClick={toggleModal} className="primary">Cancelar</Button>
          <Button onClick={submit} className="danger">Confirmar</Button>
        </Buttons>
      </div>
    </StyledModal>
  );
}

export default memo(Confirm);
