import React from 'react';
import Axios from 'axios';

import { FiTrash } from 'react-icons/fi';
import { uuid } from 'uuidv4';
import { Form } from '../../../../../components/Form';
import { Table } from '../../../../../components/Table';

// eslint-disable-next-line import/named
import { useProject } from '../../../../../hooks/project';

export default function Abrangencia() {
  const { project, abrangencias, setAbrangencias } = useProject();

  const [estados, setEstados] = React.useState([]);
  const [municipios, setMunicipios] = React.useState([]);

  const [selectedMunicipio, setSelectedMunicipio] = React.useState(null);
  const [selectedEstado, setSelectedEstado] = React.useState(null);

  async function getMunicipios(estado) {
    const estado_parse = JSON.parse(estado);
    setSelectedEstado(estado_parse);
    Axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado_parse.sigla}/municipios`)
      .then((response) => {
        const { data } = response;
        setMunicipios(data.sort((a, b) => {
          if (a.nome > b.nome) {
            return 1;
          }
          if (a.nome < b.nome) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }));

        setSelectedMunicipio(data[0]);
      })
      .catch(() => {});
  }

  React.useEffect(() => {
    Axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
      .then((response) => {
        const { data } = response;
        setEstados(data.sort((a, b) => {
          if (a.nome > b.nome) {
            return 1;
          }
          if (a.nome < b.nome) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }));
        getMunicipios(JSON.stringify(data[0]));
      })
      .catch(() => {});
  }, []);

  return (
    <Form>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <select
            onChange={(value) => getMunicipios(value.target.value)}
          >
            {estados.map((item) => (
              <option value={JSON.stringify(item)}>{item.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <select
            onChange={(value) => setSelectedMunicipio(JSON.parse(value.target.value))}
          >
            {municipios.map((item) => (
              <option value={JSON.stringify(item)}>{item.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {project?.submetido != 'true'
      && (
      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          const filter = abrangencias.filter((item) => item.sigla == selectedEstado.sigla && item.estado == selectedEstado.nome && item.municipio == selectedMunicipio.nome);

          if (filter.length == 0) {
            setAbrangencias([...abrangencias, {
              id: uuid(),
              sigla: selectedEstado.sigla,
              estado: selectedEstado.nome,
              municipio: selectedMunicipio.nome,
            }]);
          } else if (abrangencias.length == 0) {
            setAbrangencias([...abrangencias, {
              id: uuid(),
              sigla: selectedEstado.sigla,
              estado: selectedEstado.nome,
              municipio: selectedMunicipio.nome,
            }]);
          }
        }}
      >
        Adicionar
      </button>
      )}

      <Table>
        <thead>
          <tr>
            <th className={project?.submetido != "true" ? "col-2" : "col-4"}>Estado Sigla</th>
            <th className="col-4">Estado</th>
            <th className="col-4">Município</th>
            {project?.submetido != "true" && <th className="col-2"> - </th>}
          </tr>
        </thead>
        <tbody>
          {abrangencias.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.sigla}</td>
              <td style={{ textAlign: 'center' }}>{item.estado}</td>
              <td style={{ textAlign: 'center' }}>{item.municipio}</td>
              {project?.submetido != "true" && <td style={{ textAlign: 'center' }}><FiTrash onClick={() => setAbrangencias(abrangencias.filter((abrangencia) => abrangencia.id !== item.id))} style={{ fontSize: 20, cursor: 'pointer' }} /></td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
