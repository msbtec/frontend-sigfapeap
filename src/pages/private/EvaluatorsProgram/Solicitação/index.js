import React, { useCallback, useRef, useState } from 'react';

import { FiFile, FiCheckCircle } from 'react-icons/fi';

import { Form as Unform } from '@unform/web';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';
import { Card } from '../../../../components/Card';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';
import api from '../../../../services/api';

export default function Solicitacao({ project, evaluator, setSolicitacao }) {
  const formRef = useRef(null);
  const reference = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorSubject, setErrorSubject] = useState('');

  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
        });

        if (!description) {
          setErrorSubject('Campo obrigatório');
        } else {
          setErrorSubject('');
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!description) {
          throw 'Campo obrigatório';
        }

        const formData = new FormData();
        formData.append('assunto', data.title);
        formData.append('solicitacao', description);
        formData.append('project_id', project.id);
        formData.append('user_id', evaluator.id);

        api.post('requests', formData).then(({ data }) => {
          setSolicitacao(false);

          store.addNotification({
            message: `Solicitação enviada com sucesso!`,
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
    [formRef, description, project, evaluator, setSolicitacao],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Nova Solicitação</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Unform ref={formRef} onSubmit={handleSubmit}>

              <Form>
                <div className="modal-body" ref={reference}>
                  <Input formRef={formRef} name="title" required original title="Assunto" />

                  <div className="input-block">
                    <label>
                      Conteúdo
                      <sup style={{ color: "#f00" }}>*</sup>
                    </label>

                    <textarea
                      rows={5}
                      style={{ borderColor: errorSubject ? "rgb(197, 48, 48)" : "rgb(153, 153, 153)", padding: 10 }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={255}
                    />
                    <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                      <sup style={{ color: '#c53030', marginTop: 5 }}>
                        {errorSubject}
                      </sup>
                      <span style={{
                        color: '#626262', justifyContent: 'flex-end', fontSize: 11,
                      }}
                      >
                        {`${description.length}/255 caracteres`}
                      </span>
                    </div>

                  </div>

                  <div style={{ marginBottom: 10 }} className="input-block">
                    <label htmlFor="email">
                      Anexo
                    </label>
                    <div style={{ marginBottom: 5 }} />
                    <label style={{ borderColor: "#dee2e6" }} className="file-input">
                      <input
                        type="file"
                        placeholder="Arquivo"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            if (e.target.files[0].size / 1000000 > 3) {
                              store.addNotification({
                                message: `Seu arquivo: ${e.target.files[0].name} é muito grande! Max:${3}MB`,
                                type: 'danger',
                                insert: 'top',
                                container: 'top-right',
                                animationIn: ['animate__animated', 'animate__fadeIn'],
                                animationOut: ['animate__animated', 'animate__fadeOut'],
                                dismiss: {
                                  duration: 5000,
                                  onScreen: true,
                                },
                              });
                            } else {
                              setSelectedFile(e.target.files[0]);
                            }
                          }
                        }}
                      />
                      <div className="text">
                        { selectedFile ? selectedFile.name : 'Selecione um arquivo' }
                      </div>
                      <div className="icon">
                        <FiFile />
                      </div>
                    </label>
                  </div>
                </div>

                <Form>
                  <StyledModal>
                    <div className="modal-footer">
                      <button style={{ marginTop: 20 }} type="button" className="close" onClick={() => setSolicitacao(false)}>
                        Voltar
                      </button>
                      <button type="submit" className="submit">
                        <FiCheckCircle />
                        {' '}
                        Enviar
                      </button>
                    </div>
                  </StyledModal>
                </Form>
              </Form>
            </Unform>
          </div>
        </Card>
      </div>
    </>
  );
}
