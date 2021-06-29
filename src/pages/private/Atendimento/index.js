import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import moment from 'moment';

import { FiEdit, FiTrash } from 'react-icons/fi';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';
import { Form } from './Form2';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useAuth } from '../../../hooks/auth';
import { useAttendance } from '../../../hooks/attendance';

import api from '../../../services/api';

let ModalRequest = () => <></>;
let ModalForm = () => <></>;
let ModalConfirm = () => <></>;
let ModalDetail = () => <></>;

export default function Documentos() {
  const [OpenRequest, setOpenRequest] = useState(false);
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [OpenDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const { user } = useAuth();
  const { requests, getRequests, status } = useAttendance();

  const [resposta, setResposta] = useState(false);

  const [date, setDate] = useState("");

  useEffect(() => {
    document.title = 'SIGFAPEAP - Fale Conosco';

    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    getRequests(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function toggleModalRequest() {
    ModalRequest = await lazy(() => import("./FormRequest"));

    setOpenRequest(!OpenRequest);
  }

  async function toggleModalDetail() {
    ModalDetail = await lazy(() => import("./FormDetail"));

    setOpenDetail(!OpenDetail);
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

  function submitModalDetail() {
    setOpenDetail(!OpenDetail);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
    setResposta(!resposta);
    getRequests();
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const formData = new FormData();
    formData.append("resposta", user.profile.name == 'Pesquisador' ? "Solicitação Cancelada pelo Coordenador" : "Solicitação Cancelada pelo Administrador");
    formData.append("solicitacao", selected.solicitacao);

    api.put(`attendances/${selected.id}`, formData).then(({ data }) => {
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

  return (
    <>
      <div className="col-12 title">
        <h1>Solicitações</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            {user.profile.name == 'Pesquisador' && (
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {
                setSelected(null);
                toggleModalRequest();
              }}
              className="primary"
            >
              Enviar Solicitação
            </Button>
            )}

            {user.profile.name != 'Pesquisador'
                    && (
                    <h3>Listagem de solicitações</h3>
                    )}

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

          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-3">Assunto</th>
                  <th className="col-3">Solicitação</th>
                  <th className="col-3">Resposta</th>
                  <th className="col-1">Data</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.assunto }</td>
                    <td style={{ textAlign: 'center' }}>{ item.solicitacao }</td>
                    <td style={{ textAlign: 'center' }}>{ item.protocolo }</td>
                    <td style={{ textAlign: 'center' }}>{ moment(item.date_beggin).format("L") }</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.resposta && (
                        <button
                          data-tip="Detalhes"
                          onClick={() => {
                            setSelected(item);
                            toggleModalDetail();
                          }}
                          className="edit"
                        >
                          <FiEdit />
                        </button>
                      )}

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
          <ModalDetail isOpen={OpenDetail} toggleModal={toggleModalDetail} item={selected} submit={submitModalDetail} />
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
        </ModalProvider>
      </Suspense>
    </>

  );
}
