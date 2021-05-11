import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiEdit, FiTrash } from 'react-icons/fi';

import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useAuth } from '../../../hooks/auth';
import { useContact } from '../../../hooks/contact';

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

  useEffect(() => {
    document.title = 'SIGFAPEAP - Fale Conosco';

    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function toggleModalRequest() {
    ModalRequest = await lazy(() => import("./FormRequest"));

    setOpenRequest(!OpenRequest);
  }

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Form"));

    setOpenForm(!OpenForm);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalRequest() {
    setOpenRequest(!OpenRequest);
    getRequests();
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
    getRequests();
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const formData = new FormData();
    formData.append("resposta", user.profile.name == 'Pesquisador' ? "Solicitação Cancelada pelo Coordenador" : "Solicitação Cancelada pelo Administrador");

    api.put(`contacts/${selected.id}`, formData).then(({ data }) => {
      getRequests();

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
      <div className="col-12 title">
        <h1>Fale Conosco</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de solicitações</h3>
          </div>

          {user.profile.name == 'Pesquisador'
            && (
            <div className="card-title">
              <div style={{ display: 'flex' }}>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setSelected(null);
                    toggleModalRequest();
                  }}
                  className="primary"
                >
                  Nova Solicitação
                </Button>
              </div>
            </div>
            )}

          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-2">Assunto</th>
                  <th className="col-1">Protocolo</th>
                  <th className="col-2">Coordenador</th>
                  <th className={user.profile.name == 'Pesquisador' ? "col-2" : "col-4"}>Solicitação</th>
                  {user.profile.name == 'Pesquisador' && <th className="col-2">Resposta</th>}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.assunto }</td>
                    <td style={{ textAlign: 'center' }}>{ item.projeto.protocolo }</td>
                    <td style={{ textAlign: 'center' }}>{ item.projeto.coordenador.name }</td>
                    <td style={{ marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: largeName(item.solicitacao) }} />
                    {user.profile.name == 'Pesquisador' && <td style={{ marginTop: 10, textAlign: 'center', color: item.resposta ? "#080" : "#F00" }} dangerouslySetInnerHTML={{ __html: item.resposta ? largeName(item.resposta) : "Aguardando Resposta" }} />}
                    <td style={{ textAlign: 'center' }}>
                      {user.profile.name != 'Pesquisador'
                    && (
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

                      {!item.resposta
                    && (
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
  );
}
