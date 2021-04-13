import React from 'react';

import { FiTrash } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import { Table } from '../../../../../../components/Table';
import {
  moeda,
} from '../../../../../../utils/validations';

export default function Hospedagem({
  orcamentos, setOrcamentos,
}) {
  const [hospedagem, setHospedagem] = React.useState({
    id: uuid(),
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
  });

  return (
    <Form>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Hospedagem/Alimentação</label>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <label className="required">Localidade</label>
          <input value={hospedagem.localidade} type="text" onChange={(value) => setHospedagem({ ...hospedagem, localidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Quantidade</label>
          <input value={hospedagem.quantidade} type="text" onChange={(value) => setHospedagem({ ...hospedagem, quantidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo unitário</label>
          <input value={hospedagem.custo_unitario} type="text" onChange={(value) => setHospedagem({ ...hospedagem, custo_unitario: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo total</label>
          <input value={hospedagem.custo_total} type="text" onChange={(value) => setHospedagem({ ...hospedagem, custo_total: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Mês</label>
          <input value={hospedagem.mes} type="text" onChange={(value) => setHospedagem({ ...hospedagem, mes: value.target.value })} />
        </div>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          setHospedagem({
            id: uuid(),
            localidade: '',
            quantidade: '',
            custo_unitario: '',
            custo_total: '',
            mes: '',
          });
          setOrcamentos({ ...orcamentos, hospedagem_alimentacao: [...orcamentos.hospedagem_alimentacao, hospedagem] });
        }}
      >
        Adicionar
      </button>

      <Table style={{ marginBottom: 40 }}>
        <thead>
          <tr>
            <th className="col-4">Localidade</th>
            <th className="col-2">Quantidade</th>
            <th className="col-2">Custo unitário</th>
            <th className="col-2">Custo total</th>
            <th className="col-2">Mês</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.hospedagem_alimentacao.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.localidade}</td>
              <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
              <td style={{ textAlign: 'center' }}>{item.mes}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => {}} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
