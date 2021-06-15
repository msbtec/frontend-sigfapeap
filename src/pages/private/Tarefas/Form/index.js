import React, {
  memo, useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { store } from 'react-notifications-component';

import { Form } from '../../../../components/Form';

import { StyledModal } from './styles';
import api from '../../../../services/api';

function ModalForm({
  isOpen, atividade, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const [description, setDescription] = useState(item ? item.description : '');

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (description == "") {
          return null;
        }

        if (item) {
          const formData = new FormData();
          formData.append("description", description);
          formData.append("activity_id", item.activity_id);

          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          api.put(`tasks/${item.id}`, formData).then(({ data }) => {
            submit();

            store.addNotification({
              message: `Tarefa atualizada com sucesso!`,
              type: 'success',
              insert: 'top',
              container: 'top-right',
              animationIn: ['animate__animated', 'animate__fadeIn'],
              animationOut: ['animate__animated', 'animate__fadeOut'],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            });
          });
        } else {
          const formData = new FormData();
          formData.append("description", description);
          formData.append("activity_id", atividade.id);

          if (selectedFile) {
            formData.append("file", selectedFile);
          }

          api.post(`tasks`, formData).then(({ data }) => {
            submit();

            store.addNotification({
              message: `Tarefa inserida com sucesso!`,
              type: 'success',
              insert: 'top',
              container: 'top-right',
              animationIn: ['animate__animated', 'animate__fadeIn'],
              animationOut: ['animate__animated', 'animate__fadeOut'],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [selectedFile, atividade, description, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar tarefa' : 'Atualizar tarefa'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <div className="input-block">
              <label style={{ marginBottom: 10 }}>
                Descrição
              </label>
              {/* <CKEditor
                editor={ClassicEditor}
                data={description}
                onReady={(editor) => {
                  setDescription(item ? item.description : '');
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              /> */}
              <textarea
                rows={5}
                style={{ borderColor: "rgb(153, 153, 153)", padding: 10 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 10 }} className="input-block">
              <label htmlFor="email">
                Anexo
                {/* <sup style={{ color: "#f00" }}>* Tamanho máximo 3MB</sup> */}
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      if (e.target.files[0].size / 1000000 > 3) {
                        store.addNotification({
                          message: `Seu arquivo: ${e.target.files[0].name} é muito grande! Max:${3}MB`,
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
                        setSelectedFile(e.target.files[0]);
                      }
                    }
                  }}
                />
                <div className="text">
                  { selectedFile ? selectedFile.name : 'Selecione um arquivo' }
                </div>
                <div className="icon">
                  <FiFile />
                </div>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="close" onClick={toggleModal}>
              <FiX />
              {' '}
              Fechar
            </button>
            <button type="submit" className="submit">
              <FiCheckCircle />
              {' '}
              Salvar
            </button>
          </div>
        </Form>
      </Unform>

    </StyledModal>
  );
}

export default memo(ModalForm);
