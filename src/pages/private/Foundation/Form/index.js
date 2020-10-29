import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useFoundation } from '../../../../hooks/foundation';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { insertFoundation, updateFoundation } = useFoundation();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          cnpj: Yup.string().required('Campo obrigatório'),
          name: Yup.string().required('Campo obrigatório'),
          social_name: Yup.string().required('Campo obrigatório'),
          address: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (item) {
          updateFoundation(data);
        } else {
          insertFoundation(data);
        }

        submit();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [insertFoundation, updateFoundation, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar instituição de pesquisa' : 'Atualizar instituição de pesquisa'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="cnpj" maxLength={18} required original title="CNPJ" />

            <Input formRef={formRef} name="name" required original title="Nome da instituição de pesquisa" />

            <Input formRef={formRef} name="social_name" required original title="Razão social da instituição de pesquisa" />

            <Input formRef={formRef} name="address" required original title="Endereço" />

            <Input formRef={formRef} name="site" original title="Site" />

            <Input formRef={formRef} name="phone" original title="Telefone" />

            <Input formRef={formRef} name="email" original title="E-mail" />

            <Input formRef={formRef} name="observation" original title="Observações" />
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
