import React, {
  useState, useEffect, lazy, Suspense,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { store } from 'react-notifications-component';

import { FiEdit, FiDownload, FiTrash } from 'react-icons/fi';

import { useParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import api from '../../../services/api';

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [selectedAtividade, setSelectedAtividade] = useState(null);
  const [selectedTarefa, setSelectedTarefa] = useState(null);

  const { atividade } = useParams();

  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Form"));
    setOpenForm(!OpenForm);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));
    setOpenConfirm(!OpenConfirm);
  }

  async function getData() {
    api.get(`tasks`, {
      params: {
        activity_id: atividade,
      },
    }).then(({ data }) => {
      setTarefas(data);
    });

    api.get(`activities/${atividade}`).then(({ data }) => {
      setSelectedAtividade(data);
    });
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
    getData();
  }

  function submitModalConfirm() {
    api.delete(`tasks/${selectedTarefa.id}`).then(({ data }) => {
      setSelectedAtividade(data);
      getData();
      setOpenConfirm(!OpenConfirm);

      store.addNotification({
        message: `Tarefa deletada com sucesso!`,
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

  useEffect(() => {
    document.title = 'SIGFAPEAP - Tarefas';

    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atividade]);

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
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>{selectedAtividade && `#${selectedAtividade?.id} - ${selectedAtividade?.title}`}</h1>
      </div>

      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {
                setSelectedTarefa(null);
                toggleModalForm();
              }}
              className="primary"
            >
              Nova Tarefa
            </Button>
          </div>

          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-8">Nome</th>
                  <th className="col-2">Anexo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((item) => (
                  <tr>
                    <td style={{ marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: largeName(item.description) }} />
                    {item.file
                      ? <td style={{ textAlign: 'center' }}><FiDownload data-tip={item.name} style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                      : <td style={{ textAlign: 'center' }}>Sem anexo</td>}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Editar Tarefa"
                        onClick={() => {
                          setSelectedTarefa(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        data-tip="Deletar Tarefa"
                        onClick={() => {
                          setSelectedTarefa(item);
                          toggleModalConfirm();
                        }}
                        className="eraser"
                      >
                        <FiTrash />
                      </button>
                    </td>

                    <ReactTooltip />
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} atividade={selectedAtividade} item={selectedTarefa} submit={submitModalForm} />
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
