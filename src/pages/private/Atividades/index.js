import React, {
  useState, useEffect,
} from 'react';

import ReactTooltip from 'react-tooltip';
import SelectMultiple from "react-select";

import { FiEdit } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';

import { Card } from '../../../components/Card';
import { Table } from '../../../components/Table';

import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';

export default function Atividades() {
  const { user } = useAuth();

  const history = useHistory();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Atividades';

    api.get(`user/${user.profile.name == 'Administrador' ? 0 : user.id}/projects`).then(({ data }) => {
      if (data.length > 0) {
        setProjects(data.map((item) => ({ label: item.title, value: item.id, coordenador_id: item.coordenador_id })));
        setSelectedProject({ label: data[0].title, value: data[0].id, coordenador_id: data[0].coordenador_id });
      }
    });
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      api.get(`activities`, {
        params: {
          project_id: selectedProject.value,
          coordenador: selectedProject.coordenador_id == user.id,
          responsavel: undefined,
          user_id: user.profile.name != 'Administrador' ? user.id : undefined,
        },
      }).then(({ data }) => {
        setAtividades(data);
      });
    }
  }, [selectedProject, user]);

  return (
    <>
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>Atividades</h1>
      </div>

      <div className="col-12 px-0">
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#626262',
          }}
          className="required"
        >
          Projeto
        </label>
        <div style={{ marginTop: 5 }} />
        <SelectMultiple
          maxMenuHeight={150}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Projetos"
          value={selectedProject}
          noOptionsMessage={({ inputValue }) => "Sem opções"}
          options={projects}
          onChange={(values) => setSelectedProject(values)}
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
      </div>

      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-title">
            <h3>Listagem de atividades do projeto</h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-9">Nome</th>
                  <th className="col-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {atividades.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Exibir Detalhes"
                        onClick={() => {
                          history.push(`/tarefas/${item.id}`);
                        }}
                        className="edit"
                      >
                        <FiEdit />
                      </button>
                    </td>

                    <ReactTooltip />
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

    </>
  );
}
