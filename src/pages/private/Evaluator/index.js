import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { ModalProvider } from 'styled-react-modal';

// Icons
import { FiEdit } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { usuarios } from '../../../utils/data';

import { useEvaluator } from '../../../hooks/evaluators'

let ModalConfirm = () => <></>;

export default function Avaliadores() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState(null);

  const { updateEvaluator } = useEvaluator();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Avaliadores';
  }, []);


  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/ConfirmEvaluator"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    updateEvaluator(selected)
    setOpenConfirm(!OpenConfirm);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Avaliadores</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de avaliadores</h3>
          </div>
          {/* <div className="card-title">
            <Button onClick={() => {
                setSelected(null);
                toggleModalForm();
            }} className="primary">Cadastrar servidor</Button>
          </div> */}
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-2">Nome</th>
                  <th className="col-2">CPF</th>
                  <th className="col-2">E-mail</th>
                  <th className="col-2">Avaliador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name_mini }</td>
                    <td style={{ textAlign: 'center' }}>{ item.cpf }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>{ item.avaliador ? 'SIM' : 'NÃO' }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => {
                          setSelected(item);
                          toggleModalConfirm();
                      }} className="edit">
                        <FiEdit />
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
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm} submit={submitModalConfirm} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
