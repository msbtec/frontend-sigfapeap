import React from 'react';

import { FiFile } from 'react-icons/fi';
import { AiOutlineFilePdf } from 'react-icons/ai';

import { store } from 'react-notifications-component';

import { Form } from '../../../../../components/Form';

import { useProject } from '../../../../../hooks/project';

export default function Header({
  files, setFiles,
}) {
  const { configuration, project } = useProject();

  return (
    <Form>
      {files.map((item, index) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ marginBottom: 10 }} className="input-block">
            <label className="required">Título</label>
            <input defaultValue={`${item.title}`} type="text" disabled />
          </div>

          <AiOutlineFilePdf
            onClick={() => item.url_document && window.open(item.url_document || window.URL.createObjectURL(item.file), '__blank')}
            style={{
              fontSize: 55, marginTop: 10, marginLeft: 10, marginRight: project?.submetido != "true" ? 0 : 20, cursor: 'pointer',
            }}
          />

          <div className="input-block" style={{ marginLeft: 10, marginBottom: 25 }}>
            <label htmlFor="email">
              Anexo
            </label>
            <div style={{ marginBottom: 5 }} />
            <label className="file-input">
              <input
                type="file"
                placeholder="Arquivo"
                accept=".pdf"
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
                      setFiles(files.map((file, subindex) => (index == subindex ? ({ ...file, title: item.title, file: e.target.files[0] }) : file)));
                    }
                  }
                }}
              />
              <div className="text">
                {files.length > 0 ? files[index].file.size ? files[index].file.name : files[index].url_attachment ? 'Selecione para alterar anexo' : 'Selecione anexo' : 'Selecione anexo'}
              </div>
              <div className="icon">
                <FiFile />
              </div>
            </label>
          </div>

          <div style={{ display: 'flex' }}>
            <AiOutlineFilePdf
              onClick={() => (item.file.size ? window.open(window.URL.createObjectURL(item.file), '__blank') : item.url_attachment && window.open(item.url_attachment, '__blank'))}
              style={{
                fontSize: 25, marginTop: 10, marginLeft: 10, marginRight: 10, cursor: 'pointer',
              }}
            />
          </div>
        </div>
      ))}
    </Form>
  );
}
