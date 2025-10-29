// ===================================
// FUNÇÕES DE MANIPULAÇÃO DE DISPLAY
// ===================================

function insert(num) {
    var resultadoElement = document.getElementById('resultado');
    var numero = resultadoElement.innerHTML;
    
    // Evita múltiplos operadores seguidos (ex: 5++), aprimorando a usabilidade.
    var ultimoCaractere = numero.slice(-1);
    var operadores = ['+', '-', '*', '/'];

    if (operadores.includes(num) && operadores.includes(ultimoCaractere)) {
        // Se o último caractere for um operador, substitui o antigo pelo novo.
        resultadoElement.innerHTML = numero.slice(0, -1) + num;
    } else {
        // Caso contrário, apenas adiciona o número/operador.
        resultadoElement.innerHTML = numero + num;
    }
}

function clean() {
    document.getElementById('resultado').innerHTML = "";
}

function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1);
}

// =======================================
// NOVO MOTOR DE CÁLCULO (MAIS SEGURO)
// =======================================

/**
 * Funções auxiliares para realizar operações matemáticas.
 */
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};

/**
 * Função que avalia a expressão sem usar eval(), respeitando a ordem das operações.
 * @param {string} expression - A string de cálculo (ex: "5+2*3").
 * @returns {number|string} O resultado ou uma mensagem de erro.
 */
function parseAndCalculate(expression) {
    if (!expression) return "";

    // 1. Regex para extrair números (incluindo decimais) e operadores.
    // O padrão captura números de ponto flutuante e os operadores.
    const tokens = expression.match(/(\d+\.?\d*|[\+\-\*\/])/g);

    if (!tokens) return "Erro";
    
    // 2. Separa a lista de tokens em arrays de números e operadores.
    let numbers = [];
    let operators = [];

    tokens.forEach(token => {
        if (operations[token]) {
            operators.push(token);
        } else {
            // Converte o token para número de ponto flutuante
            numbers.push(parseFloat(token)); 
        }
    });

    // 3. Processa Multiplicação e Divisão primeiro (Prioridade 1)
    for (let i = 0; i < operators.length; i++) {
        const op = operators[i];
        if (op === '*' || op === '/') {
            const result = operations[op](numbers[i], numbers[i + 1]);
            
            // Substitui os dois números e o operador pelo resultado
            numbers.splice(i, 2, result);
            operators.splice(i, 1);
            i--; // Volta um passo, pois o array diminuiu
        }
    }

    // 4. Processa Adição e Subtração depois (Prioridade 2)
    let finalResult = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const op = operators[i];
        finalResult = operations[op](finalResult, numbers[i + 1]);
    }

    // Retorna o resultado final.
    return finalResult;
}


// ===================================
// FUNÇÃO CALCULAR (AGORA SEGURA)
// ===================================

function calcular() {
    var expressao = document.getElementById('resultado').innerHTML;
    
    if (expressao) {
        // **SUBSTITUÍMOS eval() pela nova função segura:**
        var resultadoCalculado = parseAndCalculate(expressao);
        
        // Exibe o resultado ou a mensagem "Nada..."
        if (resultadoCalculado === "Erro" || isNaN(resultadoCalculado)) {
            document.getElementById('resultado').innerHTML = "Erro";
        } else if (resultadoCalculado === "") {
            document.getElementById('resultado').innerHTML = "Nada....";
        } else {
            document.getElementById('resultado').innerHTML = resultadoCalculado;
        }

    } else {
        document.getElementById('resultado').innerHTML = "Nada....";
    }
}
