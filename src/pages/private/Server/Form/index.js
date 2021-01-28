import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useUser } from '../../../../hooks/user';
import { useOffice } from '../../../../hooks/office';
import { useProfile } from '../../../../hooks/profile';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { create, update } = useUser();
  const { offices } = useOffice();
  const { profiles } = useProfile();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          //   nomeReduzido: Yup.string().required('Campo obrigatório'),
          cpf: Yup.string().required('Campo obrigatório'),
          email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
          office_id: Yup.string().required('Campo obrigatório'),
          phone: Yup.string().required('Campo obrigatório'),
          profile_id: Yup.string().required('Campo obrigatório'),
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
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar usuário' : 'Atualizar usuário'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="name" required original title="Nome completo" />

            {/* <Input formRef={formRef} name="name" required original title="Nome reduzido" /> */}

            <Input formRef={formRef} name="cpf" required original title="CPF" />

            <Input formRef={formRef} name="email" required original title="E-mail" />

            <Input formRef={formRef} name="address" original title="Endereço" />

            <Input formRef={formRef} maxLength={15} required name="phone" original title="Telefone/WhatsApp" />

            <Input formRef={formRef} name="office_id" select={offices} required original title="Cargo/função" />

            <Input formRef={formRef} name="profile_id" select={profiles} required original title="Perfil" />
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
