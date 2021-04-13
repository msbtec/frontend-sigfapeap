import React from 'react';

import { FiTrash } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import { Table } from '../../../../../../components/Table';
import {
  moeda,
} from '../../../../../../utils/validations';

export default function Materiais({
  orcamentos, setOrcamentos,
}) {
  const [material, setMaterial] = React.useState({
    id: uuid(),
    especificacao: '',
    quantidade: '',
    unidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  return (
    <Form>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Materiais de Consumo</label>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <label className="required">Especificação</label>
          <input value={material.especificacao} type="text" onChange={(value) => setMaterial({ ...material, especificacao: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Quantidade</label>
          <input value={material.quantidade} type="text" onChange={(value) => setMaterial({ ...material, quantidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo unitário</label>
          <input value={material.custo_unitario} type="text" onChange={(value) => setMaterial({ ...material, custo_unitario: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo total</label>
          <input value={material.custo_total} type="text" onChange={(value) => setMaterial({ ...material, custo_total: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Mês</label>
          <input value={material.mes} type="text" onChange={(value) => setMaterial({ ...material, mes: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Justificativa</label>
          <input value={material.justificativa} type="text" onChange={(value) => setMaterial({ ...material, justificativa: value.target.value })} />
        </div>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          setMaterial({
            id: uuid(),
            especificacao: '',
            quantidade: '',
            unidade: '',
            custo_unitario: '',
            custo_total: '',
            mes: '',
            justificativa: '',
          });
          setOrcamentos({ ...orcamentos, materiais_consumo: [...orcamentos.materiais_consumo, material] });
        }}
      >
        Adicionar
      </button>

      <Table style={{ marginBottom: 40 }}>
        <thead>
          <tr>
            <th className="col-2">Especificação</th>
            <th className="col-2">Quantidade</th>
            {/* <th className="col-2">Unidade</th> */}
            <th className="col-2">Custo unitário</th>
            <th className="col-2">Custo total</th>
            <th className="col-2">Mês</th>
            <th className="col-2">Justificativa</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.materiais_consumo.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.especificacao}</td>
              <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
              {/* <td style={{ textAlign: 'center' }}>Unidade(s)</td> */}
              <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
              <td style={{ textAlign: 'center' }}>{item.mes}</td>
              <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => {}} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
