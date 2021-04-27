import React from 'react';

import { FiFile, FiTrash } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';

import { store } from 'react-notifications-component';

import { uuid } from 'uuidv4';
import { Form } from '../../../../../components/Form';
import Input from '../../../../../components/Input';
import api from '../../../../../services/api';

import { useAuth } from '../../../../../hooks/auth';

// eslint-disable-next-line import/named
import { useProject } from '../../../../../hooks/project';

export default function Header({
  formRef, invalid, protocolo, edital, files, setFiles,
}) {
  const { user } = useAuth();

  const { configuration } = useProject();

  async function deleteFile(id) {
    api.delete(`attachments/${id}`).then(({ data }) => {});
  }

  return (
    <Form>
      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Edital</label>
        <input value={edital.title} type="text" disabled />
      </div>

      {configuration.plano_trabalho.fields.titulo_projeto.checked
      && <Input formRef={formRef} name="title" title="Título" original />}

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Protocolo</label>
        <input value={protocolo} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Coordenador</label>
        <input value={user.name} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">E-mail</label>
        <input value={user.email} type="text" disabled />
      </div>

      {/* <Input formRef={formRef} name="email" title="E-mail"  original /> */}

      {configuration.plano_trabalho.fields.faixa_valor.checked
      && <Input formRef={formRef} name="faixa_value" title="Faixa de valor" original />}

      {configuration.plano_trabalho.fields.tema_interesse.checked
      && <Input formRef={formRef} name="theme" title="Tema de interesse" original />}

      {configuration.plano_trabalho.fields.instituicao.checked
      && <Input formRef={formRef} name="institution" title="Instituição executora" original />}

      {/* {configuration.plano_trabalho.fields.unidade_executora.checked
      && <Input formRef={formRef} name="unity_execution" title="Unidade executora" original />} */}

      {configuration.plano_trabalho.fields.inicio_previsto.checked
      && <Input formRef={formRef} name="beggin_prevision" title="Início previsto" type="date" original />}

      {configuration.plano_trabalho.fields.duracao.checked
      && <Input formRef={formRef} name="duration" title="Duração" select={[{ id: "6", name: "6 Meses" }, { id: "12", name: "12 Meses" }, { id: "18", name: "18 Meses" }, { id: "24", name: "24 Meses" }]} original />}

      {configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.checked
      && <Input formRef={formRef} name="money_foreign" title="Cotação da Moeda Estrangeira" original />}

      {files.map((item, index) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ marginBottom: 10 }} className="input-block">
            <label className="required">Título</label>
            <input defaultValue={`${configuration.plano_trabalho.name} ${index + 1}`} type="text" disabled />
          </div>

          <div className="input-block" style={{ marginLeft: 10, marginBottom: 25 }}>
            <label htmlFor="email">
              Anexo
            </label>
            <div style={{ marginBottom: 5 }} />
            <label className="file-input">
              <input
                type="file"
                placeholder="Arquivo"
                accept=".pdf, .doc, .docx"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    if (e.target.files[0].size / 1000000 > Number(configuration.plano_trabalho.size)) {
                      store.addNotification({
                        message: `Seu arquivo: ${e.target.files[0].name} é muito grande! Max:${configuration.plano_trabalho.size}MB`,
                        type: 'danger',
                        insert: 'top',
                        container: 'top-right',
                        animationIn: ['animate__animated', 'animate__fadeIn'],
                        animationOut: ['animate__animated', 'animate__fadeOut'],
                        dismiss: {
                          duration: 5000,
                          onScreen: true,
                        },
                      });
                    } else {
                      setFiles(files.map((file, subindex) => (index == subindex ? ({ ...file, file: e.target.files[0] }) : file)));
                    }
                  }
                }}
              />
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

      {files.length < Number(configuration.plano_trabalho.quantity)
      && !invalid && (
      <button
        style={{ marginTop: 20, marginBottom: 20, width: 150 }}
        type="button"
        onClick={() => {
          if (files.length < Number(configuration.plano_trabalho.quantity)) {
            setFiles([...files, {
              id: uuid(),
              title: configuration.plano_trabalho.name,
              file: { name: null },
            }]);
          }
        }}
      >
        Adicionar anexo
      </button>
      )}
    </Form>
  );
}
