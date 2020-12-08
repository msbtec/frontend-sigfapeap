import React, { useEffect } from 'react';

import { FiMessageCircle, FiUsers } from 'react-icons/fi';

import { useAuth } from '../../../hooks/auth';
import { useUser } from '../../../hooks/user';
import { useResearcher } from '../../../hooks/researcher';
import { useProgram } from '../../../hooks/program';
import { useEvaluator } from '../../../hooks/evaluators';

import { CardDashboard } from '../../../components/Card';

export default function Dashboard() {
  const { user } = useAuth();
  const { users } = useUser();
  const { users: researches } = useResearcher();
  const { programs } = useProgram();
  const { evaluators } = useEvaluator();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Dashboard';
  }, []);

  return (
    <>
      <div className="col-12 title">
        <h1>
          Olá, Bem vindo
          {' '}
          {user.name_mini}
          !
        </h1>
      </div>
      <div className="col-3 px-0">
        <CardDashboard className="red">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="title">Usuários</div>
                <div className="number pulsate">{users.length}</div>
              </div>
              <div className="col-auto">
                <FiUsers size="3em" />
              </div>
            </div>
          </div>
        </CardDashboard>
      </div>
      <div className="col-3 px-0">
        <CardDashboard className="blue">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="title">Pesquisadores</div>
                <div className="number pulsate">{researches.length}</div>
              </div>
              <div className="col-auto">
                <FiUsers size="3em" />
              </div>
            </div>
          </div>
        </CardDashboard>
      </div>
      <div className="col-3 px-0">
        <CardDashboard className="green">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="title">Programas</div>
                <div className="number pulsate">{programs.length}</div>
              </div>
              <div className="col-auto">
                <FiMessageCircle size="3em" />
              </div>
            </div>
          </div>
        </CardDashboard>
      </div>
      <div className="col-3 px-0">
        <CardDashboard className="orange">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="title">Avaliadores</div>
                <div className="number pulsate">{evaluators.length}</div>
              </div>
              <div className="col-auto">
                <FiUsers size="3em" />
              </div>
            </div>
          </div>
        </CardDashboard>
      </div>
      {/* <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Tables</h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-8">Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {array.map((item) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ item.id }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="edit">
                        Edit
                      </button>
                      <button className="info">
                        Info
                      </button>
                      <button className="eraser">
                        Trash
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div> */}
    </>
  );
}
