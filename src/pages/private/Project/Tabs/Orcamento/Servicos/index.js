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

let Servico = () => <></>;

export default function Servicos() {
  const [OpenServicos, setOpenServicos] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas,
  } = useProject();

  async function toggleServico() {
    Servico = await lazy(() => import("./modal"));
    setOpenServicos(!OpenServicos);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Serviços de Terceiros</label>

      <div>
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleServico}
        >
          Adicionar
        </button>

        <Table>
          <thead>
            <tr>
              <th className="col-4">Especificação</th>
              <th className="col-2">Custo total</th>
              <th className="col-2">Mês</th>
              <th className="col-4">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.servicos_terceiros.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.especificacao}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const servicos_terceiros = orcamentos.servicos_terceiros.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, servicos_terceiros });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Outros Serviços de Terceiros') ? ({ ...item, valor: money_mask(String(soma(servicos_terceiros))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.servicos_terceiros)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Servico
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenServicos}
            toggleModal={toggleServico}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
