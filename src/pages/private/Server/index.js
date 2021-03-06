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

import { useUser } from '../../../hooks/user';

const Form = import("./Form");
const Confirm = import("../../../components/Confirm");

let ModalForm = () => <></>;
let ModalConfirm = () => <></>;

export default function Servidores() {
  const [OpenForm, setOpenForm] = useState(false);
  const [OpenConfirm, setOpenConfirm] = useState(false);
  const [selected, setSelected] = useState(null);

  const {
    users, erase, totalPages, loadUsers,
  } = useUser();

  useEffect(() => {
    document.title = 'SIGFAPEAP - Usuários';
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
        <h1>Usuários</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de usuários</h3>
          </div>
          <div className="card-title">
            <Button
              onClick={() => {
                setSelected(null);
                toggleModalForm();
              }}
              className="primary"
            >
              Cadastrar usuário

            </Button>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-5">Nome</th>
                  <th className="col-2">E-mail</th>
                  <th className="col-2">Perfil</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.name }</td>
                    <td style={{ textAlign: 'center' }}>{ item.email }</td>
                    <td style={{ textAlign: 'center' }}>{ item?.profile?.name }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Editar usuário"
                        onClick={() => {
                          setSelected(item);
                          toggleModalForm();
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        data-tip="Deletar usuário"
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
            onPageChange={(page) => loadUsers(page.selected)}
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
