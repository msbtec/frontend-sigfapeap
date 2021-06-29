import React, {
  memo, useRef,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiX } from 'react-icons/fi';

import { Form } from '../../../../components/Form';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Solicitação</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef}>

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

            <div style={{ marginTop: 20 }}>
              <label style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Resposta:
              </label>
              <div style={{ overflowWrap: 'break-word', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: item?.resposta }} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="close" onClick={toggleModal}>
              <FiX />
              {' '}
              Fechar
            </button>
          </div>
        </Form>
      </Unform>

    </StyledModal>
  );
}

export default memo(ModalForm);
