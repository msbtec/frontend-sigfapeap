import React, { useState, Suspense, lazy } from 'react';

import { FiTrash } from 'react-icons/fi';
import { ModalProvider } from 'styled-react-modal';

import { Table } from '../../../../../../components/Table';

import {
  money_mask,
} from '../../../../../../utils/validations';

import {
  soma,
} from '../../../../../../utils/soma';

import { useProject } from '../../../../../../hooks/project';

let Equipamento = () => <></>;

export default function Equipamentos() {
  const [OpenEquipamentos, setOpenEquipamentos] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas,
  } = useProject();

  async function toggleEquipamento() {
    Equipamento = await lazy(() => import("./modal"));
    setOpenEquipamentos(!OpenEquipamentos);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Materiais Permanentes e Equipamentos</label>

      <div>
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleEquipamento}
        >
          Adicionar
        </button>

        <Table>
          <thead>
            <tr>
              <th className="col-4">Especificação</th>
              <th className="col-1">Quantidade</th>
              <th className="col-2">Custo unitário</th>
              <th className="col-2">Custo total</th>
              <th className="col-1">Mês</th>
              <th className="col-2">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.materiais_permanentes_equipamentos.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.especificacao}</td>
                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const materiais_permanentes_equipamentos = orcamentos.materiais_permanentes_equipamentos.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, materiais_permanentes_equipamentos });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Equipamentos e Material Permanente') ? ({ ...item, valor: money_mask(String(soma(materiais_permanentes_equipamentos))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.materiais_permanentes_equipamentos)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Equipamento
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenEquipamentos}
            toggleModal={toggleEquipamento}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
