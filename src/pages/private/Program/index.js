import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { useHistory } from 'react-router-dom'

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiDownload, FiEdit, FiTrash, FiFolderPlus, FiUserPlus } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useProgram } from '../../../hooks/program'

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Program() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState(null);

  const history = useHistory()

  const { programs, erase } = useProgram();

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
    erase(selected)
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
                  {/* <th className="col-1">Avaliação</th> */}
                  <th className="col-1">Anexo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}>{ item.description }</td>
                    {/* <td style={{ textAlign: 'center' }}>{ item.avaliation }</td> */}
                    <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25,width: 25, cursor:'pointer'}} onClick={() => window.open(item.url,'_blank')} /></td>
                    <td style={{ textAlign: 'center' }}>
                    <button onClick={() => {}} className="edit">
                        <FiUserPlus />
                    </button>
                    <button onClick={() => {
                         history.push(`/editais/${item.id}`)
                      }} className="edit">
                        <FiFolderPlus />
                      </button>
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
