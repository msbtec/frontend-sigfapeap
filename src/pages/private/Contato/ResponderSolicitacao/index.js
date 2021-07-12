import React, {
  useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import { Card } from '../../../../components/Card';
import { Form } from '../../../../components/Form';

import { useAuth } from '../../../../hooks/auth';

import getValidationErrors from '../../../../utils/getValidationErrors';

import api from '../../../../services/api';

import { StyledModal } from './styles';

export default function Atividades({
  toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const { user } = useAuth();

  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();
        formData.append("solicitacao", item.solicitacao);
        formData.append("resposta", description);

        api.put(`contacts/${item.id}`, formData).then(({ data }) => {
          submit();

          store.addNotification({
            message: `Resposta enviada com sucesso!`,
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
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [description, item, submit],
  );

  return (
    <>
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>Detalhes da Solicitação</h1>
      </div>

      <div className="col-12 px-0">
        <Card style={{ padding: 20 }} className="red">
          <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

            <Form>
              <div className="modal-body" ref={reference}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    Projeto:
                  </label>
                  <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.projeto?.title }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    Documento:
                  </label>
                  <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.documento?.title }} />
                  <div>
                    <td style={{ marginTop: 10, textAlign: 'center' }}>
                      <a className="url" href={item?.documento?.url} target="_blank">{item?.documento?.name}</a>
                    </td>
                  </div>
                </div>

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
                  <div style={{ overflowWrap: 'break-word', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item?.solicitacao }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    Anexo:
                  </label>
                  <td style={{ marginTop: 10, textAlign: 'center' }}>
                    <a className="url" href={item?.name ? item?.url : null} target="_blank">{item?.name ? item?.name : "Sem Anexo"}</a>
                  </td>
                </div>

                {item?.resposta
                && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                    Resposta:
                  </label>
                  <div style={{ overflowWrap: 'break-word', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item?.resposta }} />
                </div>
                )}

                {!item?.resposta
                && user.profile.name != 'Pesquisador' && (
                <div className="input-block">
                  <label>
                    Resposta
                  </label>
                  <textarea
                    rows={5}
                    style={{ borderColor: "rgb(153, 153, 153)", padding: 10 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                  />
                  <span style={{
                    display: "flex", color: '#626262', justifyContent: 'flex-end', fontSize: 11, marginBottom: -10,
                  }}
                  >
                    {`${description.length}/255 caracteres`}
                  </span>
                </div>
                )}
              </div>

              <StyledModal style={{ marginLeft: -5 }}>
                <div className="modal-footer">
                  <button type="button" className="close" onClick={toggleModal}>
                    Voltar
                  </button>
                  {!item?.resposta
                    && user.profile.name != 'Pesquisador' && (
                    <button type="submit" className="submit">
                      <FiCheckCircle />
                        {' '}
                      Responder
                    </button>
                  )}
                </div>
              </StyledModal>
            </Form>
          </Unform>
        </Card>
      </div>
    </>
  );
}
