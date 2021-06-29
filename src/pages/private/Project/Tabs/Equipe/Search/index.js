import React, {
  useState,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { store } from 'react-notifications-component';

import {
  FiUserPlus,
} from 'react-icons/fi';
import { Form } from '../../../../../../components/Form';
import { Table } from '../../../../../../components/Table';
import { useAuth } from '../../../../../../hooks/auth';

import { cpf_mask } from '../../../../../../utils/validations';

import api from '../../../../../../services/api';

export default function Search({ membros, setMembros }) {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const [cpf, setCPF] = useState('');

  async function addMembro(item) {
    const filter = membros.filter((subitem) => JSON.parse(subitem.value).id == item.id);

    if (filter.length == 0) {
      setMembros([...membros, { value: JSON.stringify(item), label: item.name }]);
    } else {
      store.addNotification({
        message: `Usuário já está inserido no projeto!`,
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  }

  async function getUsers() {
    api.post(`users/search`, {
      params: {
        page: 1,
        nameOrCpf: cpf ? String(cpf).toUpperCase() : undefined,
      },
    }).then(({ data }) => {
      const users = data.data.map((item) => ({ ...item, funcao: 'Pesquisador(a)' }));
      const result = users.filter((item) => item.id != user.id);
      setUsers(result);
    });
  }

  return (
    <Form style={{ marginBottom: 40, marginTop: 40 }}>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Pesquisar Membros do Projeto</label>

      <div style={{ marginTop: 20 }} />

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Buscar membro</label>
        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => {
            const formatted = cpf_mask(e.target.value);
            setCPF(formatted);
          }}
          onClick={(e) => {
            e.preventDefault();
            return false;
          }}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              e.preventDefault();
              return false;
            }
          }}
          type="text"
        />
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => getUsers()}
      >
        Buscar
      </button>

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-4">Nome</th>
            <th className="col-4">Instituição</th>
            <th className="col-2">Função</th>
            <th className="col-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.name}</td>
              <td style={{ textAlign: 'center' }}>{item?.foundation?.name}</td>
              <td style={{ textAlign: 'center' }}>
                <div>
                  <input
                    style={{
                      padding: 5, borderRadius: 5, borderWidth: 1, borderStyle: 'solid', borderColor: '#dee2e6',
                    }}
                    placeholder="Função"
                    value={item.funcao}
                    onChange={(e) => {
                      setUsers(users.map((subitem) => (item.id == subitem.id
                        ? ({ ...subitem, funcao: e.target.value }) : subitem)));
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                        return false;
                      }
                    }}
                    type="text"
                  />
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  data-tip="Adicionar Membro"
                  onClick={() => addMembro(item)}
                  className="edit"
                  type="button"
                  style={{ width: 30, height: 30 }}
                >
                  <FiUserPlus />
                </button>
                <ReactTooltip />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
