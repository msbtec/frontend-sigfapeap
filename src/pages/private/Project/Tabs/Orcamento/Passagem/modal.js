import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import {
  money_mask,
} from '../../../../../../utils/validations';

import { soma, getValue } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Passagens({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const [passagem, setPassagem] = React.useState({
    id: uuid(),
    trecho: '',
    tipo: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    trecho: '',
    tipo: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    justificativa: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        trecho: '',
        tipo: '',
        quantidade: '',
        custo_unitario: '',
        custo_total: '',
        justificativa: '',
      };

      if (passagem.trecho == "") {
        temp.trecho = 'Campo obrigatório';
      } else {
        temp.trecho = '';
      }

      if (passagem.tipo == "") {
        temp.tipo = 'Campo obrigatório';
      } else {
        temp.tipo = '';
      }

      if (passagem.quantidade == "") {
        temp.quantidade = 'Campo obrigatório';
      } else if (Number(passagem.quantidade) <= 0) {
        temp.quantidade = 'Campo deve ser maior que 0';
      } else {
        temp.quantidade = '';
      }

      if (passagem.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (passagem.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.trecho != "" || temp.tipo != "" || temp.quantidade != "" || temp.custo_unitario != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Passagens') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.passagens, passagem]))) }) : item)));

      setOrcamentos({ ...orcamentos, passagens: [...orcamentos.passagens, passagem] });

      setPassagem({
        id: uuid(),
        trecho: '',
        tipo: '',
        custo_unitario: '',
        custo_total: '',
        justificativa: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (passagem.custo_unitario.length > 0) {
      setPassagem({ ...passagem, custo_total: money_mask(String((getValue(passagem.custo_unitario) * passagem.quantidade).toFixed(2))) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passagem.quantidade, passagem.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Passagens</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Trecho</label>
              <input style={{ borderColor: errors.trecho ? '#c53030' : '#999' }} value={passagem.trecho} type="text" onChange={(value) => setPassagem({ ...passagem, trecho: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.trecho && errors.trecho}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Tipo</label>
              <input style={{ borderColor: errors.tipo ? '#c53030' : '#999' }} value={passagem.tipo} type="text" onChange={(value) => setPassagem({ ...passagem, tipo: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.tipo && errors.tipo}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Quantidade</label>
              <input style={{ borderColor: errors.quantidade ? '#c53030' : '#999' }} value={passagem.quantidade} type="number" onChange={(value) => setPassagem({ ...passagem, quantidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.quantidade && errors.quantidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={passagem.custo_unitario}
                type="text"
                onChange={(value) => {
                  setPassagem({ ...passagem, custo_unitario: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={passagem.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={passagem.justificativa} type="text" onChange={(value) => setPassagem({ ...passagem, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Passagens);
