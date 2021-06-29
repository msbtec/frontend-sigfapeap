import React, {
  memo, useEffect, useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import SelectMultiple from "react-select";

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import { useAuth } from '../../../../hooks/auth';
import Input from '../../../../components/Input';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import { StyledModal } from './styles';
import api from '../../../../services/api';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useAuth();

  const [description, setDescription] = useState("");

  useEffect(() => {
    document.title = 'SIGFAPEAP - Atividades';
  }, [user]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          assunto: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = new FormData();
        formData.append("assunto", data.assunto);
        formData.append("solicitacao", description);
        formData.append("user_id", user.id);

        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        api.post(`attendances`, formData).then(({ data }) => {
          submit();

          store.addNotification({
            message: `Solicitação enviada com sucesso. A FAPEAP terá prazo de 5 dias úteis para responder a solicitação!`,
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
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [submit, description, user, selectedFile],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Nova Solicitação</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="assunto" required original title="Assunto" />

            <div className="input-block">
              <label>
                Solicitação
              </label>
              <textarea
                rows={5}
                style={{ borderColor: "rgb(153, 153, 153)", padding: 10 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              />
              <span style={{
                display: "flex", color: '#626262', justifyContent: 'flex-end', fontSize: 11, marginBottom: -10,
              }}
              >
                {`${description.length}/255 caracteres`}
              </span>
            </div>

            <div style={{ marginBottom: 10 }} className="input-block">
              <label htmlFor="email">
                Anexo
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  accept=".pdf"
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
                  { selectedFile ? selectedFile.name : 'Selecione um anexo' }
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
