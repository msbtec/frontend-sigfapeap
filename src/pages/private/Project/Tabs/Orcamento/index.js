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

export default function Orcamento() {
  return (
    <>
      <Diarias />
      <Hospedagem />
      <Materiais />
      <Passagem />
      <Servicos />
      <Equipamentos />
      <Pessoal />
      <Bolsa />
      <Encargo />
    </>
  );
}
