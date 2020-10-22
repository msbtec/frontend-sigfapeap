import React, { useEffect } from 'react';

// Icons
import {
  FiCalendar, FiMessageCircle, FiUsers,
} from 'react-icons/fi';

import { useAuth } from '../../../hooks/auth';

import { CardDashboard, Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

const array = [
  {
    id: 1,
    name: 'Luis Otávio',
  },
  {
    id: 2,
    name: 'Fernando Moreira',
  },
  {
    id: 3,
    name: 'José Augusto',
  },
  {
    id: 2,
    name: 'Jonathan Moreira',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Dashboard';
  }, []);

  return (
    <>
      <div className="col-12 title">
        <h1>
          Olá, Bem vindo
          {' '}
          {user.name}
          !
        </h1>
      </div>
      <div className="col-3 px-0">
        <CardDashboard className="red">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="title">Card One</div>
                <div className="number pulsate">34</div>
              </div>
              <div className="col-auto">
                <FiCalendar size="3em" />
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
                <div className="title">Card Two</div>
                <div className="number pulsate">0</div>
              </div>
              <div className="col-auto">
                <FiMessageCircle size="3em" />
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
                <div className="title">Mensagens</div>
                <div className="number pulsate">0</div>
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
                <div className="title">Users</div>
                <div className="number pulsate">0</div>
              </div>
              <div className="col-auto">
                <FiUsers size="3em" />
              </div>
            </div>
          </div>
        </CardDashboard>
      </div>
      <div className="col-12 px-0">
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
      </div>
    </>
  );
}
