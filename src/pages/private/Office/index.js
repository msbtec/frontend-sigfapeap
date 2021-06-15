import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiEdit, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useOffice } from '../../../hooks/office';

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Cargos() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const { offices, erase } = useOffice();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Cargos';
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
    erase(selected);
    setOpenConfirm(!OpenConfirm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Cargos</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de cargos</h3>
          </div>
          <div className="card-title">
            <Button
              onClick={() => {
                setSelected(null);
                toggleModalForm();
              }}
              className="primary"
            >
              Cadastrar cargo

            </Button>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-9">Nome</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {offices.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Editar cargo"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        data-tip="Deletar cargo"
                        onClick={() => {
                          setSelected(item);
                          toggleModalConfirm();
                        }}
                        className="eraser"
                      >
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
