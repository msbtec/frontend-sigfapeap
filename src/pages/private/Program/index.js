import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiEdit, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { programas } from '../../../utils/data';

import { useProgram } from '../../../hooks/program'

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Program() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState(null);

  const { deleteProgram } = useProgram();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Programas';
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
    deleteProgram(selected)
    setOpenConfirm(!OpenConfirm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Programas</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de programas</h3>
          </div>
          <div className="card-title">
            <Button onClick={() => {
                setSelected(null);
                toggleModalForm();
            }} className="primary">Cadastrar programa</Button>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-2">Título</th>
                  <th className="col-5">Descrição</th>
                  <th className="col-1">Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {programas.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}>{ item.description }</td>
                    <td style={{ textAlign: 'center' }}>{ item.avaliation }</td>
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