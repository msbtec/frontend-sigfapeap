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

let Encargo = () => <></>;

export default function Encargos() {
  const [OpenEncargos, setOpenEncargos] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas, project,
  } = useProject();

  async function toggleEncargo() {
    Encargo = await lazy(() => import("./modal"));
    setOpenEncargos(!OpenEncargos);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Encargos</label>

      <div>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleEncargo}
        >
          Adicionar
        </button>
      )}

        <Table>
          <thead>
            <tr>
              <th className="col-4">Especificação</th>
              <th className="col-4">Custo total</th>
              <th className="col-4">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.encargos.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.especificacao}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                {project?.submetido != 'true' && (
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const encargos = orcamentos.encargos.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, encargos });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Encargos') ? ({ ...item, valor: money_mask(String(soma(encargos))) }) : item)));
                    }}
                    style={{ fontSize: 20, cursor: 'pointer' }}
                  />

                </td>
                )}
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.encargos)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Encargo
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenEncargos}
            toggleModal={toggleEncargo}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
