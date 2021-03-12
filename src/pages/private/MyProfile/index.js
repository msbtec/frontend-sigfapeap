import React, {
  useEffect, useState, useRef, useCallback, Suspense, lazy,
} from 'react';

import { ModalProvider } from 'styled-react-modal';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { Link } from './styles';
import { Button } from '../../../components/Button';

import { Form } from '../../../components/Form';
import Input from '../../../components/Input';
import { Card } from '../../../components/Card';

import { useOffice } from '../../../hooks/office';
import { useAuth } from '../../../hooks/auth';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

let ModalForm1 = () => <></>;
let ModalForm2 = () => <></>;
let ModalForm3 = () => <></>;
let ModalForm4 = () => <></>;

export default function Cargos() {
  const formRef = useRef(null);
  const reference = useRef(null);

  const [loading, setLoading] = useState(false);

  const { user, token, setAuth } = useAuth();
  const { offices } = useOffice();

  const [OpenForm1, setOpenForm1] = useState(false);
  const [OpenForm2, setOpenForm2] = useState(false);
  const [OpenForm3, setOpenForm3] = useState(false);
  const [OpenForm4, setOpenForm4] = useState(false);

  const [isForeign, setIsForeign] = React.useState(false);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Perfil';

    if (user.type_personal == 'Pesquisador estrangeiro') {
      setIsForeign(true);
    }
  }, [user]);

  async function toggleModalForm1() {
    ModalForm1 = await lazy(() => import("./Form1"));

    setOpenForm1(!OpenForm1);
  }

  async function toggleModalForm2() {
    ModalForm2 = await lazy(() => import("./Form2"));

    setOpenForm2(!OpenForm2);
  }

  async function toggleModalForm3() {
    ModalForm3 = await lazy(() => import("./Form3"));

    setOpenForm3(!OpenForm3);
  }

  async function toggleModalForm4() {
    ModalForm4 = await lazy(() => import("./Form4"));

    setOpenForm4(!OpenForm4);
  }

  function submitModalForm1() {
    setOpenForm1(!OpenForm1);
  }

  function submitModalForm2() {
    setOpenForm2(!OpenForm2);
  }

  function submitModalForm3() {
    setOpenForm3(!OpenForm3);
  }

  function submitModalForm4() {
    setOpenForm4(!OpenForm4);
  }

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        let schema = {};
        const formData = new FormData();

        if (user.profile.name != 'Pesquisador') {
          if (data.password !== '') {
            schema = Yup.object().shape({
              name: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              phone: Yup.string().required('Campo obrigatório'),

              password: Yup.string()
                .min(6, 'Mínimo de 6 caracteres')
                .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
              confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
            });

            formData.append("name", String(data.name).toUpperCase());
            formData.append("email", data.email);
            formData.append("address", data.address);
            formData.append("phone", data.phone);
            formData.append("office_id", data.office_id);
            formData.append("password", data.password);
          } else {
            schema = Yup.object().shape({
              name: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              phone: Yup.string().required('Campo obrigatório'),
            });

            formData.append("name", String(data.name).toUpperCase());
            formData.append("email", data.email);
            formData.append("address", data.address);
            formData.append("phone", data.phone);
            formData.append("office_id", data.office_id);
          }
        } else {
          console.log('');
          if (data.password !== '') {
            if (isForeign) {
              schema = Yup.object().shape({
                name: Yup.string().required('Campo obrigatório'),
                email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
                birthday: Yup.string().required('Campo obrigatório'),
                mother_name: Yup.string().required('Campo obrigatório'),
                curriculum: Yup.string().required('Campo obrigatório'),
                school: Yup.string().required('Campo obrigatório'),
                rg_foreign: Yup.string().required('Campo obrigatório'),

                password: Yup.string()
                  .min(6, 'Mínimo de 6 caracteres')
                  .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
                confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
              });

              formData.append("name", String(data.name).toUpperCase());
              formData.append("rg_foreign", data.rg_foreign);
              formData.append("passport", data.passport || '');
              formData.append("email", data.email);
              formData.append("birthday", data.birthday);
              formData.append("mother_name", data.mother_name);
              formData.append("curriculum", data.curriculum);
              formData.append("school", data.school);
              formData.append("password", data.password);
            } else {
              schema = Yup.object().shape({
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

                password: Yup.string()
                  .min(6, 'Mínimo de 6 caracteres')
                  .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
                confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
              });

              formData.append("name", String(data.name).toUpperCase());
              formData.append("rg", data.rg);
              formData.append("orger_emitter", data.orger_emitter);
              formData.append("uf", data.uf);
              formData.append("date_emitter", data.date_emitter);
              formData.append("email", data.email);
              formData.append("birthday", data.birthday);
              formData.append("mother_name", data.mother_name);
              formData.append("curriculum", data.curriculum);
              formData.append("school", data.school);
              formData.append("password", data.password);
            }
          } else if (isForeign) {
            schema = Yup.object().shape({
              name: Yup.string().required('Campo obrigatório'),
              rg_foreign: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              birthday: Yup.string().required('Campo obrigatório'),
              mother_name: Yup.string().required('Campo obrigatório'),
              curriculum: Yup.string().required('Campo obrigatório'),
              school: Yup.string().required('Campo obrigatório'),
            });

            formData.append("name", String(data.name).toUpperCase());
            formData.append("rg_foreign", data.rg_foreign);
            formData.append("passport", data.passport || '');
            formData.append("email", data.email);
            formData.append("birthday", data.birthday);
            formData.append("mother_name", data.mother_name);
            formData.append("curriculum", data.curriculum);
            formData.append("school", data.school);
          } else {
            schema = Yup.object().shape({
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

            formData.append("name", String(data.name).toUpperCase());
            formData.append("rg", data.rg);
            formData.append("orger_emitter", data.orger_emitter);
            formData.append("uf", data.uf);
            formData.append("date_emitter", data.date_emitter);
            formData.append("email", data.email);
            formData.append("birthday", data.birthday);
            formData.append("mother_name", data.mother_name);
            formData.append("curriculum", data.curriculum);
            formData.append("school", data.school);
          }
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        api.put(`users/${user.id}`, formData).then(({ data: user_updated }) => {
          setAuth({ token, user: user_updated });

          localStorage.setItem('@sigfapeap:user', JSON.stringify(user_updated));
          localStorage.setItem('@sigfapeap:token', token);

          setLoading(false);

          store.addNotification({
            message: `Perfil atualizado com sucesso!`,
            type: 'success',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        }).finally(() => {});
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [setAuth, token, user, isForeign],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Perfil</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Unform initialData={user} ref={formRef} onSubmit={handleSubmit}>

              <Form>
                <div className="modal-body" style={{ marginBottom: 20 }} ref={reference}>
                  <Input formRef={formRef} name="name" required original title="Nome" />

                  {user.profile.name == 'Pesquisador'
                && !isForeign && (
                <>
                  <Input formRef={formRef} name="rg" required original title="RG" />

                  <Input formRef={formRef} name="orger_emitter" required original title="Orgão Emissor" />

                  <Input
                    formRef={formRef}
                    name="uf"
                    select={[
                      { id: "AC", name: "AC" },
                      { id: "AL", name: "AL" },
                      { id: "AP", name: "AP" },
                      { id: "AM", name: "AM" },
                      { id: "BA", name: "BA" },
                      { id: "CE", name: "CE" },
                      { id: "DF", name: "DF" },
                      { id: "ES", name: "ES" },
                      { id: "GO", name: "GO" },
                      { id: "MA", name: "MA" },
                      { id: "MT", name: "MT" },
                      { id: "MS", name: "MS" },
                      { id: "MG", name: "MG" },
                      { id: "PA", name: "PA" },
                      { id: "PB", name: "PB" },
                      { id: "PR", name: "PR" },
                      { id: "PE", name: "PE" },
                      { id: "PI", name: "PI" },
                      { id: "RJ", name: "RJ" },
                      { id: "RN", name: "RN" },
                      { id: "RS", name: "RS" },
                      { id: "RO", name: "RO" },
                      { id: "RR", name: "RR" },
                      { id: "SC", name: "SC" },
                      { id: "SP", name: "SP" },
                      { id: "SE", name: "SE" },
                      { id: "TO", name: "TO" },
                    ]}
                    required
                    original
                    title="UF"
                  />

                  <Input formRef={formRef} name="date_emitter" type="date" required original title="Data de Emissão" />
                </>
                  )}

                  {user.profile.name == 'Pesquisador'
                && isForeign && (
                <>
                  <Input formRef={formRef} name="passport" original title="Passaporte" />

                  <Input formRef={formRef} name="rg_foreign" required original title="Rg de Estrangeiro" />
                </>
                  )}

                  <Input formRef={formRef} name="email" required original title="E-mail" />

                  <Input formRef={formRef} name="address" original title="Endereço" />

                  <Input formRef={formRef} maxLength={15} required name="phone" original title="Telefone/WhatsApp" />

                  {user.profile.name == 'Pesquisador'
                && (
                <>
                  <Input formRef={formRef} name="sex" select={[{ id: "Masculino", name: "Masculino" }, { id: "Feminino", name: "Feminino" }, { id: "Não declarar", name: "Não declarar" }]} required original title="Sexo" />

                  <Input formRef={formRef} name="birthday" type="date" required original title="Data de Nascimento" />

                  <Input formRef={formRef} name="race" select={[{ id: "Amarela", name: "Amarela" }, { id: "Branca", name: "Branca" }, { id: "Indígena", name: "Indígena" }, { id: "Não declarada", name: "Não declarada" }, { id: "Parda", name: "Parda" }, { id: "Preta", name: "Preta" }]} original title="Raça" />

                  <Input formRef={formRef} name="mother_name" required original title="Nome da Mãe" />

                  <Input formRef={formRef} name="father_name" original title="Nome do Pai" />

                  <Input formRef={formRef} name="curriculum" required original title="Link Currículo Lattes" />

                  <Input formRef={formRef} name="school" select={[{ id: "Ensino Fundamental", name: "Ensino Fundamental" }, { id: "Ensino Médio", name: "Ensino Médio" }, { id: "Ensino Superior", name: "Ensino Superior" }, { id: "Especialização", name: "Especialização" }, { id: "Mestrado", name: "Mestrado" }, { id: "Doutorado", name: "Doutorado" }, { id: "Pós-doutorado", name: "Pós-doutorado" }]} required original title="Nível Acadêmico" />
                </>
                )}

                  {user.profile.name != 'Pesquisador'
                  && <Input formRef={formRef} name="office_id" select={offices} required original title="Cargo/função" />}

                  <Input formRef={formRef} name="cpf" required disabled original title="CPF" />

                  <Input formRef={formRef} name="password" password original title="Senha" />

                  <Input formRef={formRef} name="confirmation_password" password original title="Confirmar senha" />

                  {user.profile.name == 'Pesquisador' && (
                  <>
                    <Link onClick={toggleModalForm1}>+ Atualizar Endereço Residencial</Link>
                    <br />
                    <Link onClick={toggleModalForm2}>+ Atualizar Vínculo Institucional</Link>
                    <br />
                    <Link onClick={toggleModalForm3}>+ Atualizar Endereço Profissional</Link>
                    <br />
                    <Link onClick={toggleModalForm4}>+ Atualizar Correspondência</Link>
                  </>
                  )}
                </div>

                <div className="modal-footer">
                  {loading ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                    <Button
                      className="primary"
                    >
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            </Unform>
          </div>

        </Card>
      </div>

      <Suspense fallback={null}>
        <ModalProvider>
          <ModalForm1
            isOpen={OpenForm1}
            toggleModal={toggleModalForm1}
            item={{
              zipcode: user.zipcode,
              street: user.street,
              number_street: user.number_street,
              complete_street: user.complete_street,
              neighborhood: user.neighborhood,
              country: user.country,
              state: user.state,
              municipality: user.municipality,
              phone: user.phone,
            }}
            submit={submitModalForm1}
          />
          <ModalForm2
            isOpen={OpenForm2}
            toggleModal={toggleModalForm2}
            item={{
              connection: user.connection,
              institution: user.institution,
              connection_institution: user.connection_institution,
              generate_connection: user.generate_connection,
              service_time: user.service_time,
              regime_work: user.regime_work,
              office_name: user.office_name,
              office_time: user.office_time,
            }}
            submit={submitModalForm2}
          />
          <ModalForm3
            isOpen={OpenForm3}
            toggleModal={toggleModalForm3}
            item={{
              professional_zipcode: user.professional_zipcode,
              professional_street: user.professional_street,
              professional_number_street: user.professional_number_street,
              professional_complete_street: user.professional_complete_street,
              professional_neighborhood: user.professional_neighborhood,
              professional_country: user.professional_country,
              professional_state: user.professional_state,
              professional_municipality: user.professional_municipality,
              professional_phone: user.professional_phone,
              professional_phone_cell: user.professional_phone_cell,
              professional_fax: user.professional_fax,
            }}
            submit={submitModalForm3}
          />
          <ModalForm4
            isOpen={OpenForm4}
            toggleModal={toggleModalForm4}
            item={{
              address_mail: user.address_mail,
              received_informations: user.received_informations,
            }}
            submit={submitModalForm4}
          />
        </ModalProvider>
      </Suspense>
    </>
  );
}
