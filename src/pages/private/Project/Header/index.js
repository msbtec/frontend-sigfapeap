import React from 'react';

import uuid from 'react-uuid';

import { FiFile, FiTrash } from 'react-icons/fi';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

export default function Header({ formRef, user, edital, files, setFiles}) {
//   const [OpenForm, setOpenForm] = useState(false);

//   const [type, setType] = useState(1);

//   async function toggleModalForm() {
//     ModalForm = await lazy(() => import("./Modal"));

//     setOpenForm(!OpenForm);
//   }

//   function submitModalForm() {
//     setOpenForm(!OpenForm);
//   }

//   function formartText(a) {
//     if (a[0] == "") {
//       const text = Object.keys(a).map((key) => a[key]).join(', ');
//       return text.substring(0, text.length - 6);
//     } if (a[1] == "") {
//       const text = Object.keys(a).map((key) => a[key]).join(', ');
//       return text.substring(0, text.length - 6);
//     } if (a[2] == "") {
//       const text = Object.keys(a).map((key) => a[key]).join(', ');
//       return text.substring(0, text.length - 4);
//     } if (a[3] == "") {
//       const text = Object.keys(a).map((key) => a[key]).join(', ');
//       return text.substring(0, text.length - 2);
//     }
//     const text = Object.keys(a).map((key) => a[key]).join(', ');
//     return text;
//   }

  return (
    <Form>
      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Edital</label>
        <input value={edital?.title} type="text" disabled />
      </div>

      <Input formRef={formRef} name="title" title="Título" required original />

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Protocolo</label>
        <input value={uuid()} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Coordenador</label>
        <input value={user.name} type="text" disabled />
      </div>

      <Input formRef={formRef} name="email" title="E-mail" required original />

      <Input formRef={formRef} name="faixa_value" title="Faixa de valor" required original />

      {/* <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
      }}
      >
        <div className="input-block">
          <label className="required">
            Áreas de conhecimento
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
            Linha(s) de pesquisa(s)
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
          selecionar linha(s)
        </button>
      </div> */}

      <Input formRef={formRef} name="theme" title="Tema de interesse" original />

      <Input formRef={formRef} name="institution" title="Instituição executora" required original />

      <Input formRef={formRef} name="unity_execution" title="Unidade executora" required original />

      <Input formRef={formRef} name="beggin" title="Início previsto" type="date" required original />

      <Input formRef={formRef} name="duration" title="Duração" select={[{id:"6",name:"6 Meses"}, {id:"12",name:"12 Meses"}, {id:"18",name:"18 Meses"}, {id:"24",name:"24 Meses"}]} required original />

      <Input formRef={formRef} name="money_foreign" title="Cotação da Moeda Estrangeira" original />

      {files.map((item, index) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ marginBottom: 10 }} className="input-block">
                <label className="required">Título</label>
                <input defaultValue={`FAPEAP - ANEXO ${index + 1}`} type="text" disabled />
            </div>

            <div className="input-block" style={{ marginLeft: 10, marginBottom: 25 }}>
                <label htmlFor="email">
                    Anexo
                </label>
                <div style={{ marginBottom: 5 }} />
                <label className="file-input">
                    <input type="file" placeholder="Arquivo" accept="image/*" onChange={(e) => setFiles(files.map((file, subindex) => index == subindex ? ({...file, file: e.target.files[0]}) : file ))} />
                    <div className="text">
                        {files.length > 0 && files[index].file?.name || 'Selecione anexo'}
                    </div>
                    <div className="icon">
                        <FiFile />
                    </div>
                </label>
            </div>

            <FiTrash style={{ fontSize: 50, marginTop:10, marginLeft: 20, marginRight: 20, cursor: 'pointer' }} />
        </div>
      ))}

      <button
          style={{ marginBottom: 20 ,width: 150}}
          type="button"
          onClick={() => {
              setFiles([...files, {
                title: 'FAPEAP - ANEXO',
                file: null,
              }])
          }}
        >
          Adicionar anexo
      </button>

      {/* <Suspense fallback={null}>
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
      </Suspense> */}
    </Form>
  );
}
