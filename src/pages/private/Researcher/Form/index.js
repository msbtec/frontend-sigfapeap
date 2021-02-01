import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useResearcher } from '../../../../hooks/researcher';
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
  const { create, update } = useResearcher();
  const { offices } = useOffice();
  const { profiles } = useProfile();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          evaluator: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        update({ ...item, evaluator: data.evaluator == "SIM" });

        submit();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [update, item, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar avaliador' : 'Atualizar avaliador'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="evaluator" select={[{ id: "SIM", name: "SIM" }, { id: "NÃO", name: "NÃO" }]} required original title="Avaliador" />
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
