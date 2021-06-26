import React from 'react';

import { StyledModal } from './styles';
import { Card } from '../../../../components/Card';
import { Form } from '../../../../components/Form';

export default function EnviarSolicitacao({ setAvaliador }) {
  return (
    <>
      <div className="col-12 title">
        <h1>Novo Avaliador</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Form>
              <StyledModal>
                <div className="modal-footer">
                  <button type="button" className="close" onClick={() => setAvaliador(false)}>
                    Voltar
                  </button>
                </div>
              </StyledModal>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}
