import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import {
  moeda,
} from '../../../../../../utils/validations';

import { useProject } from '../../../../../../hooks/project';

import { soma } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Servicos({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [servico, setServico] = React.useState({
    id: uuid(),
    especificacao: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    especificacao: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        especificacao: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      };

      if (servico.especificacao == "") {
        temp.especificacao = 'Campo obrigatório';
      } else {
        temp.especificacao = '';
      }

      if (servico.custo_total == "") {
        temp.custo_total = 'Campo obrigatório';
      } else {
        temp.custo_total = '';
      }

      if (servico.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(servico.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(servico.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (servico.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.especificacao != "" || temp.custo_total != "" || temp.mes != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Outros Serviços de Terceiros') ? ({ ...item, valor: moeda(String(soma([...orcamentos.servicos_terceiros, servico]))) }) : item)));

      setOrcamentos({ ...orcamentos, servicos_terceiros: [...orcamentos.servicos_terceiros, servico] });

      setServico({
        id: uuid(),
        especificacao: '',
        custo_total: '',
        mes: '',
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
        <h5 className="modal-title" id="exampleModalLabel">Serviços de Terceiros</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Especificação</label>
              <input style={{ borderColor: errors.especificacao ? '#c53030' : '#999' }} value={servico.especificacao} type="text" onChange={(value) => setServico({ ...servico, especificacao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.especificacao && errors.especificacao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input
                style={{ borderColor: errors.custo_total ? '#c53030' : '#999' }}
                value={servico.custo_total}
                type="text"
                onChange={(value) => {
                  setServico({ ...servico, custo_total: moeda(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_total && errors.custo_total}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={servico.mes} type="number" onChange={(value) => setServico({ ...servico, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={servico.justificativa} type="text" onChange={(value) => setServico({ ...servico, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Servicos);
