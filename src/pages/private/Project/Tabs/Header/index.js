import React from 'react';

import { FiFile, FiTrash } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';

import { uuid } from 'uuidv4';
import { Form } from '../../../../../components/Form';
import Input from '../../../../../components/Input';
import api from '~/services/api';

export default function Header({
  formRef, protocolo, user, edital, files, setFiles,
}) {
  async function deleteFile(id) {
    api.delete(`attachments/${id}`).then(({ data }) => {});
  }

  return (
    <Form>
      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Edital</label>
        <input value={edital.title} type="text" disabled />
      </div>

      <Input formRef={formRef} name="title" title="Título" required original />

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Protocolo</label>
        <input value={protocolo} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Coordenador</label>
        <input value={user.name} type="text" disabled />
      </div>

      <Input formRef={formRef} name="email" title="E-mail" required original />

      <Input formRef={formRef} name="faixa_value" title="Faixa de valor" required original />

      <Input formRef={formRef} name="theme" title="Tema de interesse" original />

      <Input formRef={formRef} name="institution" title="Instituição executora" required original />

      <Input formRef={formRef} name="unity_execution" title="Unidade executora" required original />

      <Input formRef={formRef} name="beggin_prevision" title="Início previsto" type="date" required original />

      <Input formRef={formRef} name="duration" title="Duração" select={[{ id: "6", name: "6 Meses" }, { id: "12", name: "12 Meses" }, { id: "18", name: "18 Meses" }, { id: "24", name: "24 Meses" }]} required original />

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
              <input type="file" placeholder="Arquivo" accept="image/*" onChange={(e) => setFiles(files.map((file, subindex) => (index == subindex ? ({ ...file, file: e.target.files[0] }) : file)))} />
              <div className="text">
                {files.length > 0 && files[index].file.name || 'Selecione anexo'}
              </div>
              <div className="icon">
                <FiFile />
              </div>
            </label>
          </div>

          <div style={{ display: 'flex' }}>
            <FaEye
              onClick={() => item.file.name && window.open(item.file.url || window.URL.createObjectURL(item.file), '__blank')}
              style={{
                fontSize: 25, marginTop: 10, marginLeft: 20, cursor: 'pointer',
              }}
            />

            <FiTrash
              onClick={() => {
                setFiles(files.filter((file) => file.id !== item.id));
                deleteFile(item.id);
              }}
              style={{
                fontSize: 25, marginTop: 10, marginLeft: 20, marginRight: 20, cursor: 'pointer',
              }}
            />
          </div>
        </div>
      ))}

      <button
        style={{ marginBottom: 20, width: 150 }}
        type="button"
        onClick={() => {
          setFiles([...files, {
            id: uuid(),
            title: 'FAPEAP - ANEXO',
            file: { name: null },
          }]);
        }}
      >
        Adicionar anexo
      </button>
    </Form>
  );
}
