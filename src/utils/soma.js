function getValue(value) {
  let valor_liquido = 0;
  if (value) {
    const string = String(value).split('R$')[1].trim().replace(/[\D]+/g, '');
    if (string.length > 2) {
      const resultado = `${string.substr(0, string.length - 2)}.${string.substr(string.length - 2)}`;
      valor_liquido = resultado;
    } else if (string.length > 1) {
      const resultado = `${string.substr(0, string.length - 1)}.${string.substr(string.length - 1)}`;
      valor_liquido = resultado;
    } else {
      valor_liquido = string;
    }
  }

  return Number(valor_liquido);
}

function soma(array) {
  return array.length > 0 ? array.reduce((accumulator, currentValue) => accumulator + getValue(currentValue.custo_total), 0).toFixed(2) : '0';
}

export { getValue, soma };
