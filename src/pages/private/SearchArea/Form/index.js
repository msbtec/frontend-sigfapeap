import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useSearch } from '../../../../hooks/search';
import { useConnectSearch } from '../../../../hooks/connectSearch';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { create, update } = useSearch();
  const { connectSearches } = useConnectSearch();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (String(data.connection_area) == "undefined") {
          data = { ...data, connection_area: item.connection_area };
        } else if (String(data.connection_area) == "null") {
          data = { ...data, connection_area: "" };
        }

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          connection_area: Yup.string().required('Pelo menos um acesso deve ser submetido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const final = { ...data, connections_area: data.connection_area.map((connection) => String(connection.value)).join(", ") };

        delete final.connection_area;

        if (item) {
          update({ id: item.id, ...final });
        } else {
          create(final);
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
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar área de pesquisa' : 'Atualizar área de pesquisa'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>
        <Form>
          <div className="modal-body" style={{ height: 400 }} ref={reference}>
            <Input formRef={formRef} name="name" required original title="Nome da área de pesquisa" />

            <Input formRef={formRef} name="connection_area" required multi access={connectSearches.map((search) => ({ value: search.id, label: search.name }))} title="Linhas de pesquisa vinculadas" />
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
