import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { store } from 'react-notifications-component';

import { useParams } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import { FiLink, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';

import Avaliador from './Avaliador';

import api from '../../../services/api';

let ModalConfirm = () => <></>;

export default function Avaliadores() {
  const [OpenConfirm, setOpenConfirm] = useState(false);

  const [project, setProject] = useState(null);

  const [evaluators, setEvaluators] = useState([]);
  const [evaluator, setEvaluator] = useState([]);

  const [avaliador, setAvaliador] = useState(true);

  const { id } = useParams();

  async function getEvaluators() {
    api.get(`evaluators/project/${id}`).then(({ data }) => {
      setEvaluators(data);
    });
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Avaliadores do Projeto';

    getEvaluators();

    api.get(`projects/${id}`).then(({ data }) => {
      setProject(data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);

    const evaluators = project.evaluators ? project.evaluators.split(',').map((s) => Number(s.trim())) : [];

    const evaluators_deleted = evaluators.filter((item) => item != evaluator.id);
    const ids = evaluators_deleted.map((item) => String(item)).join(",");

    const formData = new FormData();
    formData.append("evaluators", ids);
    formData.append('edital_id', project.edital_id);
    formData.append('coordenador_id', project.coordenador_id);

    api.post(`projects`, formData).then(({ data }) => {
      getEvaluators();

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

  function validURL(term) {
    // eslint-disable-next-line no-useless-escape
    const re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?|magnet:\?xt=urn:btih:/;

    if (re.test(term)) {
      return true;
    }

    return false;
  }

  return (
    <>
      {!avaliador ? (
        <>
          <div className="col-12 title">
            <h1>Avaliadores do Projeto</h1>
          </div>
          <div className="col-12 px-0">
            <Card className="red">
              <div className="card-title">
                <Button
                  onClick={() => {
                    setAvaliador(true);
                  }}
                  className="primary"
                >
                  Adicionar avaliador
                </Button>
              </div>
              <div className="card-body">
                <Table>
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-4">Nome</th>
                      <th className="col-3">Email</th>
                      <th className="col-2">Currículo</th>
                      <th className="col-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluators?.map((item, index) => (
                      <tr>
                        <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                        <td style={{ textAlign: 'center' }}>{ item.name }</td>
                        <td style={{ textAlign: 'center' }}>{ item.email }</td>
                        <td style={{ textAlign: 'center' }}><FiLink style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => validURL(item.curriculum) && window.open(item.curriculum, '_blank')} /></td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            data-tip="Remover avaliador"
                            onClick={() => {
                              setEvaluator(item);
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
            </ModalProvider>
          </Suspense>
        </>
      ) : (
        <Avaliador setAvaliador={setAvaliador} />
      )}
    </>
  );
}
