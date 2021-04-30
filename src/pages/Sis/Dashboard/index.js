import React, { useEffect } from 'react';

import {
  FiMessageCircle, FiUsers, FiFileText, FiDownload, FiEdit, FiTrash, FiFolderPlus, FiUserPlus,
} from 'react-icons/fi';

import Ws from '@adonisjs/websocket-client';

import moment from 'moment';

import ReactTooltip from 'react-tooltip';
import { useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useAuth } from '../../../hooks/auth';
import { useUser } from '../../../hooks/user';
import { useResearcher } from '../../../hooks/researcher';
import { useProgram } from '../../../hooks/program';
import { useEvaluator } from '../../../hooks/evaluators';

import { Card, CardDashboard } from '../../../components/Card';
import { Table } from '../../../components/Table';

import Footer from '../../../components/Footer';
import api from '../../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { users } = useUser();
  const { users: researches } = useResearcher();
  const { programs, status } = useProgram();
  const { evaluators } = useEvaluator();

  const [notices, setNotices] = React.useState([]);
  const [publishes, setPublishes] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const [pagePublishes, setPagePublishes] = React.useState(1);
  const [totalPagesPublishes, setTotalPagesPublishes] = React.useState(0);

  const history = useHistory();

  async function loadNotices(page = 0) {
    setPage(page + 1);
    api.get(`programs/files`, {
      params: {
        page: page + 1,
      },
    }).then(({ data }) => {
      setNotices(data.data);
      setTotalPages(data.lastPage);
    });
  }

  async function loadPublishes(page = 0) {
    setPagePublishes(page + 1);
    api.get(`paginate/publishes`, {
      params: {
        page: page + 1,
      },
    }).then(({ data }) => {
      setPublishes(data.data);
      setTotalPagesPublishes(data.lastPage);
    });
  }

  useEffect(() => {
    document.title = 'SIGFAPEAP - Dashboard';

    loadNotices(0);
    loadPublishes(0);
  }, []);

  useEffect(() => {
    loadNotices(page - 1);
  }, [status, page]);

  return (
    <>
      <div className="col-12 title">
        <h1>
          Olá, Bem vindo(a)
          {' '}
          {user.name}
          !
        </h1>
      </div>

      {user.profile.name != 'Pesquisador'
      && (
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
      )}

      {user.profile.name != 'Pesquisador'
      && (
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
      )}

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

      {user.profile.name != 'Pesquisador'
      && (
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
      )}

      {publishes.length > 0 && user.profile.name == 'Pesquisador'
      && (
      <Card style={{ width: '100%', margin: 15, marginBottom: 20 }} className="red">
        <div className="card-title">
          <h3>
            Publicações recentes
          </h3>
        </div>
        <div className="card-body">
          <Table>
            <thead>
              <tr>
                <th className="col-1">#</th>
                <th className="col-4">Título</th>
                <th className="col-6">Descrição</th>
                <th className="col-1">Anexo</th>
              </tr>
            </thead>
            <tbody>
              {publishes.map((item, index) => (
                <tr>
                  <td style={{ textAlign: 'center' }}>{ index + 1 + (page > 1 ? (page - 1) * 5 : 0) }</td>
                  <td style={{ textAlign: 'center' }}>{ item.title }</td>
                  <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item.description }} />
                  <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <ReactPaginate
          previousLabel="anterior"
          nextLabel="próximo"
          breakLabel="..."
          breakClassName="break-me"
          pageCount={totalPagesPublishes}
          marginPagesDisplayed={4}
          // pageRangeDisplayed={5}
          onPageChange={(page) => loadPublishes(page.selected)}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </Card>
      )}

      {notices.length > 0 && user.profile.name == 'Pesquisador'
      && (
      <Card style={{ width: '100%', margin: 15, marginBottom: 100 }} className="red">
        <div className="card-title">
          <h3>
            Editais recentes
          </h3>
        </div>
        <div className="card-body">
          <Table>
            <thead>
              <tr>
                <th className="col-1">#</th>
                <th className="col-2">Título</th>
                <th className="col-1">Período</th>
                <th className="col-4">Descrição</th>
                <th className="col-1">Documentos</th>
                <th className="col-1">Anexo</th>
                <th className="col-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((item, index) => (
                <tr>
                  <td style={{ textAlign: 'center' }}>{ index + 1 + (page > 1 ? (page - 1) * 5 : 0) }</td>
                  <td style={{ textAlign: 'center' }}>{ item.title }</td>
                  <td style={{ textAlign: 'center' }}>{ `${moment(item.beggin).format("L")} a ${moment(item.end).format("L")}` }</td>
                  <td style={{ marginTop: 10, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item.description }} />
                  <td style={{ textAlign: 'center' }}>{ JSON.parse(item.documents).map((document) => <p><a className="link_document" target="_blank" href={document.url}>{String(document.title)}</a></p>)}</td>
                  <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => window.open(item.url, '_blank')} /></td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      data-tip="Submeter projeto"
                      onClick={() => {
                        history.push(`/projeto/${item.id}/${user.id}`);
                      }}
                      className="edit"
                    >
                      <FiFileText />
                    </button>

                    <ReactTooltip />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <ReactPaginate
          previousLabel="anterior"
          nextLabel="próximo"
          breakLabel="..."
          breakClassName="break-me"
          pageCount={totalPages}
          marginPagesDisplayed={4}
                // pageRangeDisplayed={5}
          onPageChange={(page) => loadNotices(page.selected)}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </Card>
      )}

      <div style={{
        backgroundColor: '#b20710', width: '82%', position: "absolute", bottom: 0,
      }}
      >
        <Footer />
      </div>
    </>
  );
}
