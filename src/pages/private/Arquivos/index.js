import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiEdit, FiTrash, FiDownload } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useArchive } from '../../../hooks/archive';
import { useAuth } from '../../../hooks/auth';

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Arquivos() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const { archives, erase } = useArchive();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Arquivos';
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
  }

  function submitModalConfirm() {
    erase(selected);
    setOpenConfirm(!OpenConfirm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Arquivos</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de arquivos</h3>
          </div>
          {user.profile.name != 'Pesquisador'
          && (
          <div className="card-title">
            <Button
              onClick={() => {
                setSelected(null);
                toggleModalForm();
              }}
              className="primary"
            >
              Cadastrar arquivo

            </Button>
          </div>
          )}
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className={user.profile.name != 'Pesquisador' ? "col-7" : "col-9"}>Nome</th>
                  <th className="col-2">Anexo</th>
                  {user.profile.name != 'Pesquisador' && <th className="col-2">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {archives.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                    {user.profile.name != 'Pesquisador'
                    && (
                    <>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          data-tip="Editar arquivo"
                          onClick={() => {
                            setSelected(item);
                            toggleModalForm();
                          }}
                          className="edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          data-tip="Deletar arquivo"
                          onClick={() => {
                            setSelected(item);
                            toggleModalConfirm();
                          }}
                          className="eraser"
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </>
                    )}
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

      <ReactTooltip />
    </>
  );
}
