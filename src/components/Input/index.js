import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { useField } from '@unform/core';
import SelectMultiple from "react-select";

import {
  cpfMask, mtel, moeda, data, Cep, Cnpj,
} from '../../utils/validations';

import { Container, Title } from './styles';

function Input({
  formRef, original = false, setIsForeign, disabled, handleCEP, multi = true, access,
  setIsConnection, setIsGenerate_connection, institutions, setInstitutions,
  password, required, select, name, title, ...rest
}) {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current.value);
  }, []);

  return (
    <>
      {original ? (
        <>
          {select ? (
            <div className="input-block">
              <label>
                {title}
                {' '}
                {required && <sup>*</sup>}
              </label>
              <select
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                ref={inputRef}
                onChange={(value) => {
                  inputRef.current.value = String(value.target.value);
                  formRef.current.setFieldValue(name, value.target.value);

                  if (name == 'type_personal') { setIsForeign(value.target.value === 'Pesquisador estrangeiro'); }
                  if (name == 'connection') { setIsConnection(value.target.value === 'Sim'); }
                  if (name == 'generate_connection') { setIsGenerate_connection(value.target.value === 'Sim'); }
                }}
              >
                {select.map((item) => (
                  <option value={item}>{item}</option>
                ))}

                {(name == 'perfil' || name == 'office') && <option value="Indeifido">Indefinido</option>}

              </select>
            </div>
          ) : (
            <div style={{ marginBottom: 10 }} className="input-block">
              <label className="required">
                {title}
                {' '}
                {required && <sup>*</sup>}
              </label>
              <input
                style={{ borderColor: error ? '#c53030' : '#999' }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                ref={inputRef}
                type={!password ? 'text' : 'password'}
                disabled={disabled}
                onKeyPress={(e) => {
                  if (e.charCode == 13) {
                    if (name == 'another_institutions') {
                      const formatted = e.target.value;
                      inputRef.current.value = String(e.target.value);
                      formRef.current.setFieldValue('another_institutions', formatted);
                      setInstitutions([...institutions, formatted]);
                    }
                  }
                }}
                onChange={(value) => {
                  if (name === 'cpf') {
                    const formatted = cpfMask(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('cpf', formatted);
                  } else if (name === 'cnpj') {
                    const formatted = Cnpj(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('cnpj', formatted);
                  } else if (name === 'phone') {
                    const formatted = mtel(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('phone', formatted);
                  } else if (name === 'phone_cell') {
                    const formatted = mtel(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('phone_cell', formatted);
                  } else if (name === 'price') {
                    const formatted = moeda(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('price', formatted);
                  } else if (name === 'time') {
                    const formatted = data(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('time', formatted);
                  } else if (name === 'zipcode') {
                    const formatted = Cep(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('zipcode', formatted);
                    handleCEP(formatted);
                  } else if (name === 'professional_zipcode') {
                    const formatted = Cep(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('zipcode', formatted);
                    handleCEP(formatted);
                  } else if (name === 'name') {
                    formRef.current.setFieldValue('name_mini', `${value.target.value.split(' ')[0]} ${value.target.value.split(' ')[1]}`);
                  } else {
                    inputRef.current.value = String(value.target.value);
                  }
                }}
                {...rest}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {error && error}
              </sup>
            </div>
          )}
        </>
      ) : multi ? (
        <div>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#626262',
            }}
            className="required"
          >
            {title}
            {' '}
            {required && <sup style={{ color: "#f00" }}>*</sup>}
          </label>
          <sup style={{ color: '#c53030' }}>
            {error && error}
          </sup>
          <div style={{ marginBottom: 5 }} />
          <SelectMultiple
            maxMenuHeight={150}
            isMulti
            menuIsOpen
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder={title}
            defaultValue={defaultValue}
            noOptionsMessage={({ inputValue }) => "Sem opções"}
            options={access}
            ref={inputRef}
            onChange={(values) => {
              inputRef.current.value = values;
              formRef.current.setFieldValue('access', values);
            }}
            {...rest}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: "#080",
                primary: "#dee2e6",
              },
            })}
            styles={{
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "#fff" : "rgb(102,102,102)",
                backgroundColor: state.isSelected ? "rgb(102,102,102)" : "#fff",

                ":active": {
                  ...provided[":active"],
                  backgroundColor: !state.isDisabled && "#dee2e6",
                },
              }),
            }}
          />
          <div style={{ marginTop: 50 }} />
        </div>
      ) : (
        <>
          <Title>{title}</Title>

          <Container isErrorred={!!error} isFilled={isFilled} isFocused={isFocused}>
            <input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              defaultValue={defaultValue}
              onChange={(value) => {
                if (name === 'cpf') {
                  const formatted = cpfMask(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('cpf', formatted);
                } else if (name === 'cnpj') {
                  const formatted = Cnpj(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('cnpj', formatted);
                } else if (name === 'phone') {
                  const formatted = mtel(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('phone', formatted);
                } else if (name === 'phone_cell') {
                  const formatted = mtel(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('phone_cell', formatted);
                } else if (name === 'price') {
                  const formatted = moeda(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('price', formatted);
                } else if (name === 'time') {
                  const formatted = data(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('time', formatted);
                } else if (name === 'zipcode') {
                  const formatted = Cep(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('zipcode', formatted);
                } else {
                  inputRef.current.value = String(value.target.value);
                }
              }}
              ref={inputRef}
              {...rest}
            />
          </Container>
        </>
      )}
    </>
  );
}

export default Input;
