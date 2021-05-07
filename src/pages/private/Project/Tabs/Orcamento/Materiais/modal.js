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

function Hospedagens({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [material, setMaterial] = React.useState({
    id: uuid(),
    especificacao: '',
    quantidade: '',
    unidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    especificacao: '',
    quantidade: '',
    unidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        especificacao: '',
        quantidade: '',
        unidade: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      };

      if (material.especificacao == "") {
        temp.especificacao = 'Campo obrigatório';
      } else {
        temp.especificacao = '';
      }

      if (material.quantidade == "") {
        temp.quantidade = 'Campo obrigatório';
      } else if (Number(material.quantidade) <= 0) {
        temp.quantidade = 'Campo deve ser maior que 0';
      } else {
        temp.quantidade = '';
      }

      if (material.unidade == "") {
        temp.unidade = 'Campo obrigatório';
      } else {
        temp.unidade = '';
      }

      if (material.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (material.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(material.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(material.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (material.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.especificacao != "" || temp.quantidade != "" || temp.unidade != "" || temp.custo_unitario != "" || temp.mes != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Material de Consumo') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.materiais_consumo, material]))) }) : item)));

      setOrcamentos({ ...orcamentos, materiais_consumo: [...orcamentos.materiais_consumo, material] });

      setMaterial({
        id: uuid(),
        especificacao: '',
        quantidade: '',
        unidade: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (material.custo_unitario.length > 0) {
      setMaterial({ ...material, custo_total: money_mask(String((getValue(material.custo_unitario) * material.quantidade).toFixed(2))) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.quantidade, material.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Materiais de Consumo</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Especificação</label>
              <input style={{ borderColor: errors.especificacao ? '#c53030' : '#999' }} value={material.especificacao} type="text" onChange={(value) => setMaterial({ ...material, especificacao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.especificacao && errors.especificacao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Quantidade</label>
              <input style={{ borderColor: errors.quantidade ? '#c53030' : '#999' }} value={material.quantidade} type="number" onChange={(value) => setMaterial({ ...material, quantidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.quantidade && errors.quantidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Unidade</label>
              <input style={{ borderColor: errors.unidade ? '#c53030' : '#999' }} value={material.unidade} type="text" onChange={(value) => setMaterial({ ...material, unidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.unidade && errors.unidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={material.custo_unitario}
                type="text"
                onChange={(value) => {
                  setMaterial({ ...material, custo_unitario: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={material.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={material.mes} type="number" onChange={(value) => setMaterial({ ...material, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={material.justificativa} type="text" onChange={(value) => setMaterial({ ...material, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Hospedagens);
