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

export default function Submetidos() {
  const { user } = useAuth();

  const history = useHistory();

  const [editais, setEditais] = useState([]);
  const [selectedEdital, setSelectedEdital] = useState(null);
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Projetos Submetidos';

    api.get(`editais`).then(({ data }) => {
      if (data.length > 0) {
        setEditais(data.map((item) => ({ label: item.title, value: item.id })));
        setSelectedEdital({ label: data[0].title, value: data[0].id });
      }
    });
  }, [user]);

  useEffect(() => {
    if (selectedEdital) {
      api.get(`projects`, {
        params: {
          edital_id: selectedEdital.value,
          user_id: user.profile.name == 'Administrador' ? 0 : user.id,
        },
      }).then(({ data }) => {
        setProjetos(data);
      });
    }
  }, [selectedEdital, user]);

  return (
    <>
      <div className="col-12 title" style={{ marginBottom: 10 }}>
        <h1>Projetos Submetidos</h1>
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
          Chamada Pública
        </label>
        <div style={{ marginTop: 5 }} />
        <SelectMultiple
          maxMenuHeight={150}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Chamada Pública"
          value={selectedEdital}
          noOptionsMessage={({ inputValue }) => "Sem opções"}
          options={editais}
          onChange={(values) => setSelectedEdital(values)}
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
            <h3>Listagem de projetos submetidos</h3>
          </div>
          <div className="card-body">
            <Table>
              <thead>
                <tr>
                  <th className="col-1">#</th>
                  <th className="col-9">Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projetos.map((item, index) => (
                  <tr>
                    <td style={{ textAlign: 'center' }}>{ (index + 1) }</td>
                    <td style={{ textAlign: 'center' }}>{ item.title }</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        data-tip="Exibir Detalhes"
                        onClick={() => {
                          history.push(`/projeto/${item.edital_id}/${item.coordenador_id}`);
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
