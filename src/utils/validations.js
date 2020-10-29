function cpfMask(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

function mtel(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
}

function moeda(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/(\d{1})(\d{15})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{11})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{8})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{5})$/, '$1.$2');
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2');
  return `R$ ${v}`;
}

function data(v) {
  v = v.replace(/\D/g, '');
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1:$2');
  v = v.replace(/^(\d{2})(\d{2})/, '$1:$2');
  return v;
}

function Cep(v) {
  v = v.replace(/D/g, "");
  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v;
}

function Cnpj(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  return v;
}

export {
  cpfMask, mtel, moeda, data, Cep, Cnpj,
};
