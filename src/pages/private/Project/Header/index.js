import React, { Suspense, useState, lazy } from 'react';

import { ModalProvider } from 'styled-react-modal';
import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

let ModalForm = () => <></>;

export default function Header({ formRef, knowledgesArea, setKnowledgesArea }) {
  const [OpenForm, setOpenForm] = useState(false);

  const [type, setType] = useState(1);

  async function toggleModalForm() {
    ModalForm = await lazy(() => import("./Modal"));

    setOpenForm(!OpenForm);
  }

  function submitModalForm() {
    setOpenForm(!OpenForm);
  }

  function formartText(a) {
    if (a[0] == "") {
      const text = Object.keys(a).map((key) => a[key]).join(', ');
      return text.substring(0, text.length - 6);
    } if (a[1] == "") {
      const text = Object.keys(a).map((key) => a[key]).join(', ');
      return text.substring(0, text.length - 6);
    } if (a[2] == "") {
      const text = Object.keys(a).map((key) => a[key]).join(', ');
      return text.substring(0, text.length - 4);
    } if (a[3] == "") {
      const text = Object.keys(a).map((key) => a[key]).join(', ');
      return text.substring(0, text.length - 2);
    }
    const text = Object.keys(a).map((key) => a[key]).join(', ');
    return text;
  }

  return (
    <Form>
      <Input formRef={formRef} name="title" title="Título" required original />

      <Input formRef={formRef} name="coordenator" title="Coordenador" required original />

      <Input formRef={formRef} name="email" title="E-mail" required original />

      <Input formRef={formRef} name="faixa_value" title="Faixa de valor" required original />

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
      </div>

      <Input formRef={formRef} name="institution" title="Instituição de pesquisa" required original />

      <Input formRef={formRef} name="unity_execution" title="Unidade Executora" required original />

      <Input formRef={formRef} name="duration" title="Duração" required original />

      <Input formRef={formRef} name="money_foreign" title="Cotação da Moeda Estrangeira" required original />

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
}
