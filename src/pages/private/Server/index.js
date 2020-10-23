import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiEdit, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { servidores } from '../../../utils/data';

import { useAuth } from '../../../hooks/auth'

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Servidores() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState(null);

  const { deleteUser } = useAuth();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Servidores';
  }, []);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Form"));

    setOpenForm(!OpenForm);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  function submitModalConfirm() {
    deleteUser(selected)
    setOpenConfirm(!OpenConfirm);
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
          <div className="card-title">
            <Button onClick={() => {
                setSelected(null);
                toggleModalForm();
            }} className="primary">Cadastrar servidor</Button>
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
                    <td style={{ textAlign: 'center' }}>{ item.name_mini }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>{ item.office }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                      }} className="edit">
                        <FiEdit />
                      </button>
                      <button onClick={() => {
                          setSelected(item);
                          toggleModalConfirm();
                      }} className="eraser">
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
          <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} item={selected} submit={submitModalForm} />
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
