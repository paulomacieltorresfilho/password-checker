// Caracteres que precisam ter pelo menos um na criação da senha 
const rules = { 
    uppercase : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
    lowercase : 'abcçdefghijklimnopqrstuvwxyz', 
    algarisms : '01234156789', 
    symbols : '!"#$%&\'()*+,-./\\:;<=>?@[]{}^_`´~°|' 
}; 
const minLength = 6; // tamanho mínimo que a senha deve possuir

// Elementos do index.html
const textInput = document.getElementById('password-input');
const confirmLabel = document.getElementsByClassName('confirm-message')[0];
const sugestionList = document.getElementById('sugestion-list').getElementsByTagName("li");       


let rulesCount = {}; // objeto com a contagem das vezes que a regra apareceu na senha
let password = ''; 

// Função chamada quando o usuário clica no 'confirmar'
// Se a senha for inválida, mostra algumas sugestões ao usuário
function verifyPassword() {
    password = textInput.value;
    countRules();

    // Caso a senha seja válida
    if (Object.values(rulesCount).every(item => item > 0)) { 
        // Confirmação visual da senha
        textInput.classList.add('valid-password');
        setTimeout(function () {
            textInput.classList.remove('valid-password');
        }, 750);
        confirmLabel.innerHTML = 'senha cadastrada com sucesso!';
    }

    // Caso a senha seja inválida
    else { 
        // Confirmação visual da senha
        textInput.classList.add('invalid-password');
        setTimeout(function () {
            textInput.classList.remove('invalid-password');
        }, 750);
        confirmLabel.innerHTML = 'senha inválida!';
        
        // Criar e mostrar lista de sugestões
        for (let i = 0; i < sugestionList.length; i++) {
            sugestionList[i].innerHTML = createSuggestion(password);
        }
        document.getElementById('sugestion-div').style.visibility = 'visible';
    }
}

// Função que faz a contagem de quantas vezes certa regra
// apareceu na senha fornecida e armazena a contagem no objeto rulesCount
function countRules() {
    rulesCount = {};
    for (let key in rules) {
        rulesCount[key] = countSimilarities(rules[key], password);
    }
    password.length < minLength ? rulesCount['length'] = 0 : rulesCount['length'] = 1;
}

// Função que cria a sugestão de senha baseada na senha fornecida
// Adiciona os caracteres das regras que não foram seguidas e coloca-os em ordem
function createSuggestion(text='') {
    let suggestion = text;
    
    if (rulesCount['uppercase'] == 0) {
        if (rulesCount['lowercase'] <= 1) {
            suggestion += getRandomElementFromArray(rules['uppercase']);
        }
        else {
            for (let i = 0; i < suggestion.length; i++) {
                if (rules['lowercase'].includes(suggestion.charAt(i))) {
                    suggestion = suggestion.slice(0, i) + suggestion.charAt(i).toUpperCase() + suggestion.slice(i+1);
                    break;
                }
            }
        }
    }

    if (rulesCount['lowercase'] == 0) {
        if (rulesCount['uppercase'] < 2) {
            suggestion += getRandomElementFromArray(rules['lowercase']);
        }
        else {
            let first = true;
            for (let i = 0; i < suggestion.length; i++) {
                if (rules['uppercase'].includes(suggestion.charAt(i))) {
                    if (!first) {
                        suggestion = suggestion.slice(0, i) + suggestion.charAt(i).toLowerCase() + suggestion.slice(i+1);
                    } else {
                        first = false;
                    }
                }
            }
        }
    }

    if (rulesCount['symbols'] == 0) {
        suggestion += getRandomElementFromArray(rules['symbols']);
    }

    if (rulesCount['algarisms'] == 0) {
        suggestion += getRandomElementFromArray(rules['algarisms'])
    }


    if (rulesCount['length'] == 0) {
        while (suggestion.length < 6) {
            suggestion += getRandomElementFromArray(rules['lowercase']);
        } 
    }

    // Ordena a sugestão da seguinte forma:
    // maiúsculas-minúsculas-símbolos-algarismos
    suggestion = suggestion.split('').sort(function(a, b) {
        // Uppercase:
        if (rules['uppercase'].includes(a) && rules['uppercase'].includes(b)) return 0;
        if (rules['uppercase'].includes(a)) return -1;
        if (rules['uppercase'].includes(b)) return 1;
        
        // Lowercase:
        if (rules['lowercase'].includes(a) && rules['lowercase'].includes(b)) return 0;
        if (rules['lowercase'].includes(a)) return -1;
        if (rules['lowercase'].includes(b)) return 1;

        // Symbols
        if (rules['symbols'].includes(a) && rules['symbols'].includes(b)) return 0;
        if (rules['symbols'].includes(a)) return -1;
        if (rules['symbols'].includes(b)) return 1;
        
        // Algarisms
        if (rules['algarisms'].includes(a) && rules['algarisms'].includes(b)) return 0;

    }).join('');
    
    return suggestion;
}

// Conta quantas similaridades existe entre duas strings,
// no caso, entre alguma regra e a senha fornecida
function countSimilarities(string1, string2) {
    count = 0;
    for (let i = 0; i < string1.length; i++) {
        for (let j = 0; j < string2.length; j++) {
            if (string1[i] === string2[j]) {
                count += 1;
            }
        }
    }
    return count;
} 

// Pega um elemento aleatório de um array
const getRandomElementFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]; 

// Chama a senha verifyPassword() caso o usuário aperte ENTER
textInput.addEventListener("keyup", event => {
    if (event.key === 'Enter') {
        verifyPassword();
    }
})