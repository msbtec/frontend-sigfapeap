import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import ReactPaginate from 'react-paginate';

import { ModalProvider } from 'styled-react-modal';

import { FiTrash, FiFolderPlus, FiUserPlus } from 'react-icons/fi';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useEvaluator } from '../../../hooks/evaluators';

const Form = import("./Form");

let ModalConfirm = () => <></>;
let ModalForm = () => <></>;

export default function Avaliadores() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const {
    evaluators, page, totalPages, loadEvaluators, erase,
  } = useEvaluator();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Avaliadores';
  }, []);

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => import("../../../components/Confirm"));

    setOpenConfirm(!OpenConfirm);
  }

  function submitModalConfirm() {
    erase(selected);
    setOpenConfirm(!OpenConfirm);
  }

  async function toggleModalForm() {
    ModalForm = await lazy(() => Form);

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
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
                  <th className="col-5">Nome</th>
                  <th className="col-2">CPF</th>
                  <th className="col-2">E-mail</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {evaluators.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>{ item.cpf }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>
                      {/* <button
                        data-tip="Adicionar programa(s)"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiFolderPlus />
                      </button> */}
                      <button
                        data-tip="Remover do banco de avaliadores"
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

          <ReactPaginate
            previousLabel="anterior"
            nextLabel="próximo"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={totalPages}
            marginPagesDisplayed={4}
            pageRangeDisplayed={5}
            forcePage={page - 1}
            onPageChange={(page) => { loadEvaluators(page.selected); }}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm isOpen={OpenForm} toggleModal={toggleModalForm} item={selected} submit={submitModalForm} />

          <ModalConfirm
            isOpen={OpenConfirm}
            toggleModal={toggleModalConfirm}
            submit={submitModalConfirm}
          />
        </ModalProvider>
      </Suspense>

      <ReactTooltip />
    </>
  );
}
