import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { FiEdit, FiDownload } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useRequest } from '../../../hooks/request';

import ResponderSolicitacao from './ResponderSolicitacao';

export default function Arquivos() {
  const { requests, getRequests } = useRequest();

  const [solicitacao, setSolicitacao] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Solicitações para Avaliação';

    getRequests();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitacao]);

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
      {!solicitacao ? (
        <>
          <div className="col-12 title">
            <h1>Solicitações para Avaliação</h1>
          </div>
          <div className="col-12 px-0">
            <Card className="red">
              <div className="card-title">
                <h3>Listagem de solicitações para avaliação</h3>
              </div>
              <div className="card-body">
                <Table>
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th className="col-2">Assunto</th>
                      <th className="col-3">Solicitação</th>
                      <th className="col-2">Status</th>
                      <th className="col-2">Anexo</th>
                      <th className="col-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((item, index) => (
                      <tr>
                        <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                        <td style={{ textAlign: 'center' }}>{ item.assunto }</td>
                        <td style={{ textAlign: 'center' }}>{ largeName(item.solicitacao) }</td>
                        <td style={{ textAlign: 'center', color: item.status == 'PENDENTE' ? '#ffd700' : item.status == 'RECUSADA' ? '#f00' : '#080' }}>{ item.status }</td>
                        <td style={{ textAlign: 'center' }}>{item.file ? <FiDownload style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => item.file && window.open(item.url, '_blank')} /> : 'Sem anexo'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            data-tip="Detalhes da Solicitação"
                            onClick={() => {
                              setItem(item);
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
              </div>
            </Card>
          </div>
        </>
      ) : (
        <ResponderSolicitacao setSolicitacao={setSolicitacao} item={item} />
      )}
    </>
  );
}
