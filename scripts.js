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
    if (fase === "nivel") {
        verificaInformacoesBasicas();
    }
}