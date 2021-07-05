import React from 'react';

import Diarias from './Diarias';
import Hospedagem from './Hospedagem';
import Materiais from './Materiais';
import Passagem from './Passagem';
import Servicos from './Servicos';
import Equipamentos from './Equipamentos';
import Pessoal from './Pessoal';
import Bolsa from './Bolsa';
import Encargo from './Encargo';

import { useProject } from '../../../../../hooks/project';

export default function Orcamento() {
  const { configuration } = useProject();

  return (
    <>
      {JSON.parse(configuration.orcamento).orcamentos.diarias.checked
      && (
      <Diarias />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.hospedagem_alimentacao.checked
      && (
      <Hospedagem />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.materiais_consumo.checked
      && (
      <Materiais />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.passagens.checked
      && (
      <Passagem />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.servicos_terceiros.checked
      && (
      <Servicos />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.materiais_equipamentos.checked
      && (
      <Equipamentos />
      )}

      {JSON.parse(configuration.orcamento).orcamentos.pessoal.checked
      && (
      <Pessoal />
      )}

      {/* {JSON.parse(configuration.orcamento).orcamentos.bolsas.checked
      && (
      <Bolsa />
      )} */}

      {JSON.parse(configuration.orcamento).orcamentos.encargos.checked
      && (
      <Encargo />
      )}
    </>
  );
}
