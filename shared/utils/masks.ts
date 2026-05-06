export function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export function cpfMask(value: string) {
  return onlyNumbers(value)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .slice(0, 14);
}

export function cnpjMask(value: string) {
  return onlyNumbers(value)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

export function phoneMask(value: string) {
  return onlyNumbers(value)
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

export function cepMask(value: string) {
  return onlyNumbers(value)
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

export function currencyMask(value: string) {
  const numericValue = onlyNumbers(value);

  const number = Number(numericValue) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
}
