import React from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const SignUp = ({ formRef }) => (
  <Form>
    <Input formRef={formRef} name="zipcode" required original title="CEP" />

    <Input formRef={formRef} name="street" required original title="Logradouro" />

    <Input formRef={formRef} name="number_street" required original title="Número" />

    <Input formRef={formRef} name="complete_street" required original title="Complemento" />

    <Input formRef={formRef} name="neighborhood" required original title="Bairro" />

    <Input formRef={formRef} name="country" select={["Brasil", "outro"]} required original title="País" />

    <Input formRef={formRef} name="state" select={["Amapá", "Pará"]} required original title="Estado" />

    <Input formRef={formRef} name="municipality" select={["Macapá", "Oiapoque"]} required original title="Município" />

    <Input formRef={formRef} name="phone" required original title="Telefone" />

    <Input formRef={formRef} name="phone_cell" required original title="Celular" />
  </Form>
);

export default SignUp;
