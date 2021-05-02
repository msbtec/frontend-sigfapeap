import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { BsPencilSquare } from 'react-icons/bs';

import { useHistory } from 'react-router-dom';

import { useAuth } from '../../../hooks/auth';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import api from '../../../services/api';

export default function ProjetosAvaliacao() {
  const [projects, setProjects] = useState([]);

  const history = useHistory();

  const { user } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Projetos para Avaliação';

    api.get(`evaluations`, {
      params: {
        user_id: user.id,
      },
    }).then(({ data }) => {
      setProjects(data);
    });
  }, [user]);

  return (
    <>
      <div className="col-12 title">
        <h1>Projetos para Avaliação</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>
              Listagem de Projetos para Avaliação
            </h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-2">Título</th>
                  <th className="col-5">Resumo</th>
                  <th className="col-1">E-mail do coordenador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item.resumo }} />
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Avaliar projeto"
                        onClick={() => history.push(`/projeto/${item.edital_id}/${item.coordenador_id}`)}
                        className="edit"
                      >
                        <BsPencilSquare />
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
    </>
  );
}
