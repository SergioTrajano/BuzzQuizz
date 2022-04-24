const TEMPO_1S = 1 * 1000;
const QUANT_MINIMA_PERGUNTAS = 3;
const QUANT_MINIMA_NIVEIS = 2;
const TAM_MIN_TITULO_QUIZZ = 20;
const TAM_MAX_TITULO_QUIZZ = 65;
const TAM_MIN_TITULO_NIVEL = 10;
const PORCENTAGEM_MINIMA_NIVEL = 0;
const PORCENTAGEM_MAXIMA_NIVEL = 100;
const TAM_MIN_DESCRICAO = 30;
const TAMANHO_MIN_PERGUNTA = 20;
const testURL = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
const testCor = /^#([0-9a-f]{3}){1,2}$/i;

getQuizzes();

function resetarCriacao() {
    document.querySelector(".finalizado").classList.add("escondido");
    document.querySelector(".informacoes-basicas").classList.remove("escondido");
    const inputs = document.querySelectorAll(".informacoes-basicas input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        inputs[i].style.background = "#FFFFFF";
        if (i === 0) {
            inputs[i].placeholder = "Título do seu quizz";
        }
        if (i === 1) {
            inputs[i].placeholder = "URL da imagem do seu quizz";
        }
        if (i === 2) {
            inputs[i].placeholder = "Quantidade de perguntas do quizz";
        }
        if (i === 3) {
            inputs[3].placeholder = "Quantidade de níveis do quizz";
        } 
    }
}

function atualizarQuizz(response) {
    loadQuizzes(response);
    document.querySelector(".criacao-de-quizz").classList.add("escondido");
    document.querySelector(".conteudo").classList.remove("escondido");
}

function atualizarTela1() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promisse.then(atualizarQuizz);
}

function retornarHome(tela) {
    if (tela === "criacao-de-quizz") {
        atualizarTela1();
    }
    if (tela === "exibir-quizz") {
        document.querySelector(".exibir-quizz").classList.add("escondido");
        document.querySelector(".conteudo").classList.remove("escondido");
    }
}

function scrollarProx(elemento) {
    elemento.scrollIntoView();
}

function mostrarResultado(niveis, resultado) {
    niveis.classList.remove("escondido");
    scrollarProx(resultado);
}

function ativarFinal(listaQuestoes) {
    const quantRespondido = document.querySelectorAll(".respondido");
    const acerto = document.querySelectorAll(".acerto");
    let percent = 0;
    const resultado = document.querySelector(".resultado");
    const niveis = document.querySelectorAll(".fim-Quizz");
    if (quantRespondido.length === listaQuestoes.length) {
        resultado.classList.remove("escondido");
        if (acerto.length !== undefined) {
            percent = 100 * acerto.length / listaQuestoes.length;
        }
        for (let i = niveis.length-1; i >= 0; i--) {
            if (Math.ceil(percent) >= Number(niveis[i].querySelector("spam").innerHTML)) {
                niveis[i].querySelector("spam").innerHTML = percent.toFixed(0);
                setTimeout(mostrarResultado, TEMPO_1S, niveis[i], resultado);
                break;
            }
        }
    }
}

function verificarResposta(opcao) {
    const question = opcao.parentNode.parentNode.querySelectorAll(".opcao");
    const questaoSelecionada = opcao.parentNode.parentNode.parentNode;
    questaoSelecionada.classList.add("respondido");
    if (opcao.parentNode.classList.contains("true")) {
        questaoSelecionada.classList.add("acerto");
    }
    const listaQuestoes = document.querySelectorAll(".question");
    for (let i = 0; i < question.length; i++) {
        if (opcao.parentNode.innerHTML !== question[i].innerHTML) {
            question[i].querySelector("div").classList.remove("escondido");
        }
        if (question[i].classList.contains("true")) {
            question[i].querySelector("p").style.color = "#009C22";
        }
        if (question[i].classList.contains("false")) {
            question[i].querySelector("p").style.color = "#FF4B4B";
        }
    }
    for (let j = 0; j < listaQuestoes.length; j++) {
        if (!listaQuestoes[j].classList.contains("respondido")) {
            setTimeout(scrollarProx, TEMPO_1S, listaQuestoes[j]);
            break;
        }
    }
    ativarFinal(listaQuestoes);
}

function ordenarNiveis(niveisOrdenados, porcentagens, niveis) {
    for (let i = 0; i < porcentagens.length; i++) {
        if (niveis[i].minValue === porcentagens[niveisOrdenados.length]) {
            return niveis[i];
        }
    }
}

function renderizarFimQuizz(niveis, id) {
    let porcentagens = [];
    for (let i = 0; i < niveis.length; i++) {
        porcentagens[porcentagens.length] = niveis[i].minValue;
    }
    porcentagens.sort();
    const niveisOrdenados = [];
    for (let j = 0; j < niveis.length; j++) {
        niveisOrdenados[niveisOrdenados.length] = ordenarNiveis(niveisOrdenados, porcentagens, niveis);
    }
    const pergunta = document.querySelector(".exibir-quizz > div:last-child");
    pergunta.innerHTML += `
        <div class="resultado escondido"></div>
    `;
    const telaFinal = pergunta.querySelector(".resultado");
    for(let k = 0; k < niveis.length; k++) {
        telaFinal.innerHTML += `
            <div class="escondido fim-Quizz">
                <div>
                    <spam>${niveisOrdenados[k].minValue}</spam>% de acerto:&nbsp<span>${niveisOrdenados[k].title}</span>
                </div>
                <div>
                    <img src="${niveisOrdenados[k].image}" alt="" style="object-fit: cover">
                    <p>${niveisOrdenados[k].text}</p>
                </div>
            </div>
        `;
    }
    document.querySelector(".exibir-quizz").innerHTML +=  `
        <div class="prosseguir" onclick="jogarQuizz(${id}, 'exibir-quizz')">
            Reiniciar Quizz
        </div>
        <div onclick="retornarHome('exibir-quizz')">
            Voltar pra home
        </div>
    `;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderizarQuizz(response) {
    document.querySelector(".exibir-quizz").classList.remove("escondido");
    let respostas;
    const exibir = document.querySelector(".exibir-quizz");
    exibir.innerHTML = `
        <div class="banner">
            <img src="${response.data.image}" alt="" style="width: 100%; object-fit: cover;">
            <div class="fundo">
                <p>${response.data.title}</p>
            </div>
        </div>
        <div></div>
    `;
    const pergunta = document.querySelector(".exibir-quizz > div:nth-child(2)");
    for (let i = 0; i < response.data.questions.length; i++) {
        respostas = response.data.questions[i].answers;
        shuffle(respostas);
        pergunta.innerHTML += `
            <div class="question">
                <div>
                    ${response.data.questions[i].title}
                </div>
                <div>
                </div>
            </div>
        `;
        pergunta.querySelector(`.question:nth-child(${i+1}) div:first-child`).style.background = response.data.questions[i].color;
        for (let j = 0; j < respostas.length; j++) {
            pergunta.querySelector(`.question:nth-child(${i+1}) div:last-child`).innerHTML += `
                <div class="opcao ${respostas[j].isCorrectAnswer}">
                    <img onclick="verificarResposta(this)" src="${respostas[j].image}" alt="" style=" object-fit: cover;">
                    <p onclick="verificarResposta(this)">${respostas[j].text}</p>
                    <div class="escondido"></div>
                </div>
            `
        }  
    }
    scrollarProx(document.querySelector(".exibir-quizz .banner"));
    renderizarFimQuizz(response.data.levels, response.data.id);
}

function jogarQuizz(id, tela) {
    document.querySelector(`.${tela}`).classList.add("escondido");
    if (tela === "criacao-de-quizz") {
        getQuizzes();
    }
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promisse.then(renderizarQuizz);
    promisse.catch(tratarErro);
}

function tratarErro() {
    alert("Houve algum erro no processo!");
}

function concluirCriacao(response) {
    getQuizzes();
    let userId = localStorage.getItem("ids");
    userId = JSON.parse(userId);
    userId[userId.length] = response.data.id;
    userId = JSON.stringify(userId);
    localStorage.removeItem("ids");
    localStorage.setItem("ids", userId);
    document.querySelector(".finalizado").innerHTML = `
        <p>Seu quizz está pronto!</p>
        <div onclick="jogarQuizz(${response.data.id}, 'criacao-de-quizz')">
            <img src="${response.data.image}" alt="">
            <p>${response.data.title}</p>
            <div class="gradiente"></div>
        </div>
        <div class="prosseguir" onclick="jogarQuizz(${response.data.id}, 'criacao-de-quizz')">
            Acessar Quizz
        </div>
        <div onclick="retornarHome('criacao-de-quizz')">
            Voltar pra home
        </div>
    `;
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
    };
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
            };
        }
    }
    return {
        title: titulo,
        color: cor,
        answers: opcoes
    };
}

function retornarPerguntas() {
    const questions = [];
    const numPerguntas = parseInt(document.querySelector(".informacoes-basicas input:nth-child(3)").value);
    for (let i = 1; i <= numPerguntas; i++) {
        questions[i-1] = acharPergunta(i);
    }
    return questions;
}

function validarNiveis() {
    const numNiveis = parseInt(document.querySelector(".informacoes-basicas input:last-child").value);
    let tituloNivel;
    let porcent;
    let url;
    let descricao;
    let porcetZero = false;
    let resposta = true;
    for (let i = 1; i <= numNiveis; i++) {
        tituloNivel = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(1)`);
        porcent = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(2)`);
        url = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(3)`);
        descricao = document.querySelector(`.niveis li:nth-child(${i}) input:nth-child(4)`);
        if (tituloNivel.value.length < TAM_MIN_TITULO_NIVEL) {
            tituloNivel.value = "";
            tituloNivel.placeholder = `O título do nível deve ter no mínimo ${TAM_MIN_TITULO_NIVEL} caracteres!`;
            tituloNivel.style.background = "#FFE9E9";
            resposta = false;
        } else {
            tituloNivel.style.background = "#FFFFFF";
        }
        if (parseInt(porcent.value) < PORCENTAGEM_MINIMA_NIVEL || parseInt(porcent.value) > PORCENTAGEM_MAXIMA_NIVEL || isNaN(parseInt(porcent.value))) {
            porcent.value = "";
            porcent.style.background = "#FFE9E9";
            porcent.placeholder = "A porcentagem deve ser entre 0 e 100!";
            resposta = false;
        } else {
            porcent.style.background = "#FFFFFF";
        }
        if (parseInt(porcent.value) === PORCENTAGEM_MINIMA_NIVEL) {
            porcetZero = true;
        }
        if (!testURL.test(url.value)) {
            url.value = "";
            url.style.background = "#FFE9E9";
            if (url.value !== "") {
                url.placeholder = "Url inválida!";
            }
            if (url.value === "") {
                url.placeholder = "Informe uma Url válida!";
            }
            resposta = false;
        } else {
            url.style.background = "#FFFFFF";
        }
        if (descricao.value.length < TAM_MIN_DESCRICAO) {
            descricao.value = "";
            descricao.style.background = "#FFE9E9";
            descricao.placeholder = `A descrição deve ter no minímo ${TAM_MIN_DESCRICAO} caracteres!`;
            resposta = false;
        } else {
            descricao.style.background = "#FFFFFF";
        }
    }
    if (!porcetZero) {
        resposta = false;
        alert("Deve haver pelo menos um nível com porcentagem igual a 0");
    }
    if (resposta === false) {
        alert("Há algum dado inválido!");
    }
    return resposta;
}

function salvarQuizz() {
    if (validarNiveis()) {
        const quizz = {
            title: document.querySelector(".informacoes-basicas input:first-child").value,
            image: document.querySelector(".informacoes-basicas input:nth-child(2)").value,
            questions: retornarPerguntas(),
            levels: retornarNiveis()
        };
        const promisse = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", quizz);
        promisse.then(concluirCriacao);
        promisse.catch(tratarErro);
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
                    <img class="icone escondido" onclick="maximizarItem(this, 'niveis')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                    <div class="maximizado">
                        <input type="text" placeholder="Título do nível">
                        <input type="number" placeholder="% de acerto mínima">
                        <input type="text" placeholder="URL da imagem do nível">
                        <input type="text" placeholder="Descrição do nível">
                    </div>
                </li>
            `;
        } else {
            listaNiveis.innerHTML += `
                <li>
                    <p>Nivel ${i+1}</p>
                    <img class="icone" onclick="maximizarItem(this, 'niveis')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
                    <div class="maximizado escondido">
                        <input type="text" placeholder="Título do nível">
                        <input type="text" placeholder="% de acerto mínima">
                        <input type="text" placeholder="URL da imagem do nível">
                        <input type="text" placeholder="Descrição do nível">
                    </div>
                </li>
            `;
        }
    }
}

function validarPerguntas() {
    let textoPergunta;
    let corFundo;
    let textoResposta;
    let urlResposta;
    let textoErro;
    let urlErro;
    let retorno = true;
    let quantRespostaErrado;
    const numPerguntas = document.querySelector(".informacoes-basicas input:nth-child(3)");
    for (let i = 1; i <= parseInt(numPerguntas.value); i++) {
        textoPergunta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(1)`);
        corFundo = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(2)`);
        textoResposta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(4)`);
        urlResposta = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(5)`);
        if (textoPergunta.value.length < TAMANHO_MIN_PERGUNTA) {
            textoPergunta.value = "";
            textoPergunta.style.background = "#FFE9E9";
            textoPergunta.placeholder = `O titulo deve ter no minimo ${TAMANHO_MIN_PERGUNTA} caracteres!`;
            retorno = false;
        } else {
            textoPergunta.style.background = "#FFFFFF";
        }
        if (!testCor.test(corFundo.value.toUpperCase())) {
            corFundo.value = "";
            corFundo.style.background = "#FFE9E9";
            corFundo.placeholder = "A cor deve ser uma cor hexadecimal!";
            retorno = false;
        } else {
            corFundo.style.background = "#FFFFFF";
        }
        if (textoResposta.value === "") {
            textoResposta.value = "";
            textoResposta.style.background = "#FFE9E9";
            textoResposta.placeholder = "O quizz deve ter uma resposta correta...";
            retorno = false;
        } else {
            textoResposta.style.background = "#FFFFFF";
        }
        if (!testURL.test(urlResposta.value)) {
            urlResposta.value = "";
            urlResposta.style.background = "#FFE9E9";
            if (testURL.value !== "") {
                testURL.placeholder = "Url inválida!";
            }
            if (testURL.value === "") {
                testURL.placeholder = "Informe uma Url válida!";
            }
            retorno = false;
        } else {
            urlResposta.style.background = "#FFFFFF";
        }
        for (let j = 7; j < 12; j+=2) {
            textoErro = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(${j})`);
            urlErro = document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(${j+1})`);
            if (!testURL.test(urlErro.value) && urlErro.value.length > 0) {
                urlErro.value = "";
                urlErro.style.background = "#FFE9E9";
                if (urlErro.value !== "") {
                    urlErro.placeholder = "Url inválida!";
                }
                if (urlErro.value === "") {
                    urlErro.placeholder = "Informe uma Url válida!";
                }
                retorno = false;
            } else {
                urlErro.style.background = "#FFFFFF";
            }
            if (textoErro.value !== "" && !testURL.test(urlErro.value)) {
                urlErro.value = "";
                urlErro.style.background = "#FFE9E9";
                if (urlErro.value !== "") {
                    urlErro.placeholder = "Url inválida!";
                }
                if (urlErro.value === "") {
                    urlErro.placeholder = "Informe uma Url válida!";
                }
                retorno = false;
            } else {
                urlErro.style.background = "#FFFFFF";
            }
        }
        if (document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(7)`).value === "" && document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(9)`).value === "" && document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(11)`).value === "") {
            document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(7)`).style.background = "#FFE9E9";
            document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(8)`).style.background = "#FFE9E9";
            quantRespostaErrado = 0;
            retorno = false;
        } else {
            document.querySelector(`.perguntas li:nth-child(${i}) .maximizado input:nth-child(7)`).style.background = "#FFFFFF";
        }
    } 
    if (quantRespostaErrado === 0) {
        alert("Deve haver pelo menos uma resposta errada para cada pergunta!");
    }
    if (retorno === false) {
        alert("Há algum dado inválido!");
    }
    return retorno;
}

function verificarPerguntas() {
    if (validarPerguntas()) {
        document.querySelector(".perguntas").classList.add("escondido");
        document.querySelector(".niveis").classList.remove("escondido");
        document.querySelector(".niveis").scrollIntoView();
        preencherNiveis();
    }
}

function maximizarItem(elemento, fase) {
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
    scrollarProx(elemento.parentNode);
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
                <img class="icone escondido" onclick="maximizarItem(this, 'perguntas')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
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
            `;
        } else {
            formularioPerguntas.innerHTML += `
                <li>
                    <p>Pergunta ${i+1}</p>
                    <img class="icone" onclick="maximizarItem(this, 'perguntas')" src="Vector.png" alt="" style="width: 26px; height: 23px;">
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
            `;
        }
    }
}

function informacoesValidas(titulo, url, numPerguntas, numNiveis) {
    let resposta = true;
    if (titulo.value.length < TAM_MIN_TITULO_QUIZZ || titulo.length > TAM_MAX_TITULO_QUIZZ) {
        titulo.value = "";
        titulo.style.background = "#FFE9E9";
        titulo.placeholder = `O título do quizz deve ter entre ${TAM_MIN_TITULO_QUIZZ} e ${TAM_MAX_TITULO_QUIZZ} caracteres!`;
        resposta = false;
    } else {
        titulo.style.background = "#FFFFFF";
    }
    if (parseInt(numPerguntas.value) < QUANT_MINIMA_PERGUNTAS || isNaN(parseInt(numPerguntas.value))) {
        numPerguntas.value = "";
        numPerguntas.style.background = "#FFE9E9";
        numPerguntas.placeholder = `Deve haver no minímo ${QUANT_MINIMA_PERGUNTAS} perguntas!`;
        resposta = false;
    } else {
        numPerguntas.style.background = "#FFFFFF";
    }
    if (parseInt(numNiveis.value) < QUANT_MINIMA_NIVEIS || isNaN(parseInt(numNiveis.value))) {
        numNiveis.value = "";
        numNiveis.style.background = "#FFE9E9";
        numNiveis.placeholder = `Deve haver no minímo ${QUANT_MINIMA_NIVEIS} níveis!`;
        resposta = false;
    } else {
        numNiveis.style.background = "#FFFFFF";
    }
    if (!testURL.test(url.value)) {
        url.value = "";
        url.style.background = "#FFE9E9";
        if (url.value !== "") {
            url.placeholder = "Url inválida!";
        }
        if (url.value === "") {
            url.placeholder = "Informe uma Url válida!";
        }
        resposta = false;
    } else {
        url.style.background = "#FFFFFF";
    }
    return resposta;
}

function verificarInfoBasicas() {
    const titulo = document.querySelector(".informacoes-basicas input:nth-child(1)");
    const url = document.querySelector(".informacoes-basicas input:nth-child(2)");
    const numPerguntas = document.querySelector(".informacoes-basicas input:nth-child(3)");
    const numNiveis = document.querySelector(".informacoes-basicas input:nth-child(4)");
    if (informacoesValidas(titulo, url, numPerguntas, numNiveis)) {
        document.querySelector(".informacoes-basicas").classList.add("escondido");
        document.querySelector(".perguntas").classList.remove("escondido");
        document.querySelector(".perguntas").scrollIntoView();
        preencherPerguntas();
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
    promise.then(loadQuizzes);
}

function atualizarQuizzUsuario(response) {
    const quizzUsuario = document.querySelector(".caixa-usuario");
    quizzUsuario.innerHTML += `
        <div class="quizz-retangulo" onclick="jogarQuizz(${response.data.id}, 'conteudo')" style="background-image: url('${response.data.image}');">
            <div class="quizz-titulo">${response.data.title}</div>
        </div>
    `;
}

function verificarId(id) {
    let userIds = localStorage.getItem("ids");
    userIds = JSON.parse(userIds);
    if (userIds === null) {
        userIds = [];
    }
    for (let i = 0; i < userIds.length; i++) {
        if (id === userIds[i]) {
            return false;
        }
    }
    return true;
}

function loadQuizzes(quizzes) {
    const quizzInfo = quizzes.data;
    let userIds = localStorage.getItem("ids");
    userIds = JSON.parse(userIds);
    if (userIds === null) {
        userIds = [];
    }
    const quizzList = document.querySelector(".caixa-quizzes");
    const quizzUsuario = document.querySelector(".caixa-usuario");
    let promisse;
    quizzList.innerHTML = "";
    quizzUsuario.innerHTML = "";
    for (let i = 0; i < quizzInfo.length; i++) {
        if (verificarId(quizzInfo[i].id)) {
            quizzList.innerHTML += `
            <div class="quizz-retangulo" onclick="jogarQuizz(${quizzInfo[i].id}, 'conteudo')" style="background-image: url('${quizzInfo[i].image}');">
                <div class="quizz-titulo">${quizzInfo[i].title}</div>
            </div>
        `;
        }
    }
    for (let j = userIds.length-1; j >=0; j--) {
        promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${userIds[j]}`);
        promisse.then(atualizarQuizzUsuario);
        promisse.catch(tratarErro);
    }
    if (userIds.length > 0) {
        document.querySelector(".criar-quizz").classList.add("escondido");
        quizzUsuario.parentNode.classList.remove("escondido");
    } else {
        document.querySelector(".criar-quizz").classList.remove("escondido");
        quizzUsuario.parentNode.classList.add("escondido");
    } 
}

function transicaoParaCriacao() {
    document.querySelector(".conteudo").classList.add("escondido");
    document.querySelector(".criacao-de-quizz").classList.remove("escondido");
    resetarCriacao();
}