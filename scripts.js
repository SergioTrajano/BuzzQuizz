getQuizzes();

function tratarErro() {
    alert("Houve algum erro no processo de salvamento!");
}

function concluirCriacao(response) {
    let userId = localStorage.getItem("ids");
    userId = JSON.parse(userId);
    userId[userId.length] = response.data.id;
    userId = JSON.stringify(userId);
    localStorage.removeItem("ids");
    localStorage.setItem("ids", userId);
    const img = document.querySelector(".finalizado img");
    img.src = document.querySelector(".informacoes-basicas input:nth-child(2)").value;
    document.querySelector(".niveis").classList.add("escondido");
    document.querySelector(".finalizado").classList.remove("escondido");
}

function acharNivel(i) {
    const nivel = document.querySelector(`.niveis li:nth-child(${i})`);
    return {
        title: nivel.querySelector("input:nth-child(1)").value,
        image: nivel.querySelector("input:nth-child(3)").value,
        text: nivel.querySelector("input:nth-child(4)").value,
        minValue: nivel.querySelector("input:nth-child(2)").value
    }
}

function retornarNiveis() {
    const levels = [];
    const numNiveis = parseInt(document.querySelector(".informacoes-basicas input:last-child").value);
    for (let i = 1; i <= numNiveis; i++) {
        levels[i-1] = acharNivel(i);
    }
    return levels;
}

function acharPergunta(i) {
    const pergunta = document.querySelector(`.perguntas li:nth-child(${i})`);
    const titulo = pergunta.querySelector(".maximizado input:nth-child(1)").value;
    const cor = pergunta.querySelector(".maximizado input:nth-child(2)").value;
    const opcoes = [{
        text: pergunta.querySelector(".maximizado input:nth-child(4)").value,
        image: pergunta.querySelector(".maximizado input:nth-child(5)").value,
        isCorrectAnswer: true
    }];
    for (let j = 7; j < 12; j+=2) {
        if (pergunta.querySelector(`.maximizado input:nth-child(${j})`).value !== "") {
            opcoes[opcoes.length] = {
                text: pergunta.querySelector(`.maximizado input:nth-child(${j})`).value,
                image: pergunta.querySelector(`.maximizado input:nth-child(${j+1})`).value,
                isCorrectAnswer: false
            }
        }
    }
    return {
        title: titulo,
        color: cor,
        answers: opcoes
    }
}

function retornarPerguntas() {
    const questions = []
    const numPerguntas = parseInt(document.querySelector(".informacoes-basicas input:nth-child(3)").value);
    for (let i = 1; i <= numPerguntas; i++) {
        questions[i-1] = acharPergunta(i);
    }
    return questions;
}

function retornarUrl() {
    return document.querySelector(".informacoes-basicas input:nth-child(2)").value;
}

function retornarTitulo() {
    return document.querySelector(".informacoes-basicas input:first-child").value;
}

function validarNiveis() {
    const numNiveis = parseInt(document.querySelector(".informacoes-basicas input:last-child").value);
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let tituloNivel;
    let porcent;
    let url;
    let descricao;
    let porcetZero = false;
    for (let i = 1; i <= numNiveis; i++) {
        tituloNivel = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(1)`).value;
        porcent = parseInt(document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(2)`).value);
        url = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(3)`).value;
        descricao = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(4)`).value;
        if (tituloNivel.length < 10) {
            return false;
        }
        if (porcent < 0 || porcent > 100) {
            return false;
        }
        if (porcent === 0) {
            porcetZero = true;
        }
        if (!regexp.test(url)) {
            return false;
        }
        if (descricao.length < 30) {
            return false;
        }
    }
    if (!porcetZero) {
        return false
    }
    return true;
}

function salvarQuizz() {
    if (validarNiveis()) {
        const quizz = {
            title: retornarTitulo(),
            image: retornarUrl(),
            questions: retornarPerguntas(),
            levels: retornarNiveis()
        };
        const promisse = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", quizz);
        promisse.then(concluirCriacao);
        promisse.catch(tratarErro);
    } else {
        alert("Há algum dado inválido!");
    }
}

function preencherNiveis() {
    const listaNiveis = document.querySelector(".niveis ul");
    const numNiveis = parseInt(document.querySelector(".informacoes-basicas input:last-child").value);
    listaNiveis.innerHTML = "";
    for (let i = 0; i < numNiveis; i++) {
        if (i === 0) {
            listaNiveis.innerHTML += `
                <li class="selecionado">
                    <p>Nivel 1</p>
                    <img class="icone escondido" onclick="maximizarPergunta(this, 'niveis')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                    <div class="maximizado">
                        <input type="text" placeholder="Título do nível">
                        <input type="text" placeholder="% de acerto mínima">
                        <input type="text" placeholder="URL da imagem do nível">
                        <input type="text" placeholder="Descrição do nível">
                    </div>
                </li>
            `
        } else {
            listaNiveis.innerHTML += `
                <li>
                    <p>Nivel ${i+1}</p>
                    <img class="icone" onclick="maximizarPergunta(this, 'niveis')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                    <div class="maximizado escondido">
                        <input type="text" placeholder="Título do nível">
                        <input type="text" placeholder="% de acerto mínima">
                        <input type="text" placeholder="URL da imagem do nível">
                        <input type="text" placeholder="Descrição do nível">
                    </div>
                </li>
            `
        }
    }
}

function validarPerguntas() {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let textoPergunta;
    let corFundo;
    let textoResposta;
    let urlResposta;
    let textoErro;
    let urlErro;
    const numPerguntas = parseInt(document.querySelector(".informacoes-basicas input:nth-child(3)").value);
    for (let i = 1; i <= numPerguntas; i++) {
        textoPergunta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(1)`).value;
        corFundo = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(2)`).value.toUpperCase();
        textoResposta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(4)`).value;
        urlResposta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(5)`).value;
        if (textoPergunta.length < 20) {
            return false;
        }
        if (corFundo.length !== 7 || corFundo[0] !== "#") {
            return false;
        }
        for (let k = 1; k < 7; k++) {
            if (corFundo[k] !== 'A' && corFundo[k] !== 'B' && corFundo[k] !== 'C' && corFundo[k] !== 'D' && corFundo[k] !== 'E' && corFundo[k] !== 'F' && isNaN(Number(corFundo[k]))) {
                return false;
            }
        }
        if (textoResposta === "") {
            return false;
        }
        if (!regexp.test(urlResposta)) {
            return false;
        }
        for (let j = 7; j < 12; j+=2) {
            textoErro = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(${j})`).value;
            urlErro = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(${j+1})`).value;
            if (textoErro !== "" && !regexp.test(urlErro)) {
                return false;
            }
            if (!regexp.test(urlErro) && urlErro.length > 0) {
                return false;
            }
        }
        if (document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(7)`).value === "" && document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(9)`).value === "" && document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(11)`).value === "") {
            return false;
        }
    }
    return true;
}

function verificarPerguntas() {
    if (validarPerguntas()) {
        document.querySelector(".perguntas").classList.add("escondido");
        document.querySelector(".niveis").classList.remove("escondido");
        preencherNiveis();
    } else {
        alert("Há alguma informação invalida!");
    }
}

function maximizarPergunta(elemento, fase) {
    const maximizar = elemento.parentNode.querySelector(".maximizado");
    const minimizar = document.querySelector(`.${fase} .selecionado`);
    if (minimizar !== null) {
        minimizar.querySelector(".maximizado").classList.add("escondido");
        minimizar.querySelector("img").classList.remove("escondido");
        minimizar.classList.remove("selecionado");
    }
    maximizar.classList.remove("escondido");
    elemento.parentNode.classList.add("selecionado");
    elemento.classList.add("escondido");
    // Ver depois se tem como fazer o scrollIntoView(true) do elemento selecionado
}

function preencherPerguntas() {
    const formularioPerguntas = document.querySelector(".perguntas ul");
    const numPerguntas = parseInt(document.querySelector(".dados-basicos input:nth-child(3)").value);
    formularioPerguntas.innerHTML = "";
    for (let i = 0; i < numPerguntas; i++) {
        if (i === 0) {
            formularioPerguntas.innerHTML += `
            <li class="selecionado">
                <p>Pergunta 1</p>
                <img class="icone escondido" onclick="maximizarPergunta(this, 'perguntas')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                <div class="maximizado">
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                    <p>Resposta correta</p>
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                    <p>Respostas incorretas</p>
                    <input type="text" placeholder="Resposta incorreta 1">
                    <input type="text" placeholder="URL da imagem 1">
                    <input type="text" placeholder="Resposta incorreta 2">
                    <input type="text" placeholder="URL da imagem 2">
                    <input type="text" placeholder="Resposta incorreta 3">
                    <input type="text" placeholder="URL da imagem 3">
                </div>
            </li>
            `
        } else {
            formularioPerguntas.innerHTML += `
                <li>
                    <p>Pergunta ${i+1}</p>
                    <img class="icone" onclick="maximizarPergunta(this, 'perguntas')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                    <div class="maximizado escondido">
                        <input type="text" placeholder="Texto da pergunta">
                        <input type="text" placeholder="Cor de fundo da pergunta">
                        <p>Resposta correta</p>
                        <input type="text" placeholder="Resposta correta">
                        <input type="text" placeholder="URL da imagem">
                        <p>Respostas incorretas</p>
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </li>
            `
        }
    }
}

function informacoesValidas(titulo, url, numPerguntas, numNiveis) {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (titulo.length < 20 || titulo.length > 65) {
        return false;
    }
    if (parseInt(numPerguntas) < 3) {
        return false;
    }
    if (parseInt(numNiveis) < 2) {
        return false;
    }
    return regexp.test(url);
}

function verificarInfoBasicas() {
    const titulo = document.querySelector(".informacoes-basicas input:nth-child(1)").value;
    const url = document.querySelector(".informacoes-basicas input:nth-child(2)").value;
    const numPerguntas = document.querySelector(".informacoes-basicas input:nth-child(3)").value;
    const numNiveis = document.querySelector(".informacoes-basicas input:nth-child(4)").value;
    if (informacoesValidas(titulo, url, numPerguntas, numNiveis)) {
        document.querySelector(".informacoes-basicas").classList.add("escondido");
        document.querySelector(".perguntas").classList.remove("escondido");
        preencherPerguntas();
    } else {
        alert("Alguma informação é invalida!!")
    }
}

function prosseguir(fase) {
    if (fase === "pergunta") {
        verificarInfoBasicas();
    }
    if (fase === "nivel") {
        verificarPerguntas();
    }
    if (fase === "finalizar") {
        salvarQuizz();
    }
}

function getQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    console.log("funcionou");
    console.log(promise);
    promise.then(loadQuizzes)
}

function loadQuizzes(quizzes) {
    quizzInfo = quizzes.data;
    const quizzList = document.querySelector(".caixa-quizzes");
    quizzList.innerHTML = "";

    for (let i = 0; i < quizzInfo.length; i++) {
        quizzList.innerHTML += `<div class="quizz-retangulo" style="background-image: url('${quizzInfo[i].image}');><div class="quizz-titulo">${quizzInfo[i].title}</div></div>`;
    }

    console.log("Atualizado");
}