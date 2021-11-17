// Caracteres que precisam ter pelo menos um na criação da senha 
const rules = { 
    uppercase : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
    lowercase : 'abcdefghijklimnopqrstuvwxyz', 
    algarisms : '01234156789', 
    symbols : '!"#$%&\'()*+,-./\\:;<=>?@[]{}^_`´~°|' 
}; 

// Elementos do index.html
const textInput = document.getElementById('password-input');
const confirmLabel = document.getElementsByClassName('confirm-message')[0];
const sugestionList = document.getElementById('sugestion-list').getElementsByTagName("li");       

// Lista de regras que não foram implementadas 
let rulesCount = {}; 
let password = ''; 

// Verifica se a senha digitada segue todas as regras impostas,
// caso contrário, aparecerá algumas sugestões para o usuário
function verifyPassword() {
    password = textInput.value;
    countRules();

    // Senha válida
    if (Object.values(rulesCount).every(item => item > 0)) { 
        // Confirmação visual da senha
        textInput.classList.add('valid-password');
        setTimeout(function () {
            textInput.classList.remove('valid-password');
        }, 750);
        confirmLabel.innerHTML = 'senha cadastrada com sucesso!';
    }

    // Senha inválida
    else { 

        // Confirmação visual da senha
        textInput.classList.add('invalid-password');
        setTimeout(function () {
            textInput.classList.remove('invalid-password');
        }, 750);
        confirmLabel.innerHTML = 'senha inválida!';
        
        // Criar e mostrar lista de sugestões
        for (let i = 0; i < sugestionList.length; i++) {
            sugestionList[i].innerHTML = createSugestion(password);
        }
        document.getElementById('sugestion-div').style.visibility = 'visible';
    }
}

// Faz a verificação de cada regra e retorna true se a senha
// seguir todas as regras e false caso não
function countRules() {
    rulesCount = {};
    for (let key in rules) {
        rulesCount[key] = countSimilarities(rules[key], password);
    }
    password.length < 6 ? rulesCount['length'] = 0 : rulesCount['length'] = 1;
}

// TODO
function createSugestion(text='') {
    let sugestion = text;
    
    // Caso não possua letras minúsculas
    if (rulesCount['lowercase'] == 0) {
        if (rulesCount['uppercase'] <= 1) {
            sugestion = insert(
                sugestion,
                getRandomElementFromArray(rules['lowercase']),
                1
            );
        }
        else {
            let first = true;
            for (let i = 0; i < sugestion.length; i++) {
                if (rules['uppercase'].includes(sugestion.charAt(i))) {
                    if (!first) {
                        sugestion = sugestion.slice(0, i) + sugestion.charAt(i).toLowerCase() + sugestion.slice(i+1);
                    } else {
                        first = false;
                    }
                }
            }
        }
    }
    //  Caso não possua letras maiúsculas
    if (rulesCount['uppercase'] == 0) {
        if (rulesCount['lowercase'] <= 1) {
            sugestion = insert(
                sugestion,
                getRandomElementFromArray(rules['uppercase']),
                0
            );
        }
        else {
            for (let i = 0; i < sugestion.length; i++) {
                if (rules['lowercase'].includes(sugestion.charAt(i))) {
                    sugestion = sugestion.slice(0, i) + sugestion.charAt(i).toUpperCase() + sugestion.slice(i+1);
                    break;
                }
            }
        }
    }

    
    if (rulesCount['symbols'] == 0) {
        let insertIndex;
        for (let i = 0; i < sugestion.length; i++) {
            if (rules['lowercase'].includes(sugestion[i]) && !rules['lowercase'].includes(sugestion[i+1])) {
                insertIndex = i+1;
                break;
            }
        }
        sugestion = insert(
            sugestion,
            getRandomElementFromArray(rules['symbols']),
            insertIndex
        );
    }

    if (rulesCount['algarisms'] == 0) {
        
    }


    if (rulesCount['length'] == 0) {
        
    }

    return sugestion;
}

textInput.addEventListener("keyup", event => {
    if (event.key === 'Enter') {
        verifyPassword();
    }
})


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

const insert = (string, element, index) => string.substring(0, index) + element + string.substring(index, string.length);
const getRandomElementFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]; 
