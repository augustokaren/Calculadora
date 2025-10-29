// ===================================
// FUNÇÕES DE MANIPULAÇÃO DE DISPLAY
// ===================================

let acabouCalculo = false; // flag para detectar se acabou um cálculo

function insert(num) {
    var resultadoElement = document.getElementById('resultado');
    var numero = resultadoElement.innerHTML;

    // Se acabou um cálculo, limpar display antes de inserir
    if (acabouCalculo) {
        numero = "";
        acabouCalculo = false;
    }

    var ultimoCaractere = numero.slice(-1);
    var operadores = ['+', '-', '*', '/'];

    // Evita múltiplos operadores consecutivos
    if (operadores.includes(num) && operadores.includes(ultimoCaractere)) {
        resultadoElement.innerHTML = numero.slice(0, -1) + num;
    } else {
