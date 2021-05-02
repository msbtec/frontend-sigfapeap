import React, {
  Suspense, lazy, useState, useEffect,
} from 'react';

import { FiTrash } from 'react-icons/fi';

import SelectMultiple from "react-select";
import { ModalProvider } from 'styled-react-modal';
import { Form } from '../../../../../components/Form';
import { Table } from '../../../../../components/Table';
import { useResearcher } from '../../../../../hooks/researcher';
import { useAuth } from '../../../../../hooks/auth';
import { useProject } from '../../../../../hooks/project';

import api from '../../../../../services/api';

let ModalForm = () => <></>;

export default function Header() {
  const { setUsers, users } = useResearcher();
  const { user } = useAuth();
  const {
    membros, setMembros, atividades, setAtividades, project,
  } = useProject();

  const [OpenForm, setOpenForm] = useState(false);

  const [totalMeses, setTotalMeses] = useState(0);

  const [nameOrCpf, setNameOrCpf] = useState(null);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  useEffect(() => {
    api.post(`users/search`, {
      params: {
        page: 1,
        nameOrCpf: nameOrCpf ? String(nameOrCpf).toUpperCase() : undefined,
      },
    }).then(({ data }) => {
      setUsers(data.data);
    });
  }, [nameOrCpf, setUsers]);

  useEffect(() => {
    if (atividades.length > 0) {
      setTotalMeses(atividades.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.end),
        0,
      ));
    }
  }, [atividades]);

  return (
    <Form>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Membros do Projeto</label>

      <div style={{ marginTop: 20 }} />
      <SelectMultiple
        maxMenuHeight={150}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Pesquisadores"
        value={membros}
        noOptionsMessage={({ inputValue }) => "Sem opções"}
        options={users.map((item) => ({ label: item.name, value: JSON.stringify(item) }))}
        onInputChange={(value) => (String(value) == "" ? setNameOrCpf(null) : setNameOrCpf(value))}
        onChange={(values) => {
          if (values != null) {
            const filter = values.filter((item) => JSON.parse(item.value).id == user.id);

            if (filter.length != 0) {
              setMembros(values);
            }
          } else {
            setMembros(membros);
          }
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary25: "#080",
            primary: "#dee2e6",
          },
        })}
        styles={{
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#fff" : "rgb(102,102,102)",
            backgroundColor: state.isSelected ? "rgb(102,102,102)" : "#fff",

            ":active": {
              ...provided[":active"],
              backgroundColor: !state.isDisabled && "#dee2e6",
            },
          }),
        }}
      />

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-4">Nome</th>
            <th className="col-4">Instituição</th>
            <th className="col-4">Função</th>
          </tr>
        </thead>
        <tbody>
          {membros.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value).name}</td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value)?.foundation?.name}</td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value).id == user.id ? 'Coordenador(a)' : 'Pesquisador(a)'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ marginTop: 40 }} />
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Atividades</label>

      <div style={{ marginTop: 20 }}>
        <button
          style={{ marginBottom: 20, width: 100 }}
          type="button"
          onClick={() => toggleModalForm()}
        >
          Adicionar
        </button>
      </div>

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-1">#</th>
            <th className="col-2">Atividade</th>
            <th className="col-1">Mês de início</th>
            <th className="col-1">Duração</th>
            <th className="col-1">C.H.S</th>
            <th className="col-3">Membro(s)</th>
            <th className="col-2">Responsável</th>
            <th className="col-1">-</th>
          </tr>
        </thead>
        <tbody>
          {atividades.map((item, index) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{`A-${index + 1}`}</td>
              <td style={{ textAlign: 'center' }}>{item.title}</td>
              <td style={{ textAlign: 'center' }}>{item.beggin}</td>
              <td style={{ textAlign: 'center' }}>{`${item.end} Mês(es)`}</td>
              <td style={{ textAlign: 'center' }}>
                {item.time}
                {' '}
                Hora(s)
              </td>
              <td style={{ textAlign: 'center' }}>{item.participantes.map((item) => String(item.label)).join(', ')}</td>
              <td style={{ textAlign: 'center' }}>{item.responsavel.name}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => setAtividades(atividades.filter((atividade) => atividade.id !== item.id))} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm
            project={project}
            atividades={atividades}
            setAtividades={setAtividades}
            membros={membros}
            setMembros={setMembros}
            isOpen={OpenForm}
            toggleModal={toggleModalForm}
            submit={submitModalForm}
          />
        </ModalProvider>
      </Suspense>
    </Form>
  );
}
