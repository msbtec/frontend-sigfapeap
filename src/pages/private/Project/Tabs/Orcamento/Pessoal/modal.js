import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import {
  moeda,
} from '../../../../../../utils/validations';

import { useProject } from '../../../../../../hooks/project';

import { soma, getValue } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Pessoais({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [pessoal, setPessoal] = React.useState({
    id: uuid(),
    funcao: '',
    formacao: '',
    perfil: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    funcao: '',
    formacao: '',
    perfil: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        funcao: '',
        formacao: '',
        perfil: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      };

      if (pessoal.funcao == "") {
        temp.funcao = 'Campo obrigatório';
      } else {
        temp.funcao = '';
      }

      if (pessoal.formacao == "") {
        temp.formacao = 'Campo obrigatório';
      } else {
        temp.formacao = '';
      }

      if (pessoal.perfil == "") {
        temp.perfil = 'Campo obrigatório';
      } else {
        temp.perfil = '';
      }

      if (pessoal.custo_total == "") {
        temp.custo_total = 'Campo obrigatório';
      } else {
        temp.custo_total = '';
      }

      if (pessoal.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(pessoal.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(pessoal.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (pessoal.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.funcao != "" || temp.formacao != "" || temp.perfil != "" || temp.custo_total != "" || temp.mes != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Pessoal') ? ({ ...item, valor: moeda(String(soma([...orcamentos.pessoal, pessoal]))) }) : item)));

      setOrcamentos({ ...orcamentos, pessoal: [...orcamentos.pessoal, pessoal] });

      setPessoal({
        id: uuid(),
        funcao: '',
        formacao: '',
        perfil: '',
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
        <h5 className="modal-title" id="exampleModalLabel">Pessoal</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Função</label>
              <input style={{ borderColor: errors.funcao ? '#c53030' : '#999' }} value={pessoal.funcao} type="text" onChange={(value) => setPessoal({ ...pessoal, funcao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.funcao && errors.funcao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Formação</label>
              <input style={{ borderColor: errors.formacao ? '#c53030' : '#999' }} value={pessoal.formacao} type="text" onChange={(value) => setPessoal({ ...pessoal, formacao: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.formacao && errors.formacao}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Perfil</label>
              <input style={{ borderColor: errors.perfil ? '#c53030' : '#999' }} value={pessoal.perfil} type="text" onChange={(value) => setPessoal({ ...pessoal, perfil: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.perfil && errors.perfil}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input
                style={{ borderColor: errors.custo_total ? '#c53030' : '#999' }}
                value={pessoal.custo_total}
                type="text"
                onChange={(value) => {
                  setPessoal({ ...pessoal, custo_total: moeda(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_total && errors.custo_total}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={pessoal.mes} type="number" onChange={(value) => setPessoal({ ...pessoal, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={pessoal.justificativa} type="text" onChange={(value) => setPessoal({ ...pessoal, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Pessoais);
