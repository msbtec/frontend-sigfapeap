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

let Diarias = () => <></>;

export default function Diaria() {
  const [OpenDiarias, setOpenDiarias] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas, project,
  } = useProject();

  async function toggleDiarias() {
    Diarias = await lazy(() => import("./modal"));
    setOpenDiarias(!OpenDiarias);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Diária(s)</label>

      <div>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleDiarias}
        >
          Adicionar
        </button>
      )}

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
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const diarias = orcamentos.diarias.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, diarias });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Diárias') ? ({ ...item, valor: money_mask(String(soma(diarias))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.diarias)))}</td>
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
