import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import Axios from 'axios';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import { useAuth } from '../../../../hooks/auth';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';
import api from '../../../../services/api';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const { user, token, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  function handleCEP(cep) {
    if (cep.length === 9) {
      Axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          const {
            logradouro, bairro, uf, localidade, pais,
          } = response.data;

          console.log(response.data);

          formRef.current.setFieldValue('street', logradouro);
          formRef.current.setFieldValue('neighborhood', bairro);
          formRef.current.setFieldValue('country', pais);
          formRef.current.setFieldValue('state', uf);
          formRef.current.setFieldValue('municipality', localidade);
        })
        .catch(() => {});
    }
  }

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();

        const schema = Yup.object().shape({
          zipcode: Yup.string().required('Campo obrigatório'),
          street: Yup.string().required('Campo obrigatório'),
          number_street: Yup.string().required('Campo obrigatório'),
          neighborhood: Yup.string().required('Campo obrigatório'),
          country: Yup.string().required('Campo obrigatório'),
          state: Yup.string().required('Campo obrigatório'),
          municipality: Yup.string().required('Campo obrigatório'),
          phone: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        formData.append("zipcode", data.zipcode);
        formData.append("street", data.street);
        formData.append("number_street", data.number_street);
        formData.append("neighborhood", data.neighborhood);
        formData.append("country", data.country);
        formData.append("state", data.state);
        formData.append("municipality", data.municipality);
        formData.append("phone", data.phone);

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
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar endereço residencial' : 'Atualizar endereço residencial'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="zipcode" handleCEP={handleCEP} maxLength={9} required original title="CEP" />

            <Input formRef={formRef} name="street" disabled required original title="Logradouro" />

            <Input formRef={formRef} name="number_street" type="number" required original title="Número" />

            <Input formRef={formRef} name="complete_street" original title="Complemento" />

            <Input formRef={formRef} name="neighborhood" disabled required original title="Bairro" />

            <Input formRef={formRef} name="country" select={[{ id: "Brasil", name: "Brasil" }]} required original title="País" />

            <Input formRef={formRef} name="state" disabled required original title="Estado" />

            <Input formRef={formRef} name="municipality" disabled required original title="Município" />

            <Input formRef={formRef} maxLength={15} required name="phone" original title="Telefone/WhatsApp" />
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
