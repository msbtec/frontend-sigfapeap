import React, { useState, useEffect } from 'react';

import { FiEdit } from 'react-icons/fi';

import ReactTooltip from 'react-tooltip';

import { StyledModal } from './styles';
import { Card } from '../../../../components/Card';
import { Form } from '../../../../components/Form';
import { Table } from '../../../../components/Table';

import { useRequest } from '../../../../hooks/request';

import FiltersEvaluator from '../../../../components/FiltersEvaluator';
import api from '../../../../services/api';

import Solicitacao from '../Solicitação';

export default function EnviarSolicitacao({
  getEvaluators, evaluators: avaliadores, project, setAvaliador,
}) {
  const [filters, setFilters] = useState({
    page: 1,
    type_personal: null,
    nameOrCpf: null,
    school: null,
    knowledgesArea: null,
    evaluator: true,
  });

  const { requests, getRequests } = useRequest();

  const [evaluators, setEvaluators] = useState([]);

  const [evaluator, setEvaluator] = useState(null);

  const [solicitacao, setSolicitacao] = useState(false);

  async function search() {
    if (project) {
      const users_unavailable1 = requests.map((item) => item.usuario.id).concat(avaliadores.map((item) => Number(item.id)));
      const users_unavailable2 = project.membros.map((item) => item.id).concat(avaliadores.map((item) => Number(item.id)));

      const users_unavailable = users_unavailable1.concat(users_unavailable2);

      api.post(`users/search`, {
        params: filters,
      }).then(({ data }) => {
        const users = data.data;

        const result = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < users.length; i++) {
          if (!users_unavailable.includes(Number(users[i].id))) {
            if (Number(users[i].id) != Number(project.coordenador_id)) {
              result.push(users[i]);
            }
          }
        }

        setEvaluators(result);
      });
    }
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <>
      {!solicitacao ? (
        <>
          <div className="col-12 title">
            <h1>Novo Avaliador</h1>
          </div>
          <div className="col-12 px-0">
            <Card className="red">
              <div className="card-body">
                <FiltersEvaluator project={project} avaliadores={avaliadores} filters={filters} setFilters={setFilters} setEvaluators={setEvaluators} only />

                <Table>
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-5">Nome</th>
                      <th className="col-3">E-mail</th>
                      {/* <th className="col-1">Cargo/Função</th> */}
                      <th className="col-1">Avaliador</th>
                      <th className="col-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluators.map((item, index) => (
                      <tr>
                        <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                        <td style={{ textAlign: 'center' }}>{ item.name }</td>
                        <td style={{ textAlign: 'center' }}>{ item.email }</td>
                        {/* <td style={{ textAlign: 'center' }}>{ item.office_name }</td> */}
                        <td style={{ textAlign: 'center' }}>{ item.evaluator ? 'SIM' : 'NÃO' }</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            data-tip="Enviar Solicitação"
                            onClick={() => {
                              setEvaluator(item);
                              setSolicitacao(true);
                            }}
                            className="edit"
                          >
                            <FiEdit />
                          </button>
                          <ReactTooltip />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Form>
                  <StyledModal>
                    <div className="modal-footer">
                      <button style={{ marginTop: 20 }} type="button" className="close" onClick={() => setAvaliador(false)}>
                        Voltar
                      </button>
                    </div>
                  </StyledModal>
                </Form>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Solicitacao project={project} evaluator={evaluator} setSolicitacao={setSolicitacao} />
      )}
    </>
  );
}
