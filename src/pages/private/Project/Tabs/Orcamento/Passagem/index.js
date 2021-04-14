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

let Passagem = () => <></>;

export default function Passagens() {
  const [OpenPassagens, setOpenPassagens] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas,
  } = useProject();

  async function togglePassagem() {
    Passagem = await lazy(() => import("./modal"));
    setOpenPassagens(!OpenPassagens);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Passagens</label>

      <div>
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={togglePassagem}
        >
          Adicionar
        </button>

        <Table>
          <thead>
            <tr>
              <th className="col-2">Trecho</th>
              <th className="col-2">Tipo</th>
              <th className="col-2">Quantidade</th>
              <th className="col-2">Custo unitário</th>
              <th className="col-2">Custo total</th>
              <th className="col-2">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.passagens.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.trecho}</td>
                <td style={{ textAlign: 'center' }}>{item.tipo}</td>
                <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_unitario}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const passagens = orcamentos.passagens.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, passagens });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Passagens') ? ({ ...item, valor: moeda(String(soma(passagens))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{moeda(String(soma(orcamentos.passagens)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Passagem
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenPassagens}
            toggleModal={togglePassagem}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
