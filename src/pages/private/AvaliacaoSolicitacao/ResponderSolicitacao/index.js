import React, {
  useRef,
} from 'react';

import { FiCheckCircle } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import { Card } from '../../../../components/Card';
import { Form } from '../../../../components/Form';

import api from '../../../../services/api';

import { StyledModal } from './styles';

export default function Atividades({
  setSolicitacao, item,
}) {
  const reference = useRef(null);

  function handleSubmit(status) {
    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("user_id", item.user_id);

      api.put(`requests/${item.id}`, formData).then(({ data }) => {
        setSolicitacao(false);

        store.addNotification({
          message: `Solicitação respondida com sucesso!`,
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>Responder Solicitação</h1>
      </div>

      <div className="col-12 px-0">
        <Card style={{ padding: 20, display: "flex", alignItems: 'flex-start' }} className="red">
          <div className="modal-body" ref={reference}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Assunto:
              </label>
              <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.assunto }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Solicitação:
              </label>
              <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.solicitacao }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Projeto:
              </label>
              <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.projeto?.title }} />
            </div>
          </div>

          <StyledModal>
            <div className="modal-footer">
              <button type="button" className="close" onClick={() => setSolicitacao(false)}>
                Voltar
              </button>
              <button onClick={() => handleSubmit("ACEITA")} className="submit">
                <FiCheckCircle />
                {' '}
                Aceitar
              </button>
              <button onClick={() => handleSubmit("RECUSADA")} className="refuse">
                <FiCheckCircle />
                {' '}
                Recusar
              </button>
            </div>
          </StyledModal>
        </Card>
      </div>
    </>
  );
}
