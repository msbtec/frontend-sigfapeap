import React, {
  useRef, useState, useCallback,
} from 'react';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';

import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import SelectMultiple from "react-select";
import { Card } from '../../../../components/Card';
import getValidationErrors from '../../../../utils/getValidationErrors';
import Input from '../../../../components/Input';
import api from '../../../../services/api';

import { Form } from '../../../../components/Form';

import { Content } from './styles';

export default function Avaliacao({
  formRef, project, getProject, toggleModal, submit, setAvaliacao,
}) {
  const reference = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  const recomendacoes = [
    {
      value: 'RECOMENDADO',
      label: 'RECOMENDADO',
    },
    {
      value: 'RECOMENDADO, COM AJUSTES',
      label: 'RECOMENDADO, COM AJUSTES',
    },
    {
      value: 'NÃO RECOMENDADO',
      label: 'NÃO RECOMENDADO',
    },
  ];

  const [recomendado, setRecomendado] = useState({
    value: 'RECOMENDADO',
    label: 'RECOMENDADO',
  });

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          note: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const params = new FormData();

        if (project.avaliacao.avaliador2_id == null) {
          //   params = {
          //     id: project.avaliacao.id,
          //     analise1: description == "" ? "<p>SEM DESCRIÇÃO</p>" : description,
          //     nota1: data.note,
          //     recomendado1: recomendado.value,
          //     responsavel_id: null,
          //   };

          params.append("id", project.avaliacao.id);
          params.append("analise1", description == "" ? "<p>SEM DESCRIÇÃO</p>" : description);
          params.append("nota1", data.note);
          params.append("recomendado1", recomendado.value);
        //   params.append("responsavel_id", null);
        } else {
          //   params = {
          //     id: project.avaliacao.id,
          //     analise2: description == "" ? "<p>SEM DESCRIÇÃO</p>" : description,
          //     nota2: data.note,
          //     recomendado2: recomendado.value,
          //     responsavel_id: null,
          //   };

          params.append("id", project.avaliacao.id);
          params.append("analise2", description == "" ? "<p>SEM DESCRIÇÃO</p>" : description);
          params.append("nota2", data.note);
          params.append("recomendado2", recomendado.value);
        //   params.append("responsavel_id", null);
        }

        if (selectedFile) {
          params.append("file", selectedFile);
        }

        api.post(`evaluations`, params).then(({ data }) => {
          store.addNotification({
            message: `Atualizado com sucesso!`,
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

          getProject();

          submit();
        }).catch((error) => {
          store.addNotification({
            message: `Erro ao atualizar!`,
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
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, recomendado, description, selectedFile],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Avaliação</h1>
      </div>

      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Form>
              <Unform ref={formRef} onSubmit={handleSubmit}>
                <div className="modal-body" ref={reference}>
                  <div>
                    <div style={{ marginBottom: 10 }} className="input-block">
                      <label>
                        Descrição
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

                    <div>
                      <Input formRef={formRef} name="note" type="number" step="any" required original title="Nota" />

                      <div style={{ marginBottom: 10 }} className="input-block">
                        <label htmlFor="email">
                          Anexo
                          {' '}
                          {/* <sup style={{ color: "#f00" }}>* Tamanho máximo 3MB</sup> */}
                        </label>
                        <div style={{ marginBottom: 5 }} />
                        <label style={{ borderColor: errorFile ? "#f00" : "#dee2e6" }} className="file-input">
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
                        <sup style={{ color: '#c53030', marginTop: 5 }}>
                          {errorFile}
                        </sup>
                      </div>

                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#626262',
                        }}
                        className="required"
                      >
                        Recomendação
                      </label>
                      <div style={{ marginTop: 5 }} />
                      <SelectMultiple
                        maxMenuHeight={150}
                        onMenuOpen={() => setMenuOpen(true)}
                        onMenuClose={() => setMenuOpen(false)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Recomendado"
                        value={recomendado}
                        noOptionsMessage={({ inputValue }) => "Sem opções"}
                        options={recomendacoes}
                        onChange={(values) => setRecomendado(values)}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 5,
                          colors: {
                            ...theme.colors,
                            primary25: "#080",
                            primary: "#dee2e6",
                          },
                        })}
                        styles={{
                          option: (provided, state) => ({
                            ...provided,
                            color: state.isSelected ? "#fff" : "rgb(102,102,102)",
                            backgroundColor: state.isSelected ? "rgb(102,102,102)" : "#fff",

                            ":active": {
                              ...provided[":active"],
                              backgroundColor: !state.isDisabled && "#dee2e6",
                            },
                          }),
                        }}
                      />

                      {menuOpen && <div style={{ marginTop: 150 }} />}
                    </div>
                  </div>
                </div>

                <Content>
                  <div style={{ marginTop: 20 }}>
                    <button style={{ width: 150, marginRight: 20 }} type="button" onClick={() => setAvaliacao(false)}>
                      <FiX />
                      {' '}
                      Voltar
                    </button>
                    <button
                      style={{ width: 150 }}
                      type="submit"
                    >
                      <FiCheckCircle />
                      {' '}
                      Salvar
                    </button>
                  </div>
                </Content>
              </Unform>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
}
