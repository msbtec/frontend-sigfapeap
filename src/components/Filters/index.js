import React, {
  useState, useEffect, memo,
} from 'react';

import ReactLoading from "react-loading";

import { store } from 'react-notifications-component';
import { Form } from '../Form';

import { Button } from "../Button";

import { useResearcher } from '../../hooks/researcher';
import { useSearch } from '../../hooks/search';
import api from '../../services/api';

function Filters({ filters, setFilters, only }) {
  const { setUsers, setTotalPages } = useResearcher();
  const { searches } = useSearch();

  const [loading, setLoading] = useState(true);

  async function search() {
    setLoading(true);
    api.post(`users/search`, {
      params: filters,
    }).then(({ data }) => {
      setTotalPages(data.lastPage);
      setUsers(data.data);

      setLoading(false);
    });
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function download(url, filename) {
    fetch(url).then((t) => t.blob().then((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.setAttribute("download", filename);
      a.click();

      store.addNotification({
        message: `Relatório gerado com sucesso!`,
        type: 'success',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }));
  }

  async function generatePDF() {
    setLoading(true);
    api
      .post(`/report`, {
        params: filters,
      })
      .then((response) => {
        download(
          response.data.url,
          String(response.data.url)
            .split("/")
            .pop(),
        );

        setLoading(false);
      })
      .catch((error) => {
        store.addNotification({
          message: error.response.data.message,
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
      });
  }

  return (
    <Form style={{ marginBottom: 20 }}>
      <div className="input-block">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF"
          onChange={(e) => {
            setFilters({ ...filters, page: 1, nameOrCpf: String(e.target.value).toUpperCase() });
          }}
        />

        {!only
        && (
        <div style={{
          marginTop: 10, display: "flex", flexDirection: 'row',
        }}
        >
          <div>
            <label>
              Tipo de usuário
            </label>
            <br />
            <select
              style={{ flex: 1, marginRight: 10 }}
              onChange={(e) => {
                setFilters({ ...filters, page: 1, type_personal: e.target.value == "Todos" ? null : e.target.value });
              }}
            >
              {[{ id: null, name: "Todos" }, { id: "Pesquisador", name: "Pesquisador" }, { id: "Pesquisador estrangeiro", name: "Pesquisador estrangeiro" }].map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>
              Nível acadêmico
            </label>
            <br />
            <select
              style={{ flex: 1, marginRight: 10 }}
              onChange={(e) => {
                setFilters({ ...filters, page: 1, school: e.target.value == "Todos" ? null : e.target.value });
              }}
            >
              {[{ id: null, name: "Todos" },
                { id: "Ensino Fundamental", name: "Ensino Fundamental" },
                { id: "Ensino Médio", name: "Ensino Médio" }, { id: "Ensino Superior", name: "Ensino Superior" }, { id: "Especialização", name: "Especialização" },
                { id: "Mestrado", name: "Mestrado" }, { id: "Doutorado", name: "Doutorado" }, { id: "Pós-doutorado", name: "Pós-doutorado" }].map((item) => (
                  <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>
              Área de conhecimento
            </label>
            <br />
            <select
              style={{ flex: 1 }}
              onChange={(e) => {
                setFilters({ ...filters, page: 1, knowledgesArea: e.target.value == "Todos" ? null : e.target.value });
              }}
            >
              {[{ id: null, name: "Todos" }, ...searches].map((item) => (
                <option value={item.id ? item.name : null}>{item.name}</option>
              ))}
            </select>
          </div>

          {!loading
          && (
          <Button
            className="primary"
            style={{ marginLeft: 10, marginTop: 25 }}
            onClick={() => {
              generatePDF();
            }}
          >
            Gerar Relatório
          </Button>
          )}
        </div>
        )}

        {loading && <div style={{ marginTop: 20 }} />}
        {loading && <ReactLoading type="bars" height="5%" width="5%" color="#3699ff" />}
      </div>

    </Form>
  );
}

export default memo(Filters);
