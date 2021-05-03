import React, { memo } from 'react';

import { FiAlertTriangle } from 'react-icons/fi';

import styled from 'styled-components';
import { Form } from "../Form";

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

function Confirm({
  isOpen, project, toggleModal, submit,
}) {
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      {/* <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel" />
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div> */}

      <div className="modal-body">
        <div className="icon">
          <FiAlertTriangle size="5em" />
        </div>
        <h1>Atenção!</h1>
        <p>Você realmente deseja homologar esse projeto?</p>

        <div style={{ maxHeight: 400 }}>
          <div style={{
            backgroundColor: "#eeeeee", padding: 10, borderRadius: 5, margin: 20,
          }}
          >
            <p>
              <h4 style={{ marginRight: 5 }}>Avaliador 1:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.avaliador1?.name }} />
            </p>

            <p>
              <h4>Avaliação:</h4>
              <p style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: project?.avaliacao?.analise1 }} />
            </p>

            <p>
              <h4 style={{ marginRight: 5 }}>Nota:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.nota1 }} />
            </p>

            <p>
              <h4 style={{ marginRight: 5 }}>Recomendado:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.recomendado1 == "true" ? "SIM" : "NÃO" }} />
            </p>
          </div>

          <div style={{
            backgroundColor: "#eeeeee", padding: 10, borderRadius: 5, margin: 20,
          }}
          >
            <p>
              <h4 style={{ marginRight: 5 }}>Avaliador 2:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.avaliador2?.name }} />
            </p>

            <p>
              <h4>Avaliação:</h4>
              <p style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: project?.avaliacao?.analise2 }} />
            </p>

            <p>
              <h4 style={{ marginRight: 5 }}>Nota:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.nota2 }} />
            </p>

            <p>
              <h4 style={{ marginRight: 5 }}>Recomendado:</h4>
              <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.recomendado2 == "true" ? "SIM" : "NÃO" }} />
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }} />

      <div className="modal-footer">
        <Buttons className="wrap">
          <Button onClick={() => submit(true)} className="success">Homologar</Button>
          <Button onClick={() => submit(false)} className="danger">Não Homologar</Button>
          <Button onClick={toggleModal} className="primary">Fechar</Button>
        </Buttons>

      </div>
    </StyledModal>
  );
}

export default memo(Confirm);
