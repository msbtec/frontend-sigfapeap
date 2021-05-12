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

let Hospedagem = () => <></>;

export default function Hospedagens() {
  const [OpenHospedagem, setOpenHospedagem] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas, project,
  } = useProject();

  async function toggleHospedagem() {
    Hospedagem = await lazy(() => import("./modal"));
    setOpenHospedagem(!OpenHospedagem);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}> Hospedagem/Alimentação</label>

      <div>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={toggleHospedagem}
        >
          Adicionar
        </button>
      )}

        <Table>
          <thead>
            <tr>
              <th className="col-4">Localidade</th>
              <th className="col-2">Quantidade</th>
              <th className="col-2">Custo unitário</th>
              <th className="col-2">Custo total</th>
              <th className="col-2">Mês</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.hospedagem_alimentacao.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.localidade}</td>
                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const hospedagem_alimentacao = orcamentos.hospedagem_alimentacao.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, hospedagem_alimentacao });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Hospedagem/Alimentação') ? ({ ...item, valor: money_mask(String(soma(hospedagem_alimentacao))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.hospedagem_alimentacao)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Hospedagem
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenHospedagem}
            toggleModal={toggleHospedagem}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
