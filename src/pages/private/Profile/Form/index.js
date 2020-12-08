import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useProfile } from '../../../../hooks/profile';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { access, create, update } = useProfile();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (String(data.access) == "undefined") {
          data = { ...data, access: item.access };
        } else if (String(data.access) == "null") {
          data = { ...data, access: "" };
        }

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          access: Yup.string().required('Pelo menos um acesso deve ser submetido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (item) {
          update({ id: item.id, ...data });
        } else {
          create(data);
        }

        submit();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [create, update, item, submit],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar perfil' : 'Atualizar perfil'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" style={{ height: 400 }} ref={reference}>
            <Input formRef={formRef} name="name" required original title="Nome do perfil" />
            <Input formRef={formRef} name="access" required multi access={access} title="Acessos" />
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
