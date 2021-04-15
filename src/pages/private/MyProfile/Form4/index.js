import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import api from '../../../../services/api';

import { useAuth } from '../../../../hooks/auth';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const { user, token, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();

        formData.append("address_mail", data.address_mail);
        formData.append("received_informations", data.received_informations);

        setLoading(true);

        api.put(`users/${user.id}`, formData).then(({ data: user_updated }) => {
          setAuth({ token, user: user_updated });

          localStorage.setItem('@sigfapeap:user', JSON.stringify(user_updated));
          localStorage.setItem('@sigfapeap:token', token);

          setLoading(false);

          store.addNotification({
            message: `Perfil atualizado com sucesso!`,
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

          submit();
        }).finally(() => {});
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [submit, setAuth, token, user],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar correspondência' : 'Atualizar correspondência'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="address_mail" select={[{ id: "Residencial", name: "Residencial" }, { id: "Profissional", name: "Profissional" }]} required original title="Endereço preferencial para correspondência" />

            <Input formRef={formRef} name="received_informations" select={[{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }]} required original title="Deseja receber Informativo da Fundação?" />
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
