import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiEdit, FiTrash } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import api from '../../../services/api';

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Documentos() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const [requests, setRequests] = useState([]);

  async function getRequests() {
    api.get(`contacts`).then(({ data }) => {
      setRequests(data);
    });
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Fale Conosco';

    getRequests();
  }, []);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Form"));

    setOpenForm(!OpenForm);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
    getRequests();
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const formData = new FormData();
    formData.append("resposta", "Solicitação Cancelada pelo Administrador");

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
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-4">Assunto</th>
                  <th className="col-4">Solicitação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.assunto }</td>
                    <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: largeName(item.solicitacao) }} />
                    <td style={{ textAlign: 'center' }}>
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
          <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} item={selected} submit={submitModalForm} />
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
