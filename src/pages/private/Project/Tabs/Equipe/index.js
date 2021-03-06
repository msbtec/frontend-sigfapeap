import React, {
  Suspense, lazy, useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';

import { store } from 'react-notifications-component';

import { FiTrash, FiLink, FiUserMinus } from 'react-icons/fi';

import SelectMultiple from "react-select";
import { ModalProvider } from 'styled-react-modal';
import { Form } from '../../../../../components/Form';
import { Table } from '../../../../../components/Table';
import { useResearcher } from '../../../../../hooks/researcher';
import { useAuth } from '../../../../../hooks/auth';
import { useProject } from '../../../../../hooks/project';

import Search from './Search';

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

  function validURL(term) {
    // eslint-disable-next-line no-useless-escape
    const re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?|magnet:\?xt=urn:btih:/;

    if (re.test(term)) {
      return true;
    }

    return false;
  }

  async function removeMembro(item) {
    const isMembro = atividades.map((atividade) => atividade.participantes.map((participante) => Number(participante.id)).includes(JSON.parse(item.value).id));

    if (!isMembro.includes(true)) {
      const filter = membros.filter((subitem) => JSON.parse(subitem.value).id != JSON.parse(item.value).id);
      setMembros(filter);
    } else {
      store.addNotification({
        message: `Membro está incluso em atividade(s). Remova essa(s) atividade(s) antes de remover o membro!`,
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 8000,
          onScreen: true,
        },
      });
    }
  }

  return (
    <Form>
      {project?.submetido != 'true'
      && (
      <Search membros={membros} setMembros={setMembros} />
      )}

      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Membros do Projeto</label>
      <div style={{ marginTop: 20 }} />
      {/* <SelectMultiple
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
      /> */}

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className={project?.submetido != 'true' ? "col-4" : 'col-6'}>Nome</th>
            <th className="col-1">Currículo</th>
            <th className="col-2">CPF</th>
            <th className="col-3">Função</th>
            {project?.submetido != 'true' && <th className="col-2">Ação</th>}
          </tr>
        </thead>
        <tbody>
          {membros.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value)?.name}</td>
              <td style={{ textAlign: 'center' }}><FiLink style={{ height: 25, width: 25, cursor: 'pointer' }} onClick={() => validURL(JSON.parse(item.value)?.curriculum) && window.open(JSON.parse(item.value)?.curriculum, '_blank')} /></td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value)?.cpf}</td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value).id == user.id ? 'Coordenador(a)' : JSON.parse(item.value).funcao}</td>
              <td style={{ textAlign: 'center' }}>
                {JSON.parse(item.value).id != user.id && project?.submetido != 'true' && (
                <button
                  data-tip="Remover Membro"
                  onClick={() => removeMembro(item)}
                  className="close"
                  type="button"
                  style={{ width: 30, height: 30 }}
                >
                  <FiUserMinus />
                </button>
                )}
                <ReactTooltip />
              </td>
              {/* <td style={{ textAlign: 'center' }}>{JSON.parse(item.value).name}</td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value)?.foundation?.name}</td>
              <td style={{ textAlign: 'center' }}>{JSON.parse(item.value).id == user.id ? 'Coordenador(a)' : JSON.parse(item.value).funcao}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ marginTop: 40 }} />
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Atividades</label>

      <div style={{ marginTop: 20 }}>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, width: 100 }}
          type="button"
          onClick={() => toggleModalForm()}
        >
          Adicionar
        </button>
      )}
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
            {project?.submetido != 'true' && <th className="col-1">-</th>}
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
              <td style={{ textAlign: 'center' }}>{item?.participantes?.map((participante) => String(participante.name)).join(", ")}</td>
              <td style={{ textAlign: 'center' }}>{item?.responsavel?.name}</td>
              {project?.submetido != 'true' && <td style={{ textAlign: 'center' }}><FiTrash onClick={() => setAtividades(atividades.filter((atividade) => atividade.id !== item.id))} style={{ fontSize: 20, cursor: 'pointer' }} /></td>}
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ marginTop: 50 }} />
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Cronograma</label>

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-1">A/M</th>
            {Array(Number(project?.duration || 6)).fill("").map((item, index) => (
              <th className="col-1">{`${index + 1}`.padStart(2, '0')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atividades.map((item, index) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{`A-${index + 1}`}</td>
              {Array(Number(project?.duration || 6)).fill("").map((subitem, subindex) => (((Number(subindex + 1) >= Number(item.beggin)) && (Number(subindex + 1) < Number(Number(item.beggin) + Number(item.end)))) ? <td style={{ textAlign: 'center' }}>X</td> : <td style={{ textAlign: 'center' }} />
              ))}
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
