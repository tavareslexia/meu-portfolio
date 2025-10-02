//Arquivo de funções auxiliares

function stringCompare(str1, str2) {
  const removerAcento = (str) =>
    str
      .normalize("NFD") //separa caracteres e acentos
      .replace(/[\u0300-\u036f]/g, "") //remove os acentos
      .toLowerCase();
  const str1Normalizada = removerAcento(str1);
  const str2Normalizada = removerAcento(str2);
  return str1Normalizada === str2Normalizada;
}

function checkStatus(status, res) {
  if (status < 0 || status > 1) {
    res.status(400).json({ error: "Campo status inválido." });
    return true;
  }
  return false;
}

function validateNumber(value, fieldName, res, min = 0) {
  const num = Number(value);
  if (isNaN(num) || num < min) {
    res
      .status(400)
      .json({ error: `${fieldName} deve ser um número válido (>= ${min}).` });
    return null;
  }
  return num;
}

module.exports = { stringCompare, checkStatus, validateNumber };
