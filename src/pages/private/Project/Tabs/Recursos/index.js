import React from 'react';

import { FiTrash } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../components/Form';
import { Table } from '../../../../../components/Table';
import {
  moeda,
} from '../../../../../utils/validations';

export default function Recursos({
  despesas, setDespesas, recursos, setRecursos,
}) {
  const [recurso, setRecurso] = React.useState({
    entidade: '',
    tipo: '',
    valor: '',
    descricao: '',
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
    return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.valor), 0) : '0';
  }

  return (
    <Form>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Recursos Solicitados à FAPEAP</label>

      <Table style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th className="col-6">Elementos de Despesas</th>
            <th className="col-6">Valor em R$</th>
          </tr>
        </thead>
        <tbody>
          {despesas.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.titulo}</td>
              <td style={{ textAlign: 'center' }}>
                <div className="input-block">
                  <input value={item.valor} type="text" onChange={(value) => setDespesas(despesas.map((subitem) => ((subitem.titulo == item.titulo) ? ({ ...item, valor: moeda(value.target.value) }) : subitem)))} />
                </div>
              </td>
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
            <td style={{ textAlign: 'center' }}>{moeda(String(soma(despesas)))}</td>
          </tr>
        </tbody>
      </Table>

      <div style={{ marginTop: 40 }} />
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Recursos Solicitados a Outras Fontes, Parcerias e/ou Contrapartida da(s) Instituição(ões) Envolvida(s)</label>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="input-block">
          <label className="required">Entidade</label>
          <input value={recurso.entidade} type="text" onChange={(value) => setRecurso({ ...recurso, entidade: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Tipo</label>
          <input value={recurso.tipo} type="text" onChange={(value) => setRecurso({ ...recurso, tipo: value.target.value })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Valor em R$</label>
          <input value={recurso.valor} type="text" onChange={(value) => setRecurso({ ...recurso, valor: moeda(value.target.value) })} />
        </div>

        <div className="input-block" style={{ marginLeft: 10, marginBottom: 15 }}>
          <label className="required">Descrição</label>
          <input value={recurso.descricao} type="text" onChange={(value) => setRecurso({ ...recurso, descricao: value.target.value })} />
        </div>
      </div>

      <button
        style={{ marginBottom: 20, width: 100 }}
        type="button"
        onClick={() => {
          if (recurso.entidade != "" && recurso.tipo != "" && (recurso.valor != "" && recurso.valor.trim() != "R$") && recurso.descricao != "") {
            const filter = recursos.filter((item) => String(item.entidade).toUpperCase() == String(recurso.entidade).toUpperCase());

            if (filter.length == 0) {
              setRecurso({
                id: uuid(),
                entidade: '',
                tipo: '',
                valor: '',
                descricao: '',
              });
              setRecursos([...recursos, recurso]);
            } else if (filter.length == 0) {
              setRecurso({
                id: uuid(),
                entidade: '',
                tipo: '',
                valor: '',
                descricao: '',
              });
              setRecursos([...recursos, recurso]);
            }
          }
        }}
      >
        Adicionar
      </button>

      <Table>
        <thead>
          <tr>
            <th className="col-3">Entidade</th>
            <th className="col-2">Tipo</th>
            <th className="col-2">Valor</th>
            <th className="col-3">Descrição</th>
            <th className="col-2">-</th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((item) => (
            <tr>
              <td style={{ textAlign: 'center' }}>{item.entidade}</td>
              <td style={{ textAlign: 'center' }}>{item.tipo}</td>
              <td style={{ textAlign: 'center' }}>{item.valor}</td>
              <td style={{ textAlign: 'center' }}>{item.descricao}</td>
              <td style={{ textAlign: 'center' }}><FiTrash onClick={() => setRecursos(recursos.filter((recurso) => recurso.id !== item.id))} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
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
            <td style={{ textAlign: 'center' }}>{moeda(String(soma(recursos)))}</td>
          </tr>
        </tbody>
      </Table>
    </Form>
  );
}
