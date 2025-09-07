class AbrigoAnimais {
  
  constructor(){

    this.tabelaAnimais = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    }
    this.brinquedosPossiveis = new Set()
    for (const animalInfo of Object.values(this.tabelaAnimais)){
      for(const brinquedo of animalInfo.brinquedos){
        this.brinquedosPossiveis.add(brinquedo);
      }
    }

  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {

    //PRIMEIRO TRATO AS STRINGS
    const brinquedosUm = brinquedosPessoa1.split(',');
    const brinquedosDois = brinquedosPessoa2.split(',');
    const entradaAnimais = ordemAnimais.split(',');

    //VALIDO AS ENTRADAS
    const erro = this.#validaEntradas(entradaAnimais, brinquedosUm, brinquedosDois);
    if (erro) {
      return erro;
    }

    let adocoes = [];
    let qtdPessoaUm = 0;
    let qtdPessoaDois = 0;
    let adotadosPelaPessoaUm = [];
    let adotadosPelaPessoaDois = [];


    for (const animal of entradaAnimais){
      
      if (animal === 'Loco') {
        continue;
      }
      const animalInfo = this.tabelaAnimais[animal];
      
      //VERIFICO SE ALGUEM PODE ADOTAR O ANIMAL E ADICIONO NA LISTA DE ANIMAIS
      const pessoaUmPode = this.#podeAdotar(brinquedosUm, animalInfo.brinquedos);
      const pessoaDoisPode = this.#podeAdotar(brinquedosDois, animalInfo.brinquedos);
      let destinoFinal = `${animal} - abrigo`;
      if(pessoaUmPode && !pessoaDoisPode && qtdPessoaUm < 3){
        const temConflito = this.#conflitoGato(animalInfo, adotadosPelaPessoaUm);
        if(!temConflito){
          destinoFinal = `${animal} - pessoa 1`;
          qtdPessoaUm++;
          adotadosPelaPessoaUm.push(animal);
        }
      }
      else if(!pessoaUmPode && pessoaDoisPode && qtdPessoaDois < 3){
        const temConflito = this.#conflitoGato(animalInfo, adotadosPelaPessoaDois);
        if(!temConflito){
          destinoFinal = `${animal} - pessoa 2`;
          qtdPessoaDois++;
          adotadosPelaPessoaDois.push(animal);
        }
      }
      adocoes.push(destinoFinal);

    }

    if (entradaAnimais.includes('Loco')){
      
      let pessoaUmPodeLoco = false;
      if (qtdPessoaUm > 0) { 
        pessoaUmPodeLoco = this.#podeAdotarLoco(brinquedosUm); 
      } else {
        pessoaUmPodeLoco = this.#podeAdotar(brinquedosUm, this.tabelaAnimais['Loco'].brinquedos);
      }

      let pessoaDoisPodeLoco = false;
      if (qtdPessoaDois > 0) { 
        pessoaDoisPodeLoco = this.#podeAdotarLoco(brinquedosDois); 
      } else {
        pessoaDoisPodeLoco = this.#podeAdotar(brinquedosDois, this.tabelaAnimais['Loco'].brinquedos);
      }

      let destinoLoco = 'Loco - abrigo';
      if (pessoaUmPodeLoco && !pessoaDoisPodeLoco && qtdPessoaUm < 3) {
        destinoLoco = 'Loco - pessoa 1';
      } else if (pessoaDoisPodeLoco && !pessoaUmPodeLoco && qtdPessoaDois < 3) {
        destinoLoco = 'Loco - pessoa 2';
      }
      
      adocoes.push(destinoLoco);

    }

    const saida = adocoes.sort();
    return { lista: saida };
    
  }


  #podeAdotarLoco(brinquedosPessoa){
    const brinquedosLoco = this.tabelaAnimais['Loco'].brinquedos;
    return brinquedosLoco.every(brinquedo => brinquedosPessoa.includes(brinquedo));
  }

  #conflitoGato(animalInfo, adotadosPessoa){
    if (animalInfo.tipo !== 'gato'){
      return false;
    }
    for (const outroAnimalNome of adotadosPessoa){
      const outroAnimalInfo = this.tabelaAnimais[outroAnimalNome]
      const temBrinquedoEmComum = animalInfo.brinquedos.some(brinquedo =>outroAnimalInfo.brinquedos.includes(brinquedo))
      
      if(temBrinquedoEmComum){
        return true;
      }
      
    } 
    return false;
  }

  #podeAdotar(brinquedosPessoa, brinquedosAnimal){
    let i = 0;
    for (const brinquedo of brinquedosPessoa){
      if (brinquedo === brinquedosAnimal[i]){
        i++;
      }
      if (i === brinquedosAnimal.length){
        break
      }
    }
    return i === brinquedosAnimal.length
  }

  #validaEntradas(entradaAnimais, brinquedosUm, brinquedosDois){

    //VALIDO OS NOMES DOS ANIMAIS
    let nomeInvalido = false;
    if (new Set(entradaAnimais).size !== entradaAnimais.length){
      nomeInvalido = true;
    }
    if (!nomeInvalido){
      for (const animal of entradaAnimais){
        if (this.tabelaAnimais[animal] === undefined){
          nomeInvalido = true;
          break;
        }
      }
    }
    if (nomeInvalido){ return { erro: 'Animal inválido' }; }

    // VALIDO OS BRINQUEDOS 
    let brinquedoInvalido = false;
    if (new Set(brinquedosUm).size !== brinquedosUm.length){
      brinquedoInvalido = true;
    }
    if (new Set(brinquedosDois).size !== brinquedosDois.length){
      brinquedoInvalido = true;
    }
    if (!brinquedoInvalido){
      for (const brinquedo of brinquedosUm) {
        if (!this.brinquedosPossiveis.has(brinquedo)) { 
          brinquedoInvalido = true;
          break;
        }
      }
    }
    if (!brinquedoInvalido) { 
      for (const brinquedo of brinquedosDois) {
        if (!this.brinquedosPossiveis.has(brinquedo)) { 
          brinquedoInvalido = true;
          break;
        }
      }
    }
    if (brinquedoInvalido) { return { erro: 'Brinquedo inválido' }; }

    return null;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
