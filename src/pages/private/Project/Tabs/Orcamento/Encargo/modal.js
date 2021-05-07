import React, { memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import { uuid } from 'uuidv4';
import { Form } from '../../../../../../components/Form';
import {
  money_mask,
} from '../../../../../../utils/validations';

import { soma } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Encargos({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const [encargo, setEncargo] = React.useState({
    id: uuid(),
    especificacao: '',
    custo_total: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    especificacao: '',
    custo_total: '',
    justificativa: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        especificacao: '',
        custo_total: '',
        justificativa: '',
      };

      if (encargo.especificacao == "") {
        temp.especificacao = 'Campo obrigatório';
      } else {
        temp.especificacao = '';
      }

      if (encargo.custo_total == "") {
        temp.custo_total = 'Campo obrigatório';
      } else {
        temp.custo_total = '';
      }

      if (encargo.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.especificacao != "" || temp.custo_total != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Encargos') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.encargos, encargo]))) }) : item)));

      setOrcamentos({ ...orcamentos, encargos: [...orcamentos.encargos, encargo] });

      setEncargo({
        id: uuid(),
        especificacao: '',
        custo_total: '',
        justificativa: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Encargos</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Especificação</label>
              <input style={{ borderColor: errors.especificacao ? '#c53030' : '#999' }} value={encargo.especificacao} type="text" onChange={(value) => setEncargo({ ...encargo, especificacao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.especificacao && errors.especificacao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input
                style={{ borderColor: errors.custo_total ? '#c53030' : '#999' }}
                value={encargo.custo_total}
                type="text"
                onChange={(value) => {
                  setEncargo({ ...encargo, custo_total: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_total && errors.custo_total}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={encargo.justificativa} type="text" onChange={(value) => setEncargo({ ...encargo, justificativa: value.target.value })} rows="4" cols="50" />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.justificativa && errors.justificativa}
              </sup>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="modal-footer">
          <button style={{ margin: 20 }} type="button" onClick={toggleModal}>
            <FiX />
            {' '}
            Fechar
          </button>
          <button
            onClick={handleSubmit}
            style={{ margin: 20 }}
            type="button"
          >
            <FiCheckCircle />
            {' '}
            Salvar
          </button>
        </div>
      </Form>
    </StyledModal>
  );
}

export default memo(Encargos);
