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

let Pessoal = () => <></>;

export default function Pessoais() {
  const [OpenPessoais, setOpenPessoais] = useState(false);

  const {
    orcamentos, setOrcamentos, despesas, setDespesas, project,
  } = useProject();

  async function togglePessoal() {
    Pessoal = await lazy(() => import("./modal"));
    setOpenPessoais(!OpenPessoais);
  }

  return (
    <div>
      <label style={{ fontSize: 18, fontWeight: 'bold', color: '#444444' }}>Pessoal</label>

      <div>
        {project?.submetido != 'true'
      && (
        <button
          style={{ marginBottom: 20, marginTop: 10, width: 100 }}
          type="button"
          onClick={togglePessoal}
        >
          Adicionar
        </button>
      )}

        <Table>
          <thead>
            <tr>
              <th className="col-2">Função</th>
              <th className="col-2">Formação profissional</th>
              <th className="col-2">Perfil desejado</th>
              <th className="col-2">Custo total</th>
              <th className="col-2">Mês</th>
              <th className="col-2">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.pessoal.map((item) => (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.funcao}</td>
                <td style={{ textAlign: 'center' }}>{item.formacao}</td>
                <td style={{ textAlign: 'center' }}>{item.perfil}</td>
                <td style={{ textAlign: 'center' }}>{item.custo_total}</td>
                <td style={{ textAlign: 'center' }}>{item.mes}</td>
                <td style={{ textAlign: 'center' }}>{item.justificativa}</td>
                <td style={{ textAlign: 'center' }}>
                  <FiTrash
                    onClick={() => {
                      const pessoal = orcamentos.pessoal.filter((diaria) => diaria.id != item.id);
                      setOrcamentos({ ...orcamentos, pessoal });
                      setDespesas(despesas.map((item) => ((item.titulo == 'Pessoal') ? ({ ...item, valor: money_mask(String(soma(pessoal))) }) : item)));
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
              <td style={{ textAlign: 'center' }}>{money_mask(String(soma(orcamentos.pessoal)))}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <Pessoal
            despesas={despesas}
            setDespesas={setDespesas}
            orcamentos={orcamentos}
            setOrcamentos={setOrcamentos}
            isOpen={OpenPessoais}
            toggleModal={togglePessoal}
          />
        </ModalProvider>
      </Suspense>
    </div>
  );
}
