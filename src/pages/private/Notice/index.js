import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import { useParams } from 'react-router-dom';

import { ModalProvider } from 'styled-react-modal';

import { FiDownload, FiTrash } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';


import { useProgram } from '../../../hooks/program'

let ModalConfirm = () => <></>;
let ModalNotice = () => <></>;


export default function Avaliadores() {
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected,setSelected] = useState([]);

  const [OpenNotice, setOpenNotice] = useState(false);

  const { programs, removeNotice } = useProgram();

  let { id } = useParams();

  async function toggleModalNotice() {
    ModalNotice = await lazy(() => import("./FormNotice"));

    setOpenNotice(!OpenNotice);
  }


  useEffect(() => {
    document.title = 'SIGFAPEAP - Editais';

    const filter = programs.filter(item => item.id == id);

    if(filter.length > 0){
        setSelected(filter[0].notices);
    }
  }, [programs]);


  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    setOpenConfirm(!OpenConfirm);
  }

  function submitModalNotice() {
    setOpenNotice(!OpenNotice);
  }

  return (
    <>
      <div className="col-12 title">
        <h1>Editais</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de editais do programa: {id}</h3>
          </div>
          <div className="card-title">
            <Button onClick={() => {
                toggleModalNotice()
            }} className="primary">Cadastrar edital</Button>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-4">Título</th>
                  <th className="col-4">Anexo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}><FiDownload style={{ height: 25,width: 25, cursor:'pointer'}} onClick={() => window.open(item.url,'_blank')} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => {
                          removeNotice({idProgram: id, ...item});
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
          <ModalConfirm isOpen={OpenConfirm} toggleModal={toggleModalConfirm}  submit={submitModalConfirm} />
          <ModalNotice isOpen={OpenNotice} toggleModal={toggleModalNotice} id={id} submit={submitModalNotice} />
        </ModalProvider>
      </Suspense>
    </>
  );
}
