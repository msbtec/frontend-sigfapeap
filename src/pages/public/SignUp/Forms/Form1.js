import React, { Suspense, useState, lazy } from 'react';

import { ModalProvider } from 'styled-react-modal';

import { FiFile } from 'react-icons/fi';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';
import api from '~/services/api';

let ModalForm = () => <></>;

const Form1 = ({
  formRef, selectedFile, setSelectedFile, errorFile,
  knowledgesArea, setKnowledgesArea,
}) => {
  const [isForeign, setIsForeign] = React.useState(false);

  const [institutions,setInstitutions] = useState([])

  const [OpenForm, setOpenForm] = useState(false);

  const [type, setType] = useState(1);

  React.useEffect(() => {
      api.get('foundations').then(({data}) => {
        setInstitutions(data.map(item => ({id: item.id, name: item.name})))
      })
  },[])

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  function formartText(a){
    if (a[0] == "") {
        const text = Object.keys(a).map((key) => a[key]).join(', ');
        return text.substring(0, text.length - 6);
    } else if (a[1] == "") {
        const text = Object.keys(a).map((key) => a[key]).join(', ');
        return text.substring(0, text.length - 6);
    } else if (a[2] == "") {
        const text = Object.keys(a).map((key) => a[key]).join(', ');
        return text.substring(0, text.length - 4);
    } else if (a[3] == "") {
        const text = Object.keys(a).map((key) => a[key]).join(', ');
        return text.substring(0, text.length - 2);
    } else {
        const text = Object.keys(a).map((key) => a[key]).join(', ');
        return text;
    }
  }

  return (
    <Form>

      <Input formRef={formRef} name="type_personal" setIsForeign={setIsForeign} select={[{id:"Pesquisador",name:"Pesquisador"}, {id:"Pesquisador estrangeiro",name:"Pesquisador estrangeiro"}]} required original title="Tipo Pessoa" />

      <Input formRef={formRef} name="name" required original title="Nome completo" />

      <Input formRef={formRef} name="foundation_id" select={institutions} original title="Instituição" />

      {/* <div className="input-block">
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
      </div> */}

      {!isForeign && (
      <>
        <Input formRef={formRef} name="rg" type="number" required original title="RG" />

        <Input formRef={formRef} name="orger_emitter" required original title="Orgão Emissor" />

        <Input formRef={formRef} name="uf" select={[
            {id:"AC",name:"AC"},
            {id:"AL",name:"AL"},
            {id:"AP",name:"AP"},
            {id:"AM",name:"AM"},
            {id:"BA",name:"BA"},
            {id:"CE",name:"CE"},
            {id:"DF",name:"DF"},
            {id:"ES",name:"ES"},
            {id:"GO",name:"GO"},
            {id:"MA",name:"MA"},
            {id:"MT",name:"MT"},
            {id:"MS",name:"MS"},
            {id:"MG",name:"MG"},
            {id:"PA",name:"PA"},
            {id:"PB",name:"PB"},
            {id:"PR",name:"PR"},
            {id:"PE",name:"PE"},
            {id:"PI",name:"PI"},
            {id:"RJ",name:"RJ"},
            {id:"RN",name:"RN"},
            {id:"RS",name:"RS"},
            {id:"RO",name:"RO"},
            {id:"RR",name:"RR"},
            {id:"SC",name:"SC"},
            {id:"SP",name:"SP"},
            {id:"SE",name:"SE"},
            {id:"TO",name:"TO"}
        ]} required original title="UF" />

        <Input formRef={formRef} name="date_emitter" type="date" required original title="Data de Emissão" />
      </>
      )}

      <Input formRef={formRef} name="email" required original title="E-mail" /* title="E-mail (use virgulas para separar os endereços de e-mail, o primeiro e-mail será o principal)" */ />

      <Input formRef={formRef} name="sex" select={[{id:"Masculino",name:"Masculino"}, {id:"Feminino",name:"Feminino"}, {id:"Não declarar",name:"Não declarar"}]} required original title="Sexo" />

      <Input formRef={formRef} name="birthday"  type="date" required original title="Data de Nascimento" />

      <Input formRef={formRef} name="race" select={[{id:"Amarela",name:"Amarela"}, {id:"Branca",name:"Branca"}, {id:"Indígena",name:"Indígena"}, {id:"Não declarada",name:"Não declarada"}, {id:"Parda",name:"Parda"}, {id:"Preta",name:"Preta"}]} original title="Raça" />

      <Input formRef={formRef} name="mother_name" required original title="Nome da Mãe" />

      <Input formRef={formRef} name="father_name" original title="Nome do Pai" />

      <Input formRef={formRef} name="curriculum" required original title="Link Currículo Lattes" />

      <Input formRef={formRef} name="school" select={[{id:"Ensino Fundamental",name:"Ensino Fundamental"}, {id:"Ensino Médio",name:"Ensino Médio"}, {id:"Ensino Superior",name:"Ensino Superior"}, {id:"Especialização",name:"Especialização"}, {id:"Mestrado",name:"Mestrado"}, {id:"Doutorado",name:"Doutorado"}, {id:"Pós-doutorado",name:"Pós-doutorado"}]} required original title="Nível Acadêmico" />

      {isForeign && (
      <>
        <Input formRef={formRef} name="passport" original title="Passaporte" />

        <Input formRef={formRef} name="rg_foreign" required original title="Rg de Estrangeiro" />
      </>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      >
        <div className="input-block">
          <label className="required">
            Área de conhecimento 1
          </label>
          <input
            value={formartText(Object.keys(knowledgesArea.one).map((key, index) => knowledgesArea.one[key]))}
          />
        </div>

        <button
          style={{ marginTop: 20, marginLeft: 20 }}
          type="button"
          onClick={() => {
            toggleModalForm();
            setType(1);
          }}
        >
          selecionar área(s)
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      >
        <div className="input-block">
          <label className="required">
            Área de conhecimento 2
          </label>
          <input
            value={formartText(Object.keys(knowledgesArea.two).map((key, index) => knowledgesArea.two[key]))}
          />
        </div>

        <button
          style={{ marginTop: 20, marginLeft: 20 }}
          type="button"
          onClick={() => {
            toggleModalForm();
            setType(2);
          }}
        >
          selecionar área(s)
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      >
        <div className="input-block">
          <label className="required">
            Área de conhecimento 3
          </label>
          <input
            value={formartText(Object.keys(knowledgesArea.three).map((key, index) => knowledgesArea.three[key]))}
          />
        </div>

        <button
          style={{ marginTop: 20, marginLeft: 20 }}
          type="button"
          onClick={() => {
            toggleModalForm();
            setType(3);
          }}
        >
          selecionar área(s)
        </button>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm
            knowledgesArea={knowledgesArea}
            setKnowledgesArea={setKnowledgesArea}
            isOpen={OpenForm}
            toggleModal={toggleModalForm}
            submit={submitModalForm}
            type={type}
          />
        </ModalProvider>
      </Suspense>
    </Form>
  );
};

export default Form1;
