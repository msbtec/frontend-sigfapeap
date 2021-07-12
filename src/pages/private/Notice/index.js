import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { useParams, useHistory } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import ReactTooltip from 'react-tooltip';

import moment from 'moment';

import {
  FiDownload, FiEdit, FiSettings, FiFileText, FiTrash,
} from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useProgram } from '../../../hooks/program';
import { useAuth } from '../../../hooks/auth';

import api from '../../../services/api';

let ModalConfirm = () => <></>;
let ModalNotice = () => <></>;

export default function Avaliadores() {
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState([]);

  const [notice, setNotice] = useState(null);

  const history = useHistory();

  const [OpenNotice, setOpenNotice] = useState(false);

  const { programs, removeNotice, status } = useProgram();
  const { user } = useAuth();

  const [item, setItem] = useState(null);

  const { id } = useParams();

  async function toggleModalNotice() {
    ModalNotice = await lazy(() => import("./FormNotice"));

    setOpenNotice(!OpenNotice);
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Chamadas Públicas';

    api.get(`programs/files/${id}`, {
      params: {
        ativo: user.profile.name != 'Pesquisador' ? undefined : 1,
      },
    }).then(({ data }) => {
      setSelected(data);
    });
  }, [id, user, programs, status]);

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    removeNotice(notice);

    setSelected(selected.filter((item) => item.id != notice.id));
  }

  function submitModalNotice() {
    setOpenNotice(!OpenNotice);
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
        <h1>Chamadas Públicas</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>
              {programs.length > 0 && programs.filter((item) => item.id == id)[0].title}
            </h3>
          </div>
          {user.profile.name != 'Pesquisador'
          && (
          <div className="card-title">
            <Button
              onClick={() => {
                setItem(null);
                toggleModalNotice();
              }}
              className="primary"
            >
              Cadastrar Chamada Pública

            </Button>
          </div>
          )}
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-2">Título</th>
                  <th className="col-2">Período</th>
                  <th className="col-4">Descrição</th>
                  <th className="col-1">Anexo</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ largeName(item.title) }</td>
                    <td style={{ textAlign: 'center' }}>{ `${moment(item.beggin).format("L")} a ${moment(item.end).format("L")}` }</td>
                    <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: largeName(item.description) }} />
                    <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                    {user.profile.name != 'Pesquisador'
                    && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Editar Chamada Pública"
                        onClick={() => {
                          setItem({
                            ...item, beggin: String(item.beggin).split('T')[0], end: String(item.end).split('T')[0], documents: JSON.parse(item.documents),
                          });
                          toggleModalNotice();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>

                      <button
                        data-tip="Configurar Chamada Pública"
                        onClick={() => {
                          history.push(`configurar-edital/${item.id}`);
                        }}
                        className="edit"
                      >
                        <FiSettings />
                      </button>

                      <button
                        data-tip="Visualizar projetos"
                        onClick={() => {
                          history.push(`/projetos_submetidos/${item.id}`);
                        }}
                        className="edit"
                      >
                        <FiFileText />
                      </button>

                      <button
                        data-tip="Deletar Chamada Pública"
                        onClick={() => {
                          setNotice(item);
                          toggleModalConfirm();
                        }}
                        className="eraser"
                      >
                        <FiTrash />
                      </button>

                      <ReactTooltip />
                    </td>
                    )}
                    {user.profile.name == 'Pesquisador'
                    && (
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Submeter projeto"
                        onClick={() => {
                          history.push(`/projeto/${item.id}/${user.id}`);
                        }}
                        className="edit"
                      >
                        <FiFileText />
                      </button>

                      <ReactTooltip />
                    </td>
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
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
          <ModalNotice item={item} isOpen={OpenNotice} toggleModal={toggleModalNotice} id={id} submit={submitModalNotice} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
