import React from 'react';

import { FiTrash } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../components/Form';
import { Table } from '../../../../../components/Table';
import {
  moeda,
} from '../../../../../utils/validations';

export default function Orcamento({
  orcamentos, setOrcamentos,
}) {
  const [diaria, setDiaria] = React.useState({
    id: uuid(),
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  function getValue(value) {
    let valor_liquido = 0;
    if (value) {
      const string = String(value).split('R$')[1].trim().replace(/[\D]+/g, '');
      if (string.length > 2) {
        const resultado = `${string.substr(0, string.length - 2)}.${string.substr(string.length - 2)}`;
        valor_liquido = resultado;
      } else if (string.length > 1) {
        const resultado = `${string.substr(0, string.length - 1)}.${string.substr(string.length - 1)}`;
        valor_liquido = resultado;
      } else {
        valor_liquido = string;
      }
    }

    return Number(valor_liquido);
  }

  function soma(array) {
    return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.custo_unitario), 0) : '0';
  }

  return (
    <Form>
      <div style={{ marginTop: 40 }} />
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Diária(s)</label>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <label className="required">Localidade</label>
          <input value={diaria.localidade} type="text" onChange={(value) => setDiaria({ ...diaria, localidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Quantidade</label>
          <input value={diaria.quantidade} type="text" onChange={(value) => setDiaria({ ...diaria, quantidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo unitário</label>
          <input value={diaria.custo_unitario} type="text" onChange={(value) => setDiaria({ ...diaria, custo_unitario: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Custo total</label>
          <input value={diaria.custo_total} type="text" onChange={(value) => setDiaria({ ...diaria, custo_total: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Mês</label>
          <input value={diaria.mes} type="text" onChange={(value) => setDiaria({ ...diaria, mes: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Justificativa</label>
          <input value={diaria.justificativa} type="text" onChange={(value) => setDiaria({ ...diaria, justificativa: value.target.value })} />
        </div>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          setDiaria({
            id: uuid(),
            localidade: '',
            quantidade: '',
            custo_unitario: '',
            custo_total: '',
            mes: '',
            justificativa: '',
          });
          setOrcamentos({ ...orcamentos, diarias: [...orcamentos.diarias, diaria] });
        }}
      >
        Adicionar
      </button>

      <Table>
        <thead>
          <tr>
            <th className="col-2">Localidade</th>
            <th className="col-2">Quantidade</th>
            <th className="col-2">Custo unitário</th>
            <th className="col-2">Custo total</th>
            <th className="col-2">Mês</th>
            <th className="col-2">Justificativa</th>
          </tr>
        </thead>
        <tbody>
          {orcamentos.diarias.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.localidade}</td>
              <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
              <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
              <td style={{ textAlign: 'center' }}>{item.mes}</td>
              <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => {}} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <th className="col-6" />
            <th className="col-6" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
            <td style={{ textAlign: 'center' }}>{moeda(String(soma(orcamentos.diarias)))}</td>
          </tr>
        </tbody>
      </Table>
    </Form>
  );
}
