import React, {
  memo, useRef, useState, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import { StyledModal } from './styles';
import api from '../../../../services/api';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();
        formData.append("solicitacao", item.solicitacao);
        formData.append("resposta", description);

        api.put(`attendances/${item.id}`, formData).then(({ data }) => {
          submit();

          store.addNotification({
            message: `Resposta enviada com sucesso!`,
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
    [description, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Responder Solicitação</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Assunto:
              </label>
              <td style={{ overflowWrap: 'break-word', marginTop: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: item?.assunto }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Solicitação:
              </label>
              <div style={{ overflowWrap: 'break-word', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item?.solicitacao }} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Anexo:
              </label>
              <td style={{ marginTop: 10, textAlign: 'center' }}>
                <a className="url" href={item?.name ? item?.url : null} target="_blank">{item?.name ? item?.name : "Sem Anexo"}</a>
              </td>
            </div>

            <div className="input-block">
              <label>
                Resposta
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
