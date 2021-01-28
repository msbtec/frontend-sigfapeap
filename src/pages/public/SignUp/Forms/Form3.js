import React, { useState } from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const Form3 = ({ formRef }) => {
  const [isConnection, setIsConnection] = useState(true);
  const [isGenerate_connection, setIsGenerate_connection] = useState(true);

  return (
    <Form>
      <Input formRef={formRef} name="connection" setIsConnection={setIsConnection} select={[{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }]} required original title="Tem Vínculo Institucional?" />

      {isConnection && (
      <>
        <Input formRef={formRef} name="institution" required original title="Instituição/Empresa" />

        <Input formRef={formRef} name="connection_institution" select={[{ id: "CLT", name: "CLT" }, { id: "Cooperativo", name: "Cooperativo" }, { id: "Bolsista", name: "Bolsista" }, { id: "Estagiário", name: "Estagiário" }]} required original title="Vínculo Institucional" />

        <Input formRef={formRef} name="generate_connection" setIsGenerate_connection={setIsGenerate_connection} select={[{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }]} required original title="Gera Vínculo Empregatício?" />

        <Input formRef={formRef} name="service_time" required={isGenerate_connection} original title="Tempo de Serviço" />

        <Input formRef={formRef} name="regime_work" select={[{ id: "Dedicação exclusiva", name: "Dedicação exclusiva" }, { id: "Tempo integral", name: "Tempo integral" }, { id: "Outro", name: "Outro" }]} required={isGenerate_connection} original title="Regime de Trabalho" />

        <Input formRef={formRef} name="office_name" required={isGenerate_connection} original title="Função/Cargo Atual" />

        <Input formRef={formRef} name="office_time" required={isGenerate_connection} original title="Tempo na Função" />
      </>
      )}
    </Form>
  );
};

export default Form3;
