import React from 'react';

import Axios from 'axios';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const Form4 = ({ formRef }) => {
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
      <Input formRef={formRef} name="professional_zipcode" handleCEP={handleCEP} maxLength={9} original title="CEP" />

      <Input formRef={formRef} name="professional_street" disabled original title="Logradouro" />

      <Input formRef={formRef} name="professional_number_street" type="number" original title="Número" />

      <Input formRef={formRef} name="professional_complete_street" original title="Complemento" />

      <Input formRef={formRef} name="professional_neighborhood" disabled original title="Bairro" />

      <Input formRef={formRef} name="professional_country" select={["Brasil", "outro"]} original title="País" />

      <Input formRef={formRef} name="professional_state" select={["Amapá", "Pará"]} original title="Estado" />

      <Input formRef={formRef} name="professional_municipality" select={["Macapá", "Oiapoque"]} original title="Município" />

      <Input formRef={formRef} name="professional_phone" maxLength={15} original title="Telefone" />

      <Input formRef={formRef} name="professional_phone_cell" maxLength={15} original title="Celular" />

      <Input formRef={formRef} name="professional_fax" original title="Fax" />

    </Form>
  );
};

export default Form4;
