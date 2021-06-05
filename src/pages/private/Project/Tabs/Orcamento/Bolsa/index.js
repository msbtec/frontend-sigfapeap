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

let Bolsa = () => <></>;

export default function Bolsas() {
  const [OpenBolsas, setOpenBolsas] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas, project,
  } = useProject();

  async function toggleBolsa() {
    Bolsa = await lazy(() => import("./modal"));
    setOpenBolsas(!OpenBolsas);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Bolsas</label>

      <div>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleBolsa}
        >
          Adicionar
        </button>
      )}

        <Table>
          <thead>
            <tr>
              <th className="col-3">Modalidade</th>
              {/* <th className="col-1">Ord</th> */}
              <th className="col-2">Duração</th>
              <th className="col-2">Custo unitário</th>
              <th className="col-2">Custo total</th>
              <th className="col-1">Mês</th>
              <th className="col-2">Área de atuação</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.bolsas.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.modalidade}</td>
                {/* <td style={{ textAlign: 'center' }}>{item.ord}</td> */}
                <td style={{ textAlign: 'center' }}>{item.duracao}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>{item.atuacao}</td>
                {project?.submetido != 'true' && (
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const bolsas = orcamentos.bolsas.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, bolsas });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Bolsas') ? ({ ...item, valor: money_mask(String(soma(bolsas))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.bolsas)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Bolsa
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenBolsas}
            toggleModal={toggleBolsa}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
