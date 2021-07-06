import React, {
  useState,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { store } from 'react-notifications-component';

import {
  FiUserPlus, FiLink,
} from 'react-icons/fi';
import { Form } from '../../../../../../components/Form';
import { Table } from '../../../../../../components/Table';
import { useAuth } from '../../../../../../hooks/auth';
import { useProject } from '../../../../../../hooks/project';

import { cpf_mask } from '../../../../../../utils/validations';

import api from '../../../../../../services/api';

export default function Search({ membros, setMembros }) {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const { configuration } = useProject();

  const [cpf, setCPF] = useState('');
  const [cpf_err, setCPF_err] = useState('');

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

  function validURL(term) {
    // eslint-disable-next-line no-useless-escape
    const re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?|magnet:\?xt=urn:btih:/;

    if (re.test(term)) {
      return true;
    }

    return false;
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
          style={{ borderColor: cpf_err ? "#c53030" : "#ccc" }}
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
        <sup style={{ color: '#c53030', marginTop: 5 }}>
          {cpf_err}
        </sup>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          if (String(cpf) != "") {
            if (String(cpf).length < 14) {
              setCPF_err('Preencha corretamente o CPF');
            } else {
              setCPF_err('');
              getUsers();
            }
          } else {
            setCPF_err('Campo obrigatório');
          }
        }}
      >
        Buscar
      </button>

      {users.length > 0 && (
      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-4">Nome</th>
            <th className="col-1">Currículo</th>
            <th className="col-2">CPF</th>
            <th className="col-3">Função</th>
            <th className="col-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.name}</td>
              <td style={{ textAlign: 'center' }}><FiLink style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => validURL(item.curriculum) && window.open(item.curriculum, '_blank')} /></td>
              <td style={{ textAlign: 'center' }}>{item?.cpf}</td>
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
                {/* <div>
                  <select
                    style={{
                      padding: 5, borderRadius: 5, borderWidth: 1, borderStyle: 'solid', borderColor: '#dee2e6',
                    }}
                    onChange={(e) => {
                      setUsers(users.map((subitem) => (item.id == subitem.id
                        ? ({ ...subitem, funcao: e.target.value }) : subitem)));
                    }}
                    value={item.funcao}
                  >
                    {JSON.parse(configuration.orcamento).orcamentos.bolsas.value.map((bolsa) => (
                      <option value={bolsa.id}>{bolsa.title}</option>
                    ))}
                  </select>
                </div> */}
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
      )}
    </Form>
  );
}
