import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../../components/Form';

import { useAuth } from '../../../../../hooks/auth';

import getValidationErrors from '../../../../../utils/getValidationErrors';

import Input from '../../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { signUp, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          name_mini: Yup.string().required('Campo obrigatório'),
          cpf: Yup.string().required('Campo obrigatório'),
          email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
          office: Yup.string().required('Campo obrigatório'),
          perfil: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (item) {
          updateUser(data);
        } else {
          signUp(data);
        }

        submit();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [signUp, updateUser, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar servidor' : 'Atualizar servidor'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="area_knowledge1" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 1" />

            <Input formRef={formRef} name="area_knowledge1" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 1" />

            <Input formRef={formRef} name="area_knowledge1" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 1" />

            <Input formRef={formRef} name="area_knowledge1" select={["Ciências Exatas e da Terra", "Engenharias", "Ciências Humanas"]} original title="Área de Conhecimento 1" />
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
