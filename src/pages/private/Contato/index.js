import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import moment from 'moment';

import SelectMultiple from "react-select";

import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { store } from 'react-notifications-component';
import { Form } from './Form2';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useAuth } from '../../../hooks/auth';
import { useContact } from '../../../hooks/contact';

import Resposta from './ResponderSolicitacao';

import api from '../../../services/api';

let ModalRequest = () => <></>;
let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Documentos() {
  const [OpenRequest, setOpenRequest] = useState(false);
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const { user } = useAuth();
  const { requests, getRequests, status } = useContact();

  const [resposta, setResposta] = useState(false);

  const prioridade = 'Todos'; // useParams();

  const [date, setDate] = useState("");

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [projects, setProjects] = useState([{ label: 'Todos', value: 'Todos' }]);
  const [selectedProject, setSelectedProject] = useState(
    { label: 'Todos', value: 'Todos' },
  );

  useEffect(() => {
    document.title = 'SIGFAPEAP - Solicitações';

    api.get(`user/${user.profile.name == 'Administrador' ? 0 : user.id}/projects`).then(({ data }) => {
      if (data.length > 0) {
        setProjects([...projects, ...data.map((item) => ({ label: item.title, value: item.id, coordenador_id: item.coordenador_id }))]);
      }
    });

    getRequests(undefined, prioridade, "Todos");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    getRequests(undefined, prioridade, selectedProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, prioridade, selectedProject]);

  useEffect(() => {
    getRequests(date, prioridade, selectedProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, prioridade, selectedProject]);

  async function toggleModalRequest() {
    ModalRequest = await lazy(() => import("./FormRequest"));

    setOpenRequest(!OpenRequest);
  }

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Form"));

    // setOpenForm(!OpenForm);
    setResposta(!resposta);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalRequest() {
    setOpenRequest(!OpenRequest);
    getRequests(undefined, prioridade, selectedProject);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
    setResposta(!resposta);
    getRequests(undefined, prioridade, selectedProject);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const formData = new FormData();
    formData.append("resposta", user.profile.name == 'Pesquisador' ? "Solicitação Cancelada pelo Coordenador" : "Solicitação Cancelada pelo Administrador");
    formData.append("solicitacao", selected.solicitacao);

    api.put(`contacts/${selected.id}`, formData).then(({ data }) => {
      getRequests(undefined, prioridade, selectedProject);

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
  }

  function largeName(value) {
    return value.split("").length > 255
      ? `${value
        .split("")
        .slice(0, 255)
        .join("")}...`
      : value;
  }

  return (
    <>
      {!resposta ? (
        <>
          <div className="col-12 title">
            <h1>Solicitações</h1>
          </div>
          <div className="col-12 px-0">
            <Card className="red">
              <div className="card-title">
                <h3>Listagem de solicitações</h3>

                {user.profile.name != 'Pesquisador'
                    && (
                    <Form>
                      <div style={{ marginBottom: 10 }} className="input-block">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>
                      <AiOutlineCloseCircle data-tip="Limpar Filtro" size={32} style={{ marginLeft: 10, color: "#48465b", cursor: 'pointer' }} onClick={() => setDate("")} />
                    </Form>
                    )}
              </div>

              <div className="col-12 px-0" style={{ marginTop: 20, marginBottom: 20 }}>
                <SelectMultiple
                  maxMenuHeight={150}
                  onMenuOpen={() => setMenuOpen(true)}
                  onMenuClose={() => setMenuOpen(false)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Projeto"
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
              </div>

              <div className="card-body">
                <Table>
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-3">Assunto</th>
                      <th className="col-2">Prioridade</th>
                      <th className="col-3">Protocolo</th>
                      <th className="col-1">Data</th>
                      <th className="col-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item, index) => (
                      <tr>
                        <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                        <td style={{ textAlign: 'center' }}>{ item.assunto }</td>
                        <td style={{ textAlign: 'center' }}>{ item.prioridade }</td>
                        <td style={{ textAlign: 'center' }}>{ item.protocolo }</td>
                        <td style={{ textAlign: 'center' }}>{ moment(item.date_beggin).format("L") }</td>
                        <td style={{ textAlign: 'center' }}>
                          {user.profile.name != 'Pesquisador'
                    && !item.resposta && (
                      <button
                        data-tip="Responder Solicitação"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                          )}

                          {!item.resposta && (
                          <button
                            data-tip="Cancelar Solicitação"
                            onClick={() => {
                              setSelected(item);
                              toggleModalConfirm();
                            }}
                            className="eraser"
                          >
                            <FiTrash />
                          </button>
                          )}

                          <ReactTooltip />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </div>

          <Suspense fallback={null}>
            <ModalProvider>
              <ModalRequest isOpen={OpenRequest} toggleModal={toggleModalRequest} submit={submitModalRequest} />
              <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} item={selected} submit={submitModalForm} />
              <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
            </ModalProvider>
          </Suspense>
        </>
      ) : (
        <Resposta isOpen={OpenForm} toggleModal={toggleModalForm} item={selected} submit={submitModalForm} />
      )}

    </>
  );
}
