import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiEdit, FiInfo, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { servidores } from '../../../utils/data';

let ModalForm = () => <></>;

export default function Servidores() {
  const [OpenForm, setOpenForm] = useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Servidores';
  }, []);

  async function toggleModalForm(e) {
    ModalForm = await lazy(() => import("./Form"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Servidores</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de servidores</h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-3">Nome</th>
                  <th className="col-3">E-mail</th>
                  <th className="col-2">Cargo/Função</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servidores.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.nome_reduzido }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>{ item.cargo }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={toggleModalForm} className="edit">
                        <FiEdit />
                      </button>
                      <button className="eraser">
                        <FiTrash />
                      </button>
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
          <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} submit={submitModalForm} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
