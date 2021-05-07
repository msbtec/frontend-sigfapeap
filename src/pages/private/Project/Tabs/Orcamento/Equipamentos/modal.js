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

function Equipametos({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [equipamento, setEquipamento] = React.useState({
    id: uuid(),
    especificacao: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    especificacao: '',
    quantidade: '',
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
        custo_unitario: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      };

      if (equipamento.especificacao == "") {
        temp.especificacao = 'Campo obrigatório';
      } else {
        temp.especificacao = '';
      }

      if (equipamento.quantidade == "") {
        temp.quantidade = 'Campo obrigatório';
      } else if (Number(equipamento.quantidade) <= 0) {
        temp.quantidade = 'Campo deve ser maior que 0';
      } else {
        temp.quantidade = '';
      }

      if (equipamento.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (equipamento.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(equipamento.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(equipamento.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (equipamento.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.especificacao != "" || temp.quantidade != "" || temp.custo_unitario != "" || temp.mes != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Equipamentos e Material Permanente') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.materiais_permanentes_equipamentos, equipamento]))) }) : item)));

      setOrcamentos({ ...orcamentos, materiais_permanentes_equipamentos: [...orcamentos.materiais_permanentes_equipamentos, equipamento] });

      setEquipamento({
        id: uuid(),
        especificacao: '',
        quantidade: '',
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
    if (equipamento.custo_unitario.length > 0) {
      setEquipamento({ ...equipamento, custo_total: money_mask(String((getValue(equipamento.custo_unitario) * equipamento.quantidade).toFixed(2))) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipamento.quantidade, equipamento.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Materiais Permanentes e Equipamentos</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Especificação</label>
              <input style={{ borderColor: errors.especificacao ? '#c53030' : '#999' }} value={equipamento.especificacao} type="text" onChange={(value) => setEquipamento({ ...equipamento, especificacao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.especificacao && errors.especificacao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Quantidade</label>
              <input style={{ borderColor: errors.quantidade ? '#c53030' : '#999' }} value={equipamento.quantidade} type="number" onChange={(value) => setEquipamento({ ...equipamento, quantidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.quantidade && errors.quantidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={equipamento.custo_unitario}
                type="text"
                onChange={(value) => {
                  setEquipamento({ ...equipamento, custo_unitario: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={equipamento.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={equipamento.mes} type="number" onChange={(value) => setEquipamento({ ...equipamento, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={equipamento.justificativa} type="text" onChange={(value) => setEquipamento({ ...equipamento, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Equipametos);
