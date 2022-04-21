function perguntasValidas() {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let textoPergunta;
    let corFundo;
    let textoResposta;
    let urlResposta;
    let textoErro;
    let urlErro;
    const numPerguntas = Number(document.querySelector(".informacoes-basicas input:nth-child(3)").value);
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
            if (corFundo[k] !== 'A' && corFundo[k] !== 'B' && corFundo[k] !== 'C' && corFundo[k] !== 'D' && corFundo[k] !== 'E' && corFundo[k] !== 'F') {
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
    }
    return true;
}

function verificaFormPerguntas() {
    if (perguntasValidas()) {
        document.querySelector(".perguntas").classList.add("escondido");
        document.querySelector(".niveis").remove("escondido");
    } else {
        alert("Há alguma informação invalida!");
    }
}

function maximizaPerguntas(elemento) {
    const maximizar = elemento.parentNode.querySelector(".maximizado");
    const minimizar = document.querySelector(".perguntas .selecionado");
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
    const numPerguntas = Number(document.querySelector(".dados-basicos input:nth-child(3)").value);
    formularioPerguntas.innerHTML = "";
    for (let i = 0; i < numPerguntas; i++) {
        if (i === 0) {
            formularioPerguntas.innerHTML += `
            <li class="selecionado">
                <p>Pergunta 1</p>
                <img class="icone escondido" onclick="maximizaPerguntas(this)" src="Vector.png" alt="" style="width: 26px; height: 23px;">
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
                    <img class="icone" onclick="maximizaPerguntas(this)" src="Vector.png" alt="" style="width: 26px; height: 23px;">
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
    if (Number(numPerguntas) < 3) {
        return false;
    }
    if (Number(numNiveis) < 2) {
        return false;
    }
    return regexp.test(url);
}

function verificaInformacoesBasicas() {
    const titulo = document.querySelector(".informacoes-basicas input:nth-child(1)").value;
    const url = document.querySelector(".informacoes-basicas input:nth-child(2)").value;
    const numPerguntas = document.querySelector(".informacoes-basicas input:nth-child(3)").value;
    const numNiveis = document.querySelector(".informacoes-basicas input:nth-child(4)").value;
    if (informacoesValidas(titulo, url, numPerguntas, numNiveis)) {
        document.querySelector(".informacoes-basicas").classList.add("escondido");
        document.querySelector(".perguntas").classList.remove("escondido");
    } else {
        alert("Alguma informação é invalida!!")
    }
}

function prosseguir(fase) {
    if (fase === "pergunta") {
        preencherPerguntas();
        verificaInformacoesBasicas();
    }
    if (fase === "nivel") {
        verificaFormPerguntas();
    }
}