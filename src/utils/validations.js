function cpf_mask(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

function phone_mask(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
}

function money_mask(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/(\d{1})(\d{15})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{11})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{8})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{5})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2');
  return `R$ ${v}`;
}

function interval_value_mask(v) {
  v = v.replace(/\D/g, '');
  v = v.length > 3 ? v.substr(3, v.length) : v.length == 3 ? '' : v;
  v = v.replace(/(\d{1})(\d{15})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{11})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{8})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{5})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2');
  return `R$ 1,00 à R$ ${v}`;
}

function date_mask(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1:$2');
  v = v.replace(/^(\d{2})(\d{2})/, '$1:$2');
  return v;
}

function cep_mask(v) {
  v = v.replace(/D/g, "");
  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v;
}

function cnpj_mask(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  return v;
}

export {
  cpf_mask, phone_mask, money_mask, date_mask, cep_mask, cnpj_mask, interval_value_mask,
};
