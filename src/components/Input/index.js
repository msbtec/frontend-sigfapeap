import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { useField } from '@unform/core';

import {
  cpfMask, mtel, moeda, data,
} from '../../utils/validations';

import { Container, Title } from './styles';

function Input({
  formRef, original = false, required, select, name, title, ...rest
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
                }}
              >
                {select.map((item) => (
                  <option value={item}>{item}</option>
                ))}
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
                onChange={(value) => {
                  if (name === 'cpf') {
                    const formatted = cpfMask(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('cpf', formatted);
                  } else if (name === 'phone') {
                    const formatted = mtel(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('phone', formatted);
                  } else if (name === 'price') {
                    const formatted = moeda(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('phone', formatted);
                  } else if (name === 'time') {
                    const formatted = data(value.target.value);
                    inputRef.current.value = String(formatted);
                    formRef.current.setFieldValue('phone', formatted);
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
                } else if (name === 'phone') {
                  const formatted = mtel(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('phone', formatted);
                } else if (name === 'price') {
                  const formatted = moeda(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('phone', formatted);
                } else if (name === 'time') {
                  const formatted = data(value.target.value);
                  inputRef.current.value = String(formatted);
                  formRef.current.setFieldValue('phone', formatted);
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
