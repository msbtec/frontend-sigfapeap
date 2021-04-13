import React from 'react';

import { FiTrash } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import { Table } from '../../../../../../components/Table';
import {
  moeda,
} from '../../../../../../utils/validations';

export default function Passagem({
  orcamentos, setOrcamentos,
}) {
  const [passagem, setPassagem] = React.useState({
    id: uuid(),
    trecho: '',
    tipo: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    justificativa: '',
  });

  return (
    <Form>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Materiais de Consumo</label>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <label className="required">Trecho</label>
          <input value={passagem.trecho} type="text" onChange={(value) => setPassagem({ ...passagem, trecho: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Tipo</label>
          <input value={passagem.tipo} type="text" onChange={(value) => setPassagem({ ...passagem, tipo: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Quantidade</label>
          <input value={passagem.quantidade} type="text" onChange={(value) => setPassagem({ ...passagem, quantidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo unitário</label>
          <input value={passagem.custo_unitario} type="text" onChange={(value) => setPassagem({ ...passagem, custo_unitario: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo total</label>
          <input value={passagem.custo_total} type="text" onChange={(value) => setPassagem({ ...passagem, custo_total: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Justificativa</label>
          <input value={passagem.justificativa} type="text" onChange={(value) => setPassagem({ ...passagem, justificativa: value.target.value })} />
        </div>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          setPassagem({
            id: uuid(),
            trecho: '',
            tipo: '',
            quantidade: '',
            custo_unitario: '',
            custo_total: '',
            justificativa: '',
          });
          setOrcamentos({ ...orcamentos, passagens: [...orcamentos.materiais_consumo, passagem] });
        }}
      >
        Adicionar
      </button>

      <Table style={{ marginBottom: 40 }}>
        <thead>
          <tr>
            <th className="col-2">Trecho</th>
            <th className="col-2">Tipo</th>
            <th className="col-2">Quantidade</th>
            <th className="col-2">Custo unitário</th>
            <th className="col-2">Custo total</th>
            <th className="col-2">Justificativa</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.passagens.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.trecho}</td>
              <td style={{ textAlign: 'center' }}>{item.tipo}</td>
              <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
              <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => {}} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}
