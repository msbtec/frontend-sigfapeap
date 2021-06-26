import React, {
  useState, useEffect, memo,
} from 'react';

import ReactLoading from "react-loading";
import api from '../../services/api';

import { Form } from '../Form';

function Filters({
  filters, setFilters, setEvaluators, only,
}) {
  const [loading, setLoading] = useState(true);

  async function search() {
    setLoading(true);
    api.post(`users/search`, {
      params: filters,
    }).then(({ data }) => {
      setEvaluators(data.data);

      setLoading(false);
    });
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
