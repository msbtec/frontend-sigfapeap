import React from 'react';

import Diarias from './Diarias';
import Hospedagem from './Hospedagem';
import Materiais from './Materiais';
import Passagem from './Passagem';
import Servicos from './Servicos';
import Equipamentos from './Equipamentos';

export default function Orcamento() {
  return (
    <>
      <Diarias />
      <Hospedagem />
      <Materiais />
      <Passagem />
      <Servicos />
      <Equipamentos />
    </>
  );
}
