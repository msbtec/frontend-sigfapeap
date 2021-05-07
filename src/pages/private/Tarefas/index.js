import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { FiEdit } from 'react-icons/fi';

import { useParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import api from '../../../services/api';

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [selectedAtividade, setSelectedAtividade] = useState(null);

  const { atividade } = useParams();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Tarefas';

    api.get(`tasks`, {
      params: {
        activity_id: atividade,
      },
    }).then(({ data }) => {
      setTarefas(data);
    });

    api.get(`activities/${atividade}`).then(({ data }) => {
      setSelectedAtividade(data);
    });
  }, [atividade]);

  return (
    <>
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>{selectedAtividade && `#${selectedAtividade?.id} - ${selectedAtividade?.title}`}</h1>
      </div>

      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {}}
              className="primary"
            >
              Nova Tarefa
            </Button>
          </div>

          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-10">Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((item) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ item.description }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Editar Tarefa"
                        onClick={() => {}}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                    </td>

                    <ReactTooltip />
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
