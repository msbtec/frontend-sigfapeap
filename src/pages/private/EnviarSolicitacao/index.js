import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import SelectMultiple from "react-select";

import { FiCheckCircle, FiFile } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import { useHistory, useParams } from 'react-router-dom';

import * as Yup from 'yup';

import { StyledModal } from './styles';
import { Card } from '../../../components/Card';
import { useAuth } from '../../../hooks/auth';
import Input from '../../../components/Input';
import { Form } from '../../../components/Form';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

export default function EnviarSolicitacao() {
  const { id } = useParams();

  const history = useHistory();

  const [documents, setDocuments] = useState(null);

  const reference = useRef(null);
  const formRef = useRef(null);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuOpen2, setMenuOpen2] = React.useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useAuth();

  const [errorFile, setErrorFile] = useState('');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [prioridades, setPrioridades] = useState([
    { label: 'Regular', value: 'Regular' },
    { label: 'Urgente', value: 'Urgente' },
  ]);
  const [selectedPrioridade, setSelectedPrioridade] = useState({ label: 'Regular', value: 'Regular' });

  const [description, setDescription] = useState("");

  useEffect(() => {
    document.title = 'SIGFAPEAP - Enviar Solicitação';

    api.get(`documents/${id}`).then(({ data }) => {
      setDocuments(data);
    });

    api.get(`user/${user.profile.name == 'Administrador' ? 0 : user.id}/projects`).then(({ data }) => {
      if (data.length > 0) {
        const filter = data.filter((item) => item.coordenador_id == user.id);
        if (filter.length > 0) {
          setProjects(filter.map((item) => ({ label: item.title, value: item.id, coordenador_id: item.coordenador_id })));
          setSelectedProject({ label: filter[0].title, value: filter[0].id, coordenador_id: filter[0].coordenador_id });
        }
      }
    });
  }, [id, user]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          assunto: Yup.string().required('Campo obrigatório'),
        });

        if (!selectedFile) {
          setErrorFile('Campo obrigatório');
        } else {
          setErrorFile('');
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedFile) {
          const formData = new FormData();
          formData.append("assunto", data.assunto);
          formData.append("prioridade", selectedPrioridade.value);
          formData.append("solicitacao", description);
          formData.append("project_id", selectedProject.value);
          formData.append("user_id", user.id);
          formData.append("document_id", id);

          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          api.post(`contacts`, formData).then(({ data }) => {
            history.goBack();
            store.addNotification({
              message: `Solicitação enviada com sucesso. A FAPEAP terá prazo de 5 dias úteis para responder a solicitação!`,
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
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [id, history, description, user, selectedProject, selectedPrioridade, selectedFile],
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
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#626262',
                    }}
                    className="required"
                  >
                    Projeto
                  </label>
                  <div style={{ marginTop: 5 }} />
                  <SelectMultiple
                    maxMenuHeight={150}
                    onMenuOpen={() => setMenuOpen(true)}
                    onMenuClose={() => setMenuOpen(false)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Projetos"
                    value={selectedProject}
                    noOptionsMessage={({ inputValue }) => "Sem opções"}
                    options={projects}
                    onChange={(values) => setSelectedProject(values)}
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

                  {menuOpen && <div style={{ marginTop: 200 }} />}

                  {selectedProject
                    && (
                    <>
                      <div style={{ marginTop: 10 }} />
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#626262',
                        }}
                        className="required"
                      >
                        Prioridade
                      </label>
                      <div style={{ marginTop: 5 }} />
                      <SelectMultiple
                        maxMenuHeight={150}
                        onMenuOpen={() => setMenuOpen2(true)}
                        onMenuClose={() => setMenuOpen2(false)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Prioridades"
                        value={selectedPrioridade}
                        noOptionsMessage={({ inputValue }) => "Sem opções"}
                        options={prioridades}
                        onChange={(values) => setSelectedPrioridade(values)}
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

                        {menuOpen2 && <div style={{ marginTop: 100 }} />}

                      <Input formRef={formRef} name="assunto" required original title="Assunto" />

                      <div className="input-block">
                        <label style={{ marginBottom: 10 }}>
                          Solicitação
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

                      <div style={{ marginBottom: 10 }} className="input-block">
                        <label htmlFor="email">
                          Anexo
                          <sup style={{ color: "#f00" }}>*</sup>
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
                            { selectedFile ? selectedFile.name : 'Selecione um anexo' }
                          </div>
                          <div className="icon">
                            <FiFile />
                          </div>
                        </label>
                        <sup style={{ color: '#c53030', marginTop: 5 }}>
                          {errorFile}
                        </sup>
                      </div>
                    </>
                    )}
                </div>

                <StyledModal>
                  <div className="modal-footer">
                    <button type="submit" className="submit">
                      <FiCheckCircle />
                      {' '}
                      Salvar
                    </button>
                  </div>
                </StyledModal>
              </Form>
            </Unform>
          </div>
        </Card>
      </div>
    </>
  );
}
