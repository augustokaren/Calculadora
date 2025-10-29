// ===================================
// FUNÇÕES DE MANIPULAÇÃO DE DISPLAY
// ===================================

const resultadoElement = document.getElementById('resultado');
const operadores = ['+', '-', '*', '/'];

/**
 * Insere um número ou operador no display.
 * Controla a inserção para evitar múltiplos operadores seguidos.
 * @param {string} val - O valor a ser inserido (número ou operador).
 */
function insert(val) {
    let numeroAtual = resultadoElement.innerHTML;
    let ultimoCaractere = numeroAtual.slice(-1);

    // Se o valor a ser inserido e o último caractere são operadores,
    // substitui o último operador pelo novo.
    if (operadores.includes(val) && operadores.includes(ultimoCaractere)) {
        resultadoElement.innerHTML = numeroAtual.slice(0, -1) + val;
    } 
    // Impede a inserção de múltiplos pontos decimais no mesmo número
    else if (val === '.' && (ultimoCaractere === '.' || !numeroAtual || operadores.includes(ultimoCaractere))) {
        // Se o último caractere for um ponto ou não houver número antes, ou for um operador, não insere o ponto.
        // Ou você pode optar por inserir "0." se não houver número:
        if (!numeroAtual || operadores.includes(ultimoCaractere)) {
             resultadoElement.innerHTML += '0.';
        }
        // Caso contrário, ignora o ponto
        return; 
    }
    else {
        resultadoElement.innerHTML += val;
    }
}

/**
 * Limpa completamente o display da calculadora.
 */
function clean() {
    resultadoElement.innerHTML = "";
}

/**
 * Remove o último caractere do display (backspace).
 */
function back() {
    let resultado = resultadoElement.innerHTML;
    resultadoElement.innerHTML = resultado.substring(0, resultado.length - 1);
}

// =======================================
// NOVO MOTOR DE CÁLCULO (MAIS SEGURO SEM eval())
// =======================================

/** Objeto com as funções para cada operação matemática. */
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => (b === 0 ? NaN : a / b), // Lidar com divisão por zero
};

/**
 * Analisa e calcula uma expressão matemática seguindo a ordem das operações (PEMDAS/BODMAS).
 * Não utiliza 'eval()' para maior segurança.
 * @param {string} expression - A string de cálculo (ex: "5+2*3").
 * @returns {number|string} O resultado do cálculo ou uma mensagem de erro.
 */
function parseAndCalculate(expression) {
    if (!expression) return "";

    // Regex para extrair números (inteiros e decimais) e operadores.
    // Garante que o sinal de menos no início de um número negativo seja tratado corretamente.
    const tokens = expression.match(/(\d+\.?\d*|\-?\d+\.?\d*|[\+\-\*\/])/g);
    
    // Tratamento para números negativos no início da expressão
    // Ex: -5+2 -> ["-", "5", "+", "2"] ou "-5", "+", "2"
    // Esta regex tenta pegar números negativos no início ou após um operador.
    const finalTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '-' && (i === 0 || operadores.includes(tokens[i-1]))) {
            // Se for um '-' no início ou após outro operador, assume que é parte de um número negativo
            if (i + 1 < tokens.length && !isNaN(parseFloat(tokens[i+1]))) {
                finalTokens.push(parseFloat(tokens[i] + tokens[i+1]));
                i++; // Pula o próximo token pois já foi consumido
            } else {
                // Caso contrário, é um operador de subtração
                finalTokens.push(tokens[i]);
            }
        } else if (!isNaN(parseFloat(tokens[i]))) {
            finalTokens.push(parseFloat(tokens[i]));
        } else {
            finalTokens.push(tokens[i]);
        }
    }


    if (!finalTokens || finalTokens.length === 0) return "Erro";

    let currentNumbers = [];
    let currentOperators = [];

    // Popula as listas de números e operadores
    finalTokens.forEach(token => {
        if (typeof token === 'number') {
            currentNumbers.push(token);
        } else if (operadores.includes(token)) {
            currentOperators.push(token);
        } else {
            // Isso pode acontecer se houver caracteres inválidos na expressão
            return "Erro";
        }
    });

    if (currentNumbers.length === 0) return "Erro"; // Não há números para calcular

    // 1. Processa Multiplicação e Divisão (Alta Prioridade)
    for (let i = 0; i < currentOperators.length; i++) {
        const op = currentOperators[i];
        if (op === '*' || op === '/') {
            if (currentNumbers[i + 1] === undefined) return "Erro"; // Operador sem segundo operando
            
            const result = operations[op](currentNumbers[i], currentNumbers[i + 1]);
            if (isNaN(result)) return "Erro: Div/0";

            currentNumbers.splice(i, 2, result); // Substitui operando1, operando2 e remove o operador
            currentOperators.splice(i, 1);
            i--; // Ajusta o índice pois o array currentOperators foi modificado
        }
    }

    // 2. Processa Adição e Subtração (Baixa Prioridade)
    let finalResult = currentNumbers[0];
    for (let i = 0; i < currentOperators.length; i++) {
        const op = currentOperators[i];
        if (currentNumbers[i + 1] === undefined) return "Erro"; // Operador sem segundo operando
        finalResult = operations[op](finalResult, currentNumbers[i + 1]);
    }

    return finalResult;
}


// ===================================
// FUNÇÃO CALCULAR PRINCIPAL
// ===================================

/**
 * Aciona o cálculo da expressão exibida no display.
 */
function calcular() {
    let expressao = resultadoElement.innerHTML;
    
    // Remove qualquer operador solitário no final da expressão antes de calcular
    const ultimoChar = expressao.slice(-1);
    if (operadores.includes(ultimoChar) && expressao.length > 1) {
        expressao = expressao.slice(0, -1);
    }


    if (expressao) {
        const resultadoCalculado = parseAndCalculate(expressao);
        
        if (typeof resultadoCalculado === 'number' && !isNaN(resultadoCalculado)) {
            resultadoElement.innerHTML = resultadoCalculado;
        } else {
            resultadoElement.innerHTML = "Erro";
        }
    } else {
        resultadoElement.innerHTML = "Nada....";
    }
}

// ===================================
// GESTÃO DE EVENTOS DOS BOTÕES (MELHORADO)
// ===================================

// Seleciona todos os botões que têm a classe 'botao'
const botoes = document.querySelectorAll('.botao');

// Itera sobre cada botão e adiciona um ouvinte de evento de clique
botoes.forEach(botao => {
    botao.addEventListener('click', (event) => {
        // Pega o valor a ser usado no cálculo/ação do botão
        // Prefere 'data-value' se existir, senão usa o texto visível do botão
        const valor = event.target.dataset.value || event.target.textContent;

        switch (valor) {
            case 'C':
                clean();
                break;
            case 'back': // Usamos 'back' como data-value para o botão da seta
                back();
                break;
            case '=':
                calcular();
                break;
            default:
                // Para todos os outros botões (números e operadores)
                insert(valor);
                break;
        }
    });
});
