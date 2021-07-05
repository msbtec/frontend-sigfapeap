import React from 'react';

import { Form } from '../../../../../components/Form';
import Input from '../../../../../components/Input';

import { useAuth } from '../../../../../hooks/auth';

// eslint-disable-next-line import/named
import { useProject } from '../../../../../hooks/project';

export default function Header({
  formRef, protocolo, edital,
}) {
  const { user } = useAuth();

  const { configuration, project } = useProject();

  return (
    <Form>
      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Chamada Pública</label>
        <input value={edital.title} type="text" disabled />
      </div>

      {configuration.plano_trabalho.fields.titulo_projeto.checked
      && <Input formRef={formRef} name="title" title="Título" original />}

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Protocolo</label>
        <input value={protocolo} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">Coordenador</label>
        <input value={user.profile.name != 'Pesquisador' ? project.coordenador.name : user.name} type="text" disabled />
      </div>

      <div style={{ marginBottom: 10 }} className="input-block">
        <label className="required">E-mail</label>
        <input value={user.profile.name != 'Pesquisador' ? project.coordenador.email : user.email} type="text" disabled />
      </div>

      {/* {configuration.plano_trabalho.fields.faixa_valor.checked
      && <Input formRef={formRef} name="faixa_value" title="Faixa de valor" original />} */}

      {configuration.plano_trabalho.fields.duracao.checked
      && (
      <Input
        formRef={formRef}
        name="faixa_value"
        title="Faixa de valor"
        select={configuration.plano_trabalho.fields.faixa_valor.value.map((item) => ({ id: `${item.min} a ${item.max}`, name: `${item.min} a ${item.max}` }))}
        original
      />
      )}

      {configuration.plano_trabalho.fields.tema_interesse.checked
      && <Input formRef={formRef} name="theme" title="Tema de interesse" original />}

      {configuration.plano_trabalho.fields.instituicao.checked
      && <Input formRef={formRef} name="institution" title="Instituição executora" original />}

      {configuration.plano_trabalho.fields.inicio_previsto.checked
      && <Input formRef={formRef} name="beggin_prevision" title="Início previsto" type="date" original />}

      {configuration.plano_trabalho.fields.duracao.checked
      && <Input formRef={formRef} name="duration" title="Duração" select={[{ id: "6", name: "6 Meses" }, { id: "12", name: "12 Meses" }, { id: "18", name: "18 Meses" }, { id: "24", name: "24 Meses" }]} original />}

      {/* {configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.checked
      && <Input formRef={formRef} name="money_foreign" title="Cotação da Moeda Estrangeira" original />} */}

      {configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.checked
            && (
            <div style={{ marginBottom: 10 }} className="input-block">
              <label className="required">Cotação da Moeda Estrangeira</label>
              <input value={configuration.plano_trabalho.fields.cotacao_moeda_estrangeira.value} type="text" disabled />
            </div>
            )}
    </Form>
  );
}
