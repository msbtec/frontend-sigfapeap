import React, { Suspense,useState,lazy } from 'react';

import { ModalProvider } from 'styled-react-modal';

import { FiFile } from 'react-icons/fi';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

let ModalForm = () => <></>;

const Form1 = ({
  formRef, selectedFile, setSelectedFile, errorFile,
  knowledgesArea, setKnowledgesArea
}) => {
  const [isForeign, setIsForeign] = React.useState(false);

  const [OpenForm, setOpenForm] = useState(false);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  return (
    <Form>

      <Input formRef={formRef} name="type_personal" setIsForeign={setIsForeign} select={["Pesquisador", "Pesquisador estrangeiro"]} required original title="Tipo Pessoa" />

      <Input formRef={formRef} name="name" required original title="Nome completo" />

      <div className="input-block">
        <label htmlFor="email">
          Foto
          {' '}
          <sup style={{ color: "#f00" }}>*</sup>
        </label>
        <div style={{ marginBottom: 5 }} />
        <label className="file-input" style={{ borderColor: errorFile ? '#b20710' : '#dee2e6' }}>
          <input
            type="file"
            placeholder="Arquivo"
            accept="image/*"
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

      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={() => {
            toggleModalForm()
        }}>
          + área de conhecimento
        </button>
      </div>

      <h1>{JSON.stringify(knowledgesArea)}</h1>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm knowledgesArea={knowledgesArea} setKnowledgesArea={setKnowledgesArea} isOpen={OpenForm} toggleModal={toggleModalForm} submit={submitModalForm} />
        </ModalProvider>
      </Suspense>
    </Form>
  );
};

export default Form1;
