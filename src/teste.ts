const createdDate = new Date().toLocaleDateString('pt-BR'); // Data atual, APENAS O Dia/Mes/Ano, SEM o Horário !! <<
console.log(createdDate);

const teste = new Date()
console.log(teste);

const teste2 = teste.setMinutes(teste.getMinutes());
console.log(teste2);

const teste3 = teste.setMinutes(teste.getMinutes() + 2);
console.log(teste3)

if(teste2 < teste3){ // FAZER ISSO NA DB E TESTAR PRA VER SE TA CERTO !! <<
    console.log('MENOR !!');
}

else{
    console.log('IGUAIS !!');
}

// const teste2 = teste.getMinutes();
// console.log(teste2)