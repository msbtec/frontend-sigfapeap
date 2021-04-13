import React, { useState, Suspense, lazy } from 'react';

import { FiTrash } from 'react-icons/fi';
import { ModalProvider } from 'styled-react-modal';

import { Table } from '../../../../../components/Table';

import {
  moeda,
} from '../../../../../utils/validations';

import { useProject } from '../../../../../hooks/project';

// import Diarias from './Diarias';
// import Hospedagem from './Hospedagem';
// import Materiais from './Materiais';
// import Passagens from './Passagens';

let Diarias = () => <></>;

export default function Orcamento({
  orcamentos, setOrcamentos, despesas, setDespesas
}) {
  const { project } = useProject();

  const [OpenDiarias, setOpenDiarias] = useState(false);

  async function toggleDiarias() {
    Diarias = await lazy(() => import("./Diarias"));
    setOpenDiarias(!OpenDiarias);
  }

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
    return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.custo_total), 0) : '0';
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Diária(s)</label>

      <div>
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleDiarias}
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
                <td style={{ textAlign: 'center' }}><FiTrash onClick={() => setOrcamentos({ ...orcamentos, diarias: orcamentos.diarias.filter((diaria) => diaria.id != item.id) })} style={{ fontSize: 20, cursor: 'pointer' }} /></td>
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
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Diarias
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenDiarias}
            toggleModal={toggleDiarias}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
