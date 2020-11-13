import React, { useState } from 'react';

import { FiFile } from 'react-icons/fi';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const Form1 = ({ formRef }) => {
  const [isForeign, setIsForeign] = React.useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  return (
    <Form>

      <div className="input-block">
        <label htmlFor="email">
          Foto
          {' '}
          <sup style={{ color: "#f00" }}>*</sup>
        </label>
        <div style={{ marginBottom: 5 }} />
        <label className="file-input">
          <input
            type="file"
            placeholder="Arquivo"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <div className="text">
            { selectedFile ? selectedFile.name : 'Selecione uma foto de perfil' }
          </div>
          <div className="icon">
            <FiFile />
          </div>
        </label>
        <sup style={{ color: '#c53030', marginTop: 5 }}>
          {errorFile}
        </sup>
      </div>

      <Input formRef={formRef} name="type_personal" setIsForeign={setIsForeign} select={["Pesquisador", "Pesquisador estrangeiro"]} required original title="Tipo Pessoa" />

      <Input formRef={formRef} name="name" required original title="Nome completo" />

      {!isForeign && (
      <>
        <Input formRef={formRef} name="rg" type="number" required original title="RG" />

        <Input formRef={formRef} name="orger_emitter" required original title="Orgão Emissor" />

        <Input formRef={formRef} name="uf" select={["AP", "PA"]} required original title="UF" />

        <Input formRef={formRef} name="date_emitter" type="date" required original title="Data de Emissão" />
      </>
      )}

      <Input formRef={formRef} name="email" required original title="E-mail" />

      <Input formRef={formRef} name="sex" select={["Masculino", "Feminino", "Não declarar"]} required original title="Sexo" />

      <Input formRef={formRef} name="birthday" type="date" required original title="Data de Nascimento" />

      <Input formRef={formRef} name="race" select={["Amarela", "Branca", "Indígena", "Não declarada", "Parda", "Preta"]} original title="Raça" />

      <Input formRef={formRef} name="mother_name" required original title="Nome da Mãe" />

      <Input formRef={formRef} name="father_name" original title="Nome do Pai" />

      <Input formRef={formRef} name="curriculum" required original title="Link Currículo Lattes" />

      <Input formRef={formRef} name="school" select={["Ensino Fundamental", "Ensino Médio", "Ensino Superior", "Especialização", "Mestrado", "Doutorado", "Pós-doutorado"]} required original title="Nível Acadêmico" />

      {isForeign && (
      <>
        <Input formRef={formRef} name="passport" original title="Passaporte" />

        <Input formRef={formRef} name="rg_foreign" type="number" required original title="Rg de Estrangeiro" />
      </>
      )}

      <Input formRef={formRef} name="area_knowledge1" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 1" />

      <Input formRef={formRef} name="area_knowledge2" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 2" />

      <Input formRef={formRef} name="area_knowledge3" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 3" />
    </Form>
  );
};

export default Form1;
