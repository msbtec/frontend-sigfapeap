import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { useParams } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import { FiDownload, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useProgram } from '../../../hooks/program';
import { useAuth } from '../../../hooks/auth'

import api from '../../../services/api';

let ModalConfirm = () => <></>;
let ModalNotice = () => <></>;

export default function Avaliadores() {
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState([]);

  const [notice, setNotice] = useState(null);

  const [OpenNotice, setOpenNotice] = useState(false);

  const { programs, removeNotice, status } = useProgram();
  const { user } = useAuth()

  const { id } = useParams();

  async function toggleModalNotice() {
    ModalNotice = await lazy(() => import("./FormNotice"));

    setOpenNotice(!OpenNotice);
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Editais';

    api.get(`programs/files/${id}`).then(({ data }) => {
      setSelected(data);
    });
  }, [id, programs, status]);

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    removeNotice(notice);

    setSelected(selected.filter(item => item.id != notice.id));
  }

  function submitModalNotice() {
    setOpenNotice(!OpenNotice);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Editais</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>
              {programs.length > 0 && programs.filter((item) => item.id == id)[0].title}
            </h3>
          </div>
          {user.profile.name != 'Pesquisador' &&
          <div className="card-title">
            <Button
              onClick={() => {
                toggleModalNotice();
              }}
              className="primary"
            >
              Cadastrar edital

            </Button>
          </div>
          }
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className={user.profile.name != 'Pesquisador' ? "col-6" : "col-4"}>Título</th>
                  <th className="col-4">Anexo</th>
                  {user.profile.name != 'Pesquisador' && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {selected.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                    {user.profile.name != 'Pesquisador' &&
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setNotice(item);
                          toggleModalConfirm();
                        }}
                        className="eraser"
                      >
                        <FiTrash />
                      </button>
                    </td>
                    }
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
          <ModalNotice isOpen={OpenNotice} toggleModal={toggleModalNotice} id={id} submit={submitModalNotice} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
