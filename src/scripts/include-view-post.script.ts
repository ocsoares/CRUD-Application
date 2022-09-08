import Swal from "sweetalert2";

// Usar no BABEL e tentar colocar um Intervalo antes de Redirecionar (ver no SweetAlert) !! << NÃO CONSEGUI ISSO PQ N LÊ O Req. e Resp...
// Tentar fazer uma Rota NORMAL após clica em SIM, com document.location.href ALI EMBAIXO !! <<


document.getElementById('delete-post-text')?.addEventListener('click', () => {
    Swal.fire({
        title: 'Você quer mesmo excluir?',
        text: "Pense bem, essa ação não pode ser revertida.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, desejo deletar.',
        cancelButtonText: 'Cancelar'
    }).then((result => {
        if(result.value === true){
            console.log('DELETADO !! KK');
            // document.location.href = '/FODASEKKK'
            
            Swal.fire(
                'Deletado !',
                'Sua postagem foi deletada com sucesso !',
                'success'
            )
        }
    }))
});