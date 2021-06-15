import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { BsPencilSquare } from 'react-icons/bs';

import { useParams, useHistory } from 'react-router-dom';

import { useAuth } from '../../../hooks/auth';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import api from '../../../services/api';

export default function ProjetosSubmetidos() {
  const [projects, setProjects] = useState([]);

  const history = useHistory();

  const { id } = useParams();

  const { user } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Projetos Submetidos';

    api.get(`projects`, {
      params: {
        edital_id: id,
        user_id: user.profile.name == 'Administrador' ? 0 : user.id,
      },
    }).then(({ data }) => {
      setProjects(data.filter((item) => (item.avaliacao.status == 'Análise' || item.avaliacao.status == 'Avaliação')));
    });
  }, [id, user]);

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
        <h1>Projetos Submetidos</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>
              Listagem de Projetos Submetidos
            </h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-6">Título</th>
                  {/* <th className="col-3">Resumo</th> */}
                  <th className="col-2">Status</th>
                  <th className="col-1">E-mail do coordenador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ largeName(item.title) }</td>
                    {/* <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: largeName(item.resumo || "") }} /> */}
                    <td style={{ textAlign: 'center' }}>{ item.avaliacao.status }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Avaliar projeto"
                        onClick={() => history.push(`/projeto/${id}/${item.coordenador_id}`)}
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
