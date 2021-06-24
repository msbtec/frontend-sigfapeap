import React, { memo } from 'react';

import { FiAlertTriangle } from 'react-icons/fi';

import styled from 'styled-components';
import { Form } from "../../../../components/Form";

import { StyledModal } from './styles';
import { Button } from "../../../../components/Button";

import { Card } from '../../../../components/Card';

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

export default function Homologacao({
  project, setHomologacao, submit,
}) {
  return (
    <>
      <div className="col-12 title">
        <h1>Homologação</h1>
      </div>

      <div className="col-12 px-0">
        <Card className="red">
          <div>
            <div>
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
                    <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.recomendado1 }} />
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
                    <label dangerouslySetInnerHTML={{ __html: project?.avaliacao?.recomendado2 }} />
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }} />

            <div style={{ marginBottom: 40 }}>
              <Buttons style={{ justifyContent: 'flex-start', marginLeft: 17 }}>
                <Button onClick={() => setHomologacao(false)} className="primary">Voltar</Button>
                <Button onClick={() => submit(true)} className="success">Homologar</Button>
                <Button onClick={() => submit(false)} className="danger">Não Homologar</Button>
              </Buttons>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
