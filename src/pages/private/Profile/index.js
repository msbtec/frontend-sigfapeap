import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiEdit, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useProfile } from '../../../hooks/profile'

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Perfil() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState(null);

  const { profiles, erase } = useProfile();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Perfis';
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
    erase(selected)
    setOpenConfirm(!OpenConfirm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Perfis de acesso</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de perfis</h3>
          </div>
          <div className="card-title">
            <Button onClick={() => {
                setSelected(null);
                toggleModalForm();
            }} className="primary">Cadastrar perfil</Button>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-4">Nome</th>
                  <th className="col-4">Acessos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>{ item.access.map(item => String(item.label)).join(", ") }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button data-tip="Editar perfil" onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                      }} className="edit">
                        <FiEdit />
                      </button>
                      <button data-tip="Deletar perfil" onClick={() => {
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

      <ReactTooltip />
    </>
  );
}
