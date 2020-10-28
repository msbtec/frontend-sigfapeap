import React from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const SignUp = ({ formRef }) => (
  <Form>
    <Input formRef={formRef} name="type_personal" select={["Pesquisador", "Pesquisador estrangeiro"]} required original title="Tipo Pessoa" />

    <Input formRef={formRef} name="name" required original title="Nome completo" />

    <Input formRef={formRef} name="rg" required original title="RG" />

    <Input formRef={formRef} name="orger_emitter" required original title="Orgão Emissor" />

    <Input formRef={formRef} name="uf" select={["AP", "PA"]} required original title="UF" />

    <Input formRef={formRef} name="date_emitter" required original title="Data de Emissão" />

    <Input formRef={formRef} name="email" required original title="E-mail" />

    <Input formRef={formRef} name="perfil" select={["Masculino", "Feminino", "Não declarar"]} required original title="Sexo" />

    <Input formRef={formRef} name="birthday" required original title="Data de Nascimento" />

    <Input formRef={formRef} name="race" select={["Amarela", "Branca", "Indígena", "Não declarada", "Parda", "Preta"]} required original title="Raça" />

    <Input formRef={formRef} name="mother_name" required original title="Nome da Mãe" />

    <Input formRef={formRef} name="father_name" required original title="Nome do Pai" />

    <Input formRef={formRef} name="curriculum" required original title="Link Currículo Lattes" />

    <Input formRef={formRef} name="school" select={["Ensino Fundamental", "Ensino Médio", "Ensino Superior", "Especialização", "Mestrado", "Doutorado", "Pós-doutorado"]} required original title="Nível Acadêmico" />

    <Input formRef={formRef} name="area_knowledge" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} required original title="Área de Conhecimento" />
  </Form>
);

export default SignUp;
