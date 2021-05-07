import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import { uuid } from 'uuidv4';
import { Form } from '../../../../../../components/Form';
import {
  money_mask,
} from '../../../../../../utils/validations';

import { useProject } from '../../../../../../hooks/project';

import { soma, getValue } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Bolsas({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [bolsa, setBolsa] = React.useState({
    id: uuid(),
    modalidade: '',
    ord: '',
    duracao: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    atuacao: '',
  });

  const [errors, setErrors] = React.useState({
    modalidade: '',
    ord: '',
    duracao: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    atuacao: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        modalidade: '',
        ord: '',
        duracao: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
        atuacao: '',
      };

      if (bolsa.modalidade == "") {
        temp.modalidade = 'Campo obrigatório';
      } else {
        temp.modalidade = '';
      }

      if (bolsa.ord == "") {
        temp.ord = 'Campo obrigatório';
      } else if (Number(bolsa.ord) <= 0) {
        temp.ord = 'Campo deve ser maior que 0';
      } else {
        temp.ord = '';
      }

      if (bolsa.duracao == "") {
        temp.duracao = 'Campo obrigatório';
      } else {
        temp.duracao = '';
      }

      if (bolsa.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (bolsa.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(bolsa.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(bolsa.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (bolsa.atuacao == "") {
        temp.atuacao = 'Campo obrigatório';
      } else {
        temp.atuacao = '';
      }

      if (temp.modalidade != "" || temp.ord != "" || temp.duracao != "" || temp.custo_unitario != "" || temp.mes != "" || temp.atuacao != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Bolsas') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.bolsas, bolsa]))) }) : item)));

      setOrcamentos({ ...orcamentos, bolsas: [...orcamentos.bolsas, bolsa] });

      setBolsa({
        id: uuid(),
        modalidade: '',
        ord: '',
        duracao: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
        atuacao: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (bolsa.custo_unitario.length > 0) {
      setBolsa({ ...bolsa, custo_total: money_mask(String((getValue(bolsa.custo_unitario) * bolsa.ord).toFixed(2))) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolsa.ord, bolsa.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Bolsas</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Modalidade</label>
              <input style={{ borderColor: errors.modalidade ? '#c53030' : '#999' }} value={bolsa.modalidade} type="text" onChange={(value) => setBolsa({ ...bolsa, modalidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.modalidade && errors.modalidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Ord</label>
              <input style={{ borderColor: errors.ord ? '#c53030' : '#999' }} value={bolsa.ord} type="number" onChange={(value) => setBolsa({ ...bolsa, ord: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.ord && errors.ord}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Duração</label>
              <input style={{ borderColor: errors.duracao ? '#c53030' : '#999' }} value={bolsa.duracao} type="text" onChange={(value) => setBolsa({ ...bolsa, duracao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.duracao && errors.duracao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={bolsa.custo_unitario}
                type="text"
                onChange={(value) => {
                  setBolsa({ ...bolsa, custo_unitario: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={bolsa.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={bolsa.mes} type="number" onChange={(value) => setBolsa({ ...bolsa, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Atuação</label>
              <textarea style={{ borderColor: errors.atuacao ? '#c53030' : '#999' }} value={bolsa.atuacao} type="text" onChange={(value) => setBolsa({ ...bolsa, atuacao: value.target.value })} rows="4" cols="50" />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.atuacao && errors.atuacao}
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

export default memo(Bolsas);
