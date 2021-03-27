import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { useParams } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import { FiLink, FiTrash } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useEvaluator } from "../../../hooks/evaluators";

import { useProgram } from '../../../hooks/program';
import api from '../../../services/api';

let ModalConfirm = () => <></>;
let ModalNotice = () => <></>;

export default function Avaliadores() {
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState([]);

  const [notice, setNotice] = useState(null);

  const [OpenNotice, setOpenNotice] = useState(false);

  const { programs } = useProgram();

  const { loadEvaluators } = useEvaluator();

  const { id } = useParams();

  async function toggleModalNotice() {
    ModalNotice = await lazy(() => import("./FormNotice"));

    setOpenNotice(!OpenNotice);
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Avaliadores do Programa';

    api.get(`programs/${id}`).then(({data}) => {
        setSelected(data);
    })

    // const filter = programs.filter((program) => program.id == id);
  }, [id, programs]);

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const evaluators_deleted = selected.evaluators.filter(item => item.id != notice.id);
    const ids = evaluators_deleted.map(item => String(item.id)).join(",");

    const formData = new FormData();
    formData.append("evaluators",ids);

    api.put(`programs/${selected.id}`,formData).then(({data}) => {
        setSelected(selected.evaluators.filter((item) => item.id != notice.id));
        loadEvaluators();

        store.addNotification({
            message: `Usuário deletado com sucesso!`,
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

  function submitModalNotice() {
    setOpenNotice(!OpenNotice);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Avaliadores do Programa</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>
              {programs.length > 0 && programs.filter((item) => item.id == id)[0].title}
            </h3>
          </div>
          {/* <div className="card-title">
            <Button
              onClick={() => {
                toggleModalNotice();
              }}
              className="primary"
            >
              Cadastrar edital
            </Button>
          </div> */}
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-4">Nome</th>
                  <th className="col-3">Email</th>
                  <th className="col-1">Currículo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {selected?.evaluators?.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}><FiLink style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.curriculum, '_blank')} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Remover avaliador"
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalConfirm
            isOpen={OpenConfirm}
            toggleModal={toggleModalConfirm}
            submit={submitModalConfirm}
          />
          <ModalNotice
            isOpen={OpenNotice}
            toggleModal={toggleModalNotice}
            id={id}
            submit={submitModalNotice}
          />
        </ModalProvider>
      </Suspense>


    </>
  );
}
