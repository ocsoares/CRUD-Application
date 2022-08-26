const getUsername = document.getElementById('user') as HTMLInputElement;
const getEmail = document.getElementById('email') as HTMLInputElement;
const getPassword = document.getElementById('register-pass') as HTMLInputElement;
const getConfirmationPassword = document.getElementById('confirmation-pass') as HTMLInputElement;
// const getForm = document.getElementById('form') as HTMLInputElement;

const setSuccessHTML = (input: any) => {
    const formInput = input.parentElement // Pega a Classe PAI (HTML) do Input Especificado !! <<

        // Adicionando a Classe de Success !! <<
    formInput.className = 'form-input success'
}

const setErrorHTML = (input: any) => {
    const formInput = input.parentElement

    // Adicionando a Mensagem de Erro !! <<

    formInput.className = 'form-input error'
}

const backspaceGetUsername = () => getUsername.addEventListener('keyup', anykey => {
    let usernameLenght = getUsername.value.length

    if (usernameLenght >= 0 && usernameLenght <= 7 && anykey.key === 'Backspace') {
        setErrorHTML(getUsername);
    }
})
    
const validateEmail = (mail: any) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

const backspaceEmail = () => getEmail.addEventListener('keyup', anykey => {
    let emailLenght = getEmail.value.length

    if(anykey.key === 'Backspace' && !validateEmail(getEmail)){
        setErrorHTML(getEmail);
        emailLenght -= 1;        
    }
})


const backspacePassword = () => getPassword.addEventListener('keyup', anykey => {
    let passwordLenght = getPassword.value.length

    if(anykey.key === 'Backspace' && passwordLenght < 7){
        setErrorHTML(getPassword);
        passwordLenght -= 1;
    }
})

const blockEnterConfirmPassword = () => getConfirmationPassword.addEventListener('keypress', anykey => {

    let lenghtConfirmPassword = getConfirmationPassword.value.length

    let valueConfirmPassword = getConfirmationPassword.value
    let valuePassword = getPassword.value

    if(anykey.key === 'Enter' && lenghtConfirmPassword < 7){
        anykey.preventDefault();
    }

    if(anykey.key === 'Enter' && valueConfirmPassword !== valuePassword){
        anykey.preventDefault();
    }
})

const checkInputs = () => {

    backspaceGetUsername();
    
    getUsername.addEventListener('keypress', anykey => {
        // O const usernameValue.lenght NÃO FUNCIONA porque ele é const, ÓBVIO !!!! <<

        const keyValue = anykey.key;

        const usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i // Esse Regex só Permite Letras de a-z A-Z, Espaço e Acentuação nos Caracteres (ó, ã, ...) !! <<

        let usernameLenght = getUsername.value.length;

        if(keyValue === 'Enter'){ // Retira o Espaço Automático do 'Enter' !! <<
            usernameLenght -= 1;
            if(usernameLenght <= 5){ // Se o Lenght for MENOR que Determinada Condição, BLOQUEIA o ENTER !! <<
                anykey.preventDefault();
            }
        }

        if(!keyValue.toString().match(usernameRegex)){
            anykey.preventDefault();
            usernameLenght -= 1;
        }
        if(usernameLenght <= 5){
            setErrorHTML(getUsername);
        }
        else{
            setSuccessHTML(getUsername);
        }

    })

        // NÃO ficou Totalmente Validado !! <<
    getEmail.addEventListener('keypress', anykey => {

        backspaceEmail();

        let emailLenght = getEmail.value.length

        const keyValue = anykey.key
        
        if(keyValue === 'Enter'){
            emailLenght -= 1;
            if(!validateEmail(getEmail.value)){
                anykey.preventDefault();
            }
        }

        if(keyValue === ' '){
            anykey.preventDefault();
            emailLenght -= 1;
        }
        
        if(!validateEmail(getEmail.value)){
            setErrorHTML(getEmail);
        }
        else{
            setSuccessHTML(getEmail);
        }
    })

    getPassword.addEventListener('keypress', anykey => {

        backspacePassword();

        let passwordLenght = getPassword.value.length;

        if(passwordLenght < 6){
            setErrorHTML(getPassword);
        }
        else{
            setSuccessHTML(getPassword);
        }
    })

        // Tentar acessar o lenght do Password normal NESSA ConfirmationPassword !! <<<
    getConfirmationPassword.addEventListener('keyup', anykey => { // Por algum motivo, o keypress NÃO funcinou, sempre Tirava UM CHARACTER, o keyup DEU CERTO !! <<

            blockEnterConfirmPassword();

            let finalPassword = getPassword.value
            let finalConfirmPassword = getConfirmationPassword.value

            if(finalConfirmPassword.length < 7){
                setErrorHTML(getConfirmationPassword);
            }

            else if(finalConfirmPassword === finalPassword){
                setSuccessHTML(getConfirmationPassword);
            }
            
            else{
                setErrorHTML(getConfirmationPassword);
            }
    })    
}

    checkInputs();

    // Função para DESABILITAR o CONTROL + V (Colar = paste) e Movimentar o Valor de um Input para OUTRO Input (drop) !! << 
const disablePasteAndDrop = (HTMLInput: HTMLInputElement) => {
    
        HTMLInput.addEventListener('paste', anykey => {
            anykey.preventDefault();
        })
    
        HTMLInput.addEventListener('drop', anykey => {
            anykey.preventDefault();
        })
}

disablePasteAndDrop(getUsername);
disablePasteAndDrop(getEmail);
disablePasteAndDrop(getPassword);
disablePasteAndDrop(getConfirmationPassword);

    // Checa de está tudo VERDE, se tiver, LIBERA o ENTER !! <<
    //  OBS: NÃO CONSEGUI Bloquear o Botão, Pesquisar depois ! <
// getForm.addEventListener('keypress', anykey => {

//     let getAllFormInput: any = getForm.querySelectorAll('.form-input');    

// let checkForm = [...getAllFormInput].every((formInput)  => {
//     if(formInput.className === 'form-input success'){
//         return true;
//     }
// })  

//     if(!checkForm){
//         if(anykey.key === 'Enter'){
//             anykey.preventDefault();   
//         }
//     }
// })