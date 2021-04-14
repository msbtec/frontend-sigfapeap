import React, { useState, Suspense, lazy } from 'react';

import { FiTrash } from 'react-icons/fi';
import { ModalProvider } from 'styled-react-modal';

import { Table } from '../../../../../../components/Table';

import {
  moeda,
} from '../../../../../../utils/validations';

import {
  soma,
} from '../../../../../../utils/soma';

import { useProject } from '../../../../../../hooks/project';

let Material = () => <></>;

export default function Materiais() {
  const [OpenMateriais, setOpenMateriais] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas,
  } = useProject();

  async function toggleMaterial() {
    Material = await lazy(() => import("./modal"));
    setOpenMateriais(!OpenMateriais);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Materiais de Consumo</label>

      <div>
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleMaterial}
        >
          Adicionar
        </button>

        <Table>
          <thead>
            <tr>
              <th className="col-2">Especificação</th>
              <th className="col-1">Quantidade</th>
              <th className="col-2">Unidade</th>
              <th className="col-2">Custo unitário</th>
              <th className="col-2">Custo total</th>
              <th className="col-1">Mês</th>
              <th className="col-2">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.materiais_consumo.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.especificacao}</td>
                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                <td style={{ textAlign: 'center' }}>{item.unidade}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const materiais_consumo = orcamentos.materiais_consumo.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, materiais_consumo });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Material de Consumo') ? ({ ...item, valor: moeda(String(soma(materiais_consumo))) }) : item)));
                    }}
                    style={{ fontSize: 20, cursor: 'pointer' }}
                  />

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
              <td style={{ textAlign: 'center' }}>{moeda(String(soma(orcamentos.materiais_consumo)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Material
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenMateriais}
            toggleModal={toggleMaterial}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
