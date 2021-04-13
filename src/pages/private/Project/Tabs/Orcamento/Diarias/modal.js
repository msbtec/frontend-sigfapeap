import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';
import {
  moeda,
} from '../../../../../../utils/validations';

import { useProject } from '../../../../../../hooks/project';

import { StyledModal } from './styles';

function Diaria({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [diaria, setDiaria] = React.useState({
    id: uuid(),
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  const [errors, setErrors] = React.useState({
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
    justificativa: '',
  });

  function getValue(value) {
    let valor_liquido = 0;
    if (value) {
      const string = String(value).split('R$')[1].trim().replace(/[\D]+/g, '');
      if (string.length > 2) {
        const resultado = `${string.substr(0, string.length - 2)}.${string.substr(string.length - 2)}`;
        valor_liquido = resultado;
      } else if (string.length > 1) {
        const resultado = `${string.substr(0, string.length - 1)}.${string.substr(string.length - 1)}`;
        valor_liquido = resultado;
      } else {
        valor_liquido = string;
      }
    }

    return Number(valor_liquido);
  }

  function soma(array) {
    return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.custo_total), 0) : '0';
  }

  async function handleSubmit() {
    try {
      const temp = {
        localidade: '',
        quantidade: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
        justificativa: '',
      };

      if (diaria.localidade == "") {
        temp.localidade = 'Campo obrigatório';
      } else {
        temp.localidade = '';
      }

      if (diaria.quantidade == "") {
        temp.quantidade = 'Campo obrigatório';
      } else if (Number(diaria.quantidade) <= 0) {
        temp.quantidade = 'Campo deve ser maior que 0';
      } else {
        temp.quantidade = '';
      }

      if (diaria.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (diaria.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(diaria.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(diaria.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (diaria.justificativa == "") {
        temp.justificativa = 'Campo obrigatório';
      } else {
        temp.justificativa = '';
      }

      if (temp.localidade != "" || temp.quantidade != "" || temp.custo_unitario != "" || temp.mes != "" || temp.justificativa != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Diárias') ? ({ ...item, valor: moeda(String(soma([...orcamentos.diarias, diaria]))) }) : item)));

      setOrcamentos({ ...orcamentos, diarias: [...orcamentos.diarias, diaria] });

      setDiaria({
        id: uuid(),
        localidade: '',
        quantidade: 0,
        custo_unitario: '',
        custo_total: '',
        mes: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  function getValue(value) {
    let valor_liquido = 0;
    if (value) {
      const string = String(value).split('R$')[1].trim().replace(/[\D]+/g, '');
      if (string.length > 2) {
        const resultado = `${string.substr(0, string.length - 2)}.${string.substr(string.length - 2)}`;
        valor_liquido = resultado;
      } else if (string.length > 1) {
        const resultado = `${string.substr(0, string.length - 1)}.${string.substr(string.length - 1)}`;
        valor_liquido = resultado;
      } else {
        valor_liquido = string;
      }
    }

    return Number(valor_liquido);
  }

  useEffect(() => {
    if (diaria.custo_unitario.length > 0) {
      setDiaria({ ...diaria, custo_total: moeda(String(getValue(diaria.custo_unitario) * diaria.quantidade)) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaria.quantidade, diaria.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Diária</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Localidade</label>
              <input style={{ borderColor: errors.localidade ? '#c53030' : '#999' }} value={diaria.localidade} type="text" onChange={(value) => setDiaria({ ...diaria, localidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.localidade && errors.localidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Quantidade</label>
              <input style={{ borderColor: errors.quantidade ? '#c53030' : '#999' }} value={diaria.quantidade} type="number" onChange={(value) => setDiaria({ ...diaria, quantidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.quantidade && errors.quantidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={diaria.custo_unitario}
                type="text"
                onChange={(value) => {
                  setDiaria({ ...diaria, custo_unitario: moeda(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={diaria.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={diaria.mes} type="number" onChange={(value) => setDiaria({ ...diaria, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Justificativa</label>
              <textarea style={{ borderColor: errors.justificativa ? '#c53030' : '#999' }} value={diaria.justificativa} type="text" onChange={(value) => setDiaria({ ...diaria, justificativa: value.target.value })} rows="4" cols="50" />
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

export default memo(Diaria);
