import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';

import { Form as Unform } from '@unform/web';
import * as Yup from 'yup';
import { useResearcher } from '../../../hooks/researcher';
import { useAuth } from '../../../hooks/auth';
import getValidationErrors from '../../../utils/getValidationErrors';

import {
  Container, Content, Footer, DotsContainer, Dots,
} from './styles';

import Form1 from './Forms/Form1';
import Form2 from './Forms/Form2';
import Form3 from './Forms/Form3';
import Form4 from './Forms/Form4';
import Form5 from './Forms/Form5';
import Form6 from './Forms/Form6';
import Form7 from './Forms/Form7';

const Recaptcha = require('react-recaptcha');

const SignUp = () => {
  const { create } = useResearcher();
  const { signIn } = useAuth();

  const formRef = useRef(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  const [institutions, setInstitutions] = useState([]);
  const [knowledgesArea, setKnowledgesArea] = useState({
    one: '',
    two: '',
    three: '',
  });

  useEffect(() => {
    document.title = 'SIGFAPEAP - Cadastro';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (step === 1) {
          let schema;
          if (data.type_personal == 'Pesquisador') {
            schema = Yup.object().shape({
              type_personal: Yup.string().required('Campo obrigatório'),
              name: Yup.string().required('Campo obrigatório'),
              rg: Yup.string().required('Campo obrigatório'),
              orger_emitter: Yup.string().required('Campo obrigatório'),
              uf: Yup.string().required('Campo obrigatório'),
              date_emitter: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              birthday: Yup.string().required('Campo obrigatório'),
              mother_name: Yup.string().required('Campo obrigatório'),
              curriculum: Yup.string().required('Campo obrigatório'),
              school: Yup.string().required('Campo obrigatório'),
            });
          } else {
            schema = Yup.object().shape({
              type_personal: Yup.string().required('Campo obrigatório'),
              name: Yup.string().required('Campo obrigatório'),
              rg: Yup.string().required('Campo obrigatório'),
              orger_emitter: Yup.string().required('Campo obrigatório'),
              uf: Yup.string().required('Campo obrigatório'),
              date_emitter: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              perfil: Yup.string().required('Campo obrigatório'),
              birthday: Yup.string().required('Campo obrigatório'),
              mother_name: Yup.string().required('Campo obrigatório'),
              curriculum: Yup.string().required('Campo obrigatório'),
              school: Yup.string().required('Campo obrigatório'),
              rg_foreign: Yup.string().required('Campo obrigatório'),
            });
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          if (!selectedFile) {
            setErrorFile('Campo obrigatório');
          } else {
            setForm({ ...data, knowledgesArea, avatar: selectedFile });
            setStep(2);
            setErrorFile('');
          }
        } else if (step === 2) {
          const schema = Yup.object().shape({
            zipcode: Yup.string().required('Campo obrigatório'),
            street: Yup.string().required('Campo obrigatório'),
            number_street: Yup.string().required('Campo obrigatório'),
            neighborhood: Yup.string().required('Campo obrigatório'),
            country: Yup.string().required('Campo obrigatório'),
            state: Yup.string().required('Campo obrigatório'),
            municipality: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, ...data });

          setStep(3);
        } else if (step === 3) {
          let schema;

          if (data.connection == 'Sim' && data.generate_connection == 'Sim') {
            schema = Yup.object().shape({
              institution: Yup.string().required('Campo obrigatório'),
              service_time: Yup.string().required('Campo obrigatório'),
              office: Yup.string().required('Campo obrigatório'),
              office_time: Yup.string().required('Campo obrigatório'),
            });
          } else if (data.connection == 'Sim' && data.generate_connection == 'Não') {
            schema = Yup.object().shape({
              institution: Yup.string().required('Campo obrigatório'),
            });
          } else {
            schema = Yup.object().shape({
              connection: Yup.string().required('Campo obrigatório'),
            });
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, ...data });

          setStep(4);
        } else if (step === 4) {
          setForm({ ...form, ...data });
          setStep(6);
        } else if (step === 5) {
          setForm({ ...form, ...data });
          setStep(6);
        } else if (step === 6) {
          setForm({ ...form, ...data });
          setStep(7);
        } else if (step === 7) {
          const schema = Yup.object().shape({
            cpf: Yup.string().required('Campo obrigatório'),
            password: Yup.string()
              .min(6, 'Mínimo de 6 caracteres')
              .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          create({
            ...form, ...data, avatar: window.URL.createObjectURL(form.avatar), evaluator: false,
          });

          signIn(data);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [signIn, create, step, form, selectedFile, knowledgesArea],
  );

  function title(step) {
    if (step == 1) {
      return 'Dados pessoais';
    } if (step == 2) {
      return 'Endereço Residencial';
    } if (step == 3) {
      return 'Vínculo Institucional';
    } if (step == 4) {
      return 'Endereço Profissional';
    } if (step == 5) {
      return 'Vincular Outras Instituições';
    } if (step == 6) {
      return 'Correspondência';
    }
    return 'Acesso SIGFAPEAP';
  }

  return (
    <Container>
      <Content>
        <Unform
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            address_mail: "Residencial",
            avatar: "https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/user/12.jpg",
            birthday: "1998-10-18",
            complete_street: "casa",
            confirmation_password: "password",
            connection: "Sim",
            connection_institution: "CLT",
            country: "Brasil",
            cpf: "094.384.098-50",
            curriculum: "https://github.com/typicode/json-server",
            date_emitter: "2008-10-21",
            email: "math.cs.ceil@gmail.com",
            father_name: "Rosilvado Ribeiro da Silva Filho",
            generate_connection: "Sim",
            institution: "MSB",
            knowledgesArea: {
              one: {
                main: "Ciências sociais",
                sub1: "Ciências exatas",
                sub2: "Ciências sociais",
                sub3: "Ciências exatas",
              },
              two: {
                main: "Ciências sociais",
                sub1: "Ciências exatas",
                sub2: "Ciências sociais",
                sub3: "Ciências exatas",
              },
              three: {
                main: "Ciências sociais",
                sub1: "Ciências exatas",
                sub2: "Ciências sociais",
                sub3: "Ciências exatas",
              },
            },
            mother_name: "Neusa Reis da Costa",
            municipality: "Macapá",
            name: "Matheus Costa Silva",
            neighborhood: "Araxá",
            number_street: "89979",
            office: "Dev",
            office_time: "1 ano",
            orger_emitter: "POLITEC",
            password: "password",
            phone: "(96) 99999-9999",
            phone_cell: "(96) 88888-8888",
            professional_complete_street: "casa",
            professional_country: "Brasil",
            professional_fax: "",
            professional_municipality: "Macapá",
            professional_neighborhood: "Araxá",
            professional_number_street: "48035",
            professional_phone: "",
            professional_phone_cell: "",
            professional_state: "AP",
            professional_street: "Travessa Oitava da Setentrional",
            professional_zipcode: "68903-777",
            race: "Amarela",
            received_informations: "Sim",
            regime_work: "Tempo integral",
            rg: "488009",
            school: "Ensino Superior",
            service_time: "1 ano",
            sex: "Masculino",
            state: "AP",
            street: "Travessa Oitava da Setentrional",
            type_personal: "Pesquisador",
            uf: "AP",
            zipcode: "68903-777",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 40 }}>
            <label style={{ fontSize: 21, fontWeight: 'bold', color: '#626262' }}>Cadastro de Pesquisador</label>
            <label style={{ fontSize: 14, color: '#626262' }}>
              Preencha corretamente os campos abaixo para fazer parte da
              comunidade de pesquisadores da FAPEAP.
            </label>

            <label style={{
              marginTop: 30, fontSize: 21, fontWeight: 'bold', color: '#626262',
            }}
            >
              {title(step)}
            </label>
          </div>

          {step === 1 && (
          <Form1
            formRef={formRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            errorFile={errorFile}
            knowledgesArea={knowledgesArea}
            setKnowledgesArea={setKnowledgesArea}
          />
          )}
          {step === 2 && <Form2 formRef={formRef} />}
          {step === 3 && <Form3 formRef={formRef} />}
          {step === 4 && <Form4 formRef={formRef} />}
          {/* {step === 5 && (
          <Form5
            institutions={institutions}
            setInstitutions={setInstitutions}
            formRef={formRef}
          />
          )} */}
          {step === 6 && <Form6 formRef={formRef} />}
          {step === 7 && <Form7 formRef={formRef} />}

          <Footer>
            <DotsContainer>
              <Dots isFilled={step === 1} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 2} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 3} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 4} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 5} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 6} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 7} />
            </DotsContainer>
          </Footer>

          {step === 7 && (
          <div style={{ marginBottom: 20 }}>
            <Recaptcha
              sitekey="fmewkrifgjnoierjngoruetg"
              render="explicit"
            />
          </div>
          )}

          <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
            <button type="submit" className="submit">
              Continuar
            </button>
          </div>

        </Unform>
      </Content>
    </Container>
  );
};

export default SignUp;
