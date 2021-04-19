import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { BsPencilSquare } from 'react-icons/bs';

import { useParams } from 'react-router-dom';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import api from '../../../services/api';

export default function ProjetosSubmetidos() {
  const [projects, setProjects] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Projetos submetidos';

    api.get(`projects`, {
      params: {
        edital_id: id,
      },
    }).then(({ data }) => {
      setProjects(data);
    });
  }, [id]);

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
                        onClick={() => {}}
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
