import React, {
  useState, useEffect, Suspense, lazy,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { ModalProvider } from 'styled-react-modal';

import { FiEdit, FiTrash } from 'react-icons/fi';

import ReactPaginate from 'react-paginate';
import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';
import { Button } from '../../../components/Button';

import { useResearcher } from '../../../hooks/researcher';

import Filters from '../../../components/Filters';

const Form = import("./Form");
const Confirm = import("../../../components/Confirm");

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Servidores() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    type_personal: null,
    nameOrCpf: null,
    school: null,
    knowledgesArea: null,
  });

  const {
    users, erase, loadResearches, totalPages,
  } = useResearcher();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Pesquisadores';
  }, []);

  async function toggleModalForm() {
    ModalForm = await lazy(() => Form);

    setOpenForm(!OpenForm);
  }

  async function toggleModalConfirm() {
    ModalConfirm = await lazy(() => Confirm);

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
        <h1>Pesquisadores</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de pesquisadores</h3>
          </div>
          {/* <div className="card-title">
            <Button onClick={() => {
                setSelected(null);
                toggleModalForm();
            }} className="primary">Cadastrar usuário</Button>
          </div> */}
          <div className="card-body">

            <Filters filters={filters} setFilters={setFilters} />

            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-5">Nome</th>
                  <th className="col-3">E-mail</th>
                  {/* <th className="col-1">Cargo/Função</th> */}
                  <th className="col-1">Avaliador</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    {/* <td style={{ textAlign: 'center' }}>{ item.office_name }</td> */}
                    <td style={{ textAlign: 'center' }}>{ item.evaluator ? 'SIM' : 'NÃO' }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Alterar status"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        data-tip="Deletar pesquisador"
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
            forcePage={filters.page - 1}
            onPageChange={(page) => { setFilters({ ...filters, page: page.selected + 1 }); /* loadResearches(page.selected); */ }}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
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
