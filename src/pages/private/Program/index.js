import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { useHistory } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import ReactTooltip from 'react-tooltip';

// Icons
import {
  FiFileText, FiDownload, FiEdit, FiTrash, FiFolderPlus, FiUserPlus,
} from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useProgram } from '../../../hooks/program';
import { useAuth } from '../../../hooks/auth';

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Program() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const history = useHistory();

  const { programs, erase } = useProgram();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Programas';
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
        <h1>Programas</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de programas</h3>
          </div>
          {user.profile.name != 'Pesquisador'
            && (
            <div className="card-title">
              <div style={{ display: 'flex' }}>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setSelected(null);
                    toggleModalForm();
                  }}
                  className="primary"
                >
                  Cadastrar programa

                </Button>
                {/* <Button onClick={() => {
                        history.push('configurar-edital')
                    }} className="primary">Configurar edital</Button> */}
              </div>
            </div>
            )}
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-3">Título</th>
                  <th className="col-6">Descrição</th>
                  {/* <th className="col-1">Avaliação</th> */}
                  {/* <th className="col-1">Anexo</th> */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item.description }} />
                    {/* <td style={{ textAlign: 'center' }}>{ item.description }</td> */}
                    {/* <td style={{ textAlign: 'center' }}>{ item.avaliation }</td> */}
                    {/* <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25,width: 25, cursor:'pointer'}} onClick={() => window.open(item.url,'_blank')} /></td> */}
                    <td style={{ textAlign: 'center' }}>
                      {user.profile.name != 'Pesquisador'
                    && (
                    <button
                      data-tip="Avaliadores"
                      onClick={() => {
                        history.push(`/avaliadores/${item.id}`);
                      }}
                      className="edit"
                    >
                      <FiUserPlus />
                    </button>
                    )}
                      <button
                        data-tip="Visualizar editais"
                        onClick={() => {
                          history.push(`/editais/${item.id}`);
                        }}
                        className="edit"
                      >
                        <FiFolderPlus />
                      </button>
                      {user.profile.name != 'Pesquisador'
                    && (
                    <>
                      <button
                        data-tip="Editar programa"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>

                      <button
                        data-tip="Deletar programa"
                        onClick={() => {
                          setSelected(item);
                          toggleModalConfirm();
                        }}
                        className="eraser"
                      >
                        <FiTrash />
                      </button>
                    </>
                    )}
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

      <ReactTooltip />
    </>
  );
}
