import React, {
  useState, useEffect, memo,
} from 'react';

import ReactLoading from "react-loading";
import api from '../../services/api';

import { useRequest } from '../../hooks/request';

import { Form } from '../Form';

function Filters({
  project, filters, setFilters, setEvaluators, only, avaliadores,
}) {
  const [loading, setLoading] = useState(true);

  const { requests } = useRequest();

  async function search() {
    if (project) {
      const users_unavailable1 = requests.map((item) => item.usuario.id).concat(avaliadores.map((item) => Number(item.id)));
      const users_unavailable2 = project.membros.map((item) => item.id).concat(avaliadores.map((item) => Number(item.id)));

      const users_unavailable = users_unavailable1.concat(users_unavailable2);

      setLoading(true);
      api.post(`users/search`, {
        params: filters,
      }).then(({ data }) => {
      //   setEvaluators(data.data);

        const users = data.data;
        const result = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < users.length; i++) {
          if (!users_unavailable.includes(Number(users[i].id))) {
            if (Number(users[i].id) != Number(project.coordenador_id)) {
              result.push(users[i]);
            }
          }
        }
        setEvaluators(result);

        setLoading(false);
      });
    }
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, project]);

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

        {loading && <div style={{ marginTop: 20 }} />}
        {loading && <ReactLoading type="bars" height="5%" width="5%" color="#3699ff" />}
      </div>

    </Form>
  );
}

export default memo(Filters);
