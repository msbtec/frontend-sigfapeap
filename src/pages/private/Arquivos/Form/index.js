import React, {
  memo, useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useArchive } from '../../../../hooks/archive';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { create, update } = useArchive();

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
        });

        if (!selectedFile && !item) {
          setErrorFile('Campo obrigatório');
        } else {
          setErrorFile('');
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedFile || item) {
          if (item) {
            update({
              id: item.id, ...data,
            }, selectedFile);
          } else {
            create(data, selectedFile);
          }
          submit();
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [create, selectedFile, update, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar arquivo' : 'Atualizar arquivo'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="title" required original title="Nome do arquivo" />

            <div style={{ marginBottom: 10 }} className="input-block">
              <label htmlFor="email">
                Anexo
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: errorFile ? "#f00" : "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  accept=".pdf,.doc,.docx"
                  // onChange={(e) => setSelectedFile(e.target.files[0])}
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
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errorFile}
              </sup>
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
