import React from 'react';

import Axios from 'axios';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const Form2 = ({ formRef }) => {
  function handleCEP(cep) {
    if (cep.length === 9) {
      Axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          const {
            logradouro, bairro, uf, cidade, pais,
          } = response.data;
          formRef.current.setFieldValue('street', logradouro);
          formRef.current.setFieldValue('neighborhood', bairro);
          formRef.current.setFieldValue('country', pais);
          formRef.current.setFieldValue('state', uf);
          formRef.current.setFieldValue('municipality', cidade);
        })
        .catch(() => {});
    }
  }

  return (
    <Form>
      <Input formRef={formRef} name="zipcode" handleCEP={handleCEP} maxLength={9} required original title="CEP" />

      <Input formRef={formRef} name="street" disabled required original title="Logradouro" />

      <Input formRef={formRef} name="number_street" type="number" required original title="Número" />

      <Input formRef={formRef} name="complete_street" original title="Complemento" />

      <Input formRef={formRef} name="neighborhood" disabled required original title="Bairro" />

      <Input formRef={formRef} name="country" select={["Brasil", "outro"]} required original title="País" />

      <Input formRef={formRef} name="state" select={["Amapá", "Pará"]} required original title="Estado" />

      <Input formRef={formRef} name="municipality" select={["Macapá", "Oiapoque"]} required original title="Município" />

      <Input formRef={formRef} name="phone" maxLength={15} original title="Telefone" />

      <Input formRef={formRef} name="phone_cell" maxLength={15} original title="Celular" />
    </Form>
  );
};

export default Form2;
