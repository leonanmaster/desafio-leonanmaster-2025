class AbrigoAnimais {
  constructor() {
    this.tabelaAnimais = {
      Rex: { tipo: "cão", brinquedos: ["RATO", "BOLA"] },
      Mimi: { tipo: "gato", brinquedos: ["BOLA", "LASER"] },
      Fofo: { tipo: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
      Zero: { tipo: "gato", brinquedos: ["RATO", "BOLA"] },
      Bola: { tipo: "cão", brinquedos: ["CAIXA", "NOVELO"] },
      Bebe: { tipo: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
      Loco: { tipo: "jabuti", brinquedos: ["SKATE", "RATO"] },
    };
    this.brinquedosPossiveis = new Set();
    for (const animalInfo of Object.values(this.tabelaAnimais)) {
      for (const brinquedo of animalInfo.brinquedos) {
        this.brinquedosPossiveis.add(brinquedo);
      }
    }
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    //PRIMEIRO TRATO AS STRINGS
    const brinquedosUm = brinquedosPessoa1.split(",");
    const brinquedosDois = brinquedosPessoa2.split(",");
    const entradaAnimais = ordemAnimais.split(",");

    //VALIDO AS ENTRADAS
    const erro = this.#validaEntradas(
      entradaAnimais,
      brinquedosUm,
      brinquedosDois
    );
    if (erro) {
      return erro;
    }

    let adocoes = [];
    let adotadosPelaPessoaUm = [];
    let adotadosPelaPessoaDois = [];

    //TESTO E DECIDO CADA ANIMAL (MENOS O LOCO)
    for (const animal of entradaAnimais) {
      if (animal === "Loco") {
        continue;
      }
      const animalInfo = this.tabelaAnimais[animal];

      //VERIFICO SE ALGUEM PODE ADOTAR O ANIMAL E ADICIONO NA LISTA DE ANIMAIS
      const pessoaUmPode = this.#podeAdotar(
        brinquedosUm,
        animalInfo.brinquedos
      );
      const pessoaDoisPode = this.#podeAdotar(
        brinquedosDois,
        animalInfo.brinquedos
      );
      let destinoFinal = `${animal} - abrigo`;

      if (pessoaUmPode && !pessoaDoisPode && adotadosPelaPessoaUm.length < 3) {
        const temConflito = this.#conflitoGato(
          animalInfo,
          adotadosPelaPessoaUm
        );
        if (!temConflito) {
          destinoFinal = `${animal} - pessoa 1`;
          adotadosPelaPessoaUm.push(animal);
        }
      } else if (
        !pessoaUmPode &&
        pessoaDoisPode &&
        adotadosPelaPessoaDois.length < 3
      ) {
        const temConflito = this.#conflitoGato(
          animalInfo,
          adotadosPelaPessoaDois
        );
        if (!temConflito) {
          destinoFinal = `${animal} - pessoa 2`;
          adotadosPelaPessoaDois.push(animal);
        }
      }
      adocoes.push(destinoFinal);
    }

    // PARA O LOCO
    if (entradaAnimais.includes("Loco")) {
      let pessoaUmPodeLoco = false;
      if (adotadosPelaPessoaUm.length > 0) {
        pessoaUmPodeLoco = this.#podeAdotarLoco(brinquedosUm);
      } else {
        pessoaUmPodeLoco = this.#podeAdotar(
          brinquedosUm,
          this.tabelaAnimais["Loco"].brinquedos
        );
      }

      let pessoaDoisPodeLoco = false;
      if (adotadosPelaPessoaDois.length > 0) {
        pessoaDoisPodeLoco = this.#podeAdotarLoco(brinquedosDois);
      } else {
        pessoaDoisPodeLoco = this.#podeAdotar(
          brinquedosDois,
          this.tabelaAnimais["Loco"].brinquedos
        );
      }

      let destinoLoco = "Loco - abrigo";
      if (
        pessoaUmPodeLoco &&
        !pessoaDoisPodeLoco &&
        adotadosPelaPessoaUm.length < 3
      ) {
        destinoLoco = "Loco - pessoa 1";
      } else if (
        pessoaDoisPodeLoco &&
        !pessoaUmPodeLoco &&
        adotadosPelaPessoaDois.length < 3
      ) {
        destinoLoco = "Loco - pessoa 2";
      }

      adocoes.push(destinoLoco);
    }

    const saida = adocoes.sort();
    return { lista: saida };
  }

  #podeAdotarLoco(brinquedosPessoa) {
    const brinquedosLoco = this.tabelaAnimais["Loco"].brinquedos;
    return brinquedosLoco.every((brinquedo) =>
      brinquedosPessoa.includes(brinquedo)
    );
  }

  // TESTA SE O ANIMAL DA VEZ (GATO) POSSUI BRINQUEDO EM COMUM COM ALGUM JA ADOTADO
  #conflitoGato(animalInfo, adotadosPessoa) {
    if (animalInfo.tipo !== "gato") {
      return false;
    }
    for (const outroAnimalNome of adotadosPessoa) {
      const outroAnimalInfo = this.tabelaAnimais[outroAnimalNome];
      const temBrinquedoEmComum = animalInfo.brinquedos.some((brinquedo) =>
        outroAnimalInfo.brinquedos.includes(brinquedo)
      );

      if (temBrinquedoEmComum) {
        return true;
      }
    }
    return false;
  }

  #podeAdotar(brinquedosPessoa, brinquedosAnimal) {
    let i = 0;
    for (const brinquedo of brinquedosPessoa) {
      if (brinquedo === brinquedosAnimal[i]) {
        i++;
      }
      if (i === brinquedosAnimal.length) {
        break;
      }
    }
    return i === brinquedosAnimal.length;
  }

  #validaEntradas(entradaAnimais, brinquedosUm, brinquedosDois) {
    //VALIDO OS NOMES DOS ANIMAIS

    if (new Set(entradaAnimais).size !== entradaAnimais.length) {
      return { erro: "Animal inválido" };
    }
    for (const animal of entradaAnimais) {
      if (this.tabelaAnimais[animal] === undefined) {
        return { erro: "Animal inválido" };
      }
    }

    // VALIDO OS BRINQUEDOS

    if (new Set(brinquedosUm).size !== brinquedosUm.length) {
      return { erro: "Brinquedo inválido" };
    }
    if (new Set(brinquedosDois).size !== brinquedosDois.length) {
      return { erro: "Brinquedo inválido" };
    }

    for (const brinquedo of brinquedosUm) {
      if (!this.brinquedosPossiveis.has(brinquedo)) {
        return { erro: "Brinquedo inválido" };
      }
    }

    for (const brinquedo of brinquedosDois) {
      if (!this.brinquedosPossiveis.has(brinquedo)) {
        return { erro: "Brinquedo inválido" };
      }
    }

    return null;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
