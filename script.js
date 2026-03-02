const URL_API = 'https://biblioteca-backend-6j95.onrender.com';

// Função de buscar livros
async function carregarLivros() {
    try {
        const resposta = await fetch(URL_API);
        const livros = await resposta.json();

        const corpoTabela = document.querySelector('#tabela-livros tbody');
        corpoTabela.innerHTML = '';

        // Corrigido: usando 'livro' com 'l' minúsculo para bater com o que está dentro do loop
        livros.forEach(livro => {
            const linha = document.createElement('tr');

            // Corrigido: 'toLocaleDateString' com 'L' maiúsculo
            const dataFormatada = new Date(livro.data_publicacao).toLocaleDateString('pt-BR');

            linha.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${dataFormatada}</td>
                                        <td class="acoes-coluna">
                                <button class="btn-edit" onclick="prepararEdicao(${livro.id}, '${livro.titulo}', '${livro.autor}', '${livro.data_publicacao}')">
                                    Editar ✏️
                                </button>
                                <button class="btn-delete" onclick="deletarLivro(${livro.id})">
                                    Excluir 🗑️
                                </button>
                            </td>
            `;
            corpoTabela.appendChild(linha);
        });
    } catch (erro) {
        console.error('Erro ao buscar dados: ', erro);
    }
}

// Função para deletar livro
async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            await fetch(`${URL_API}/${id}`, {
                method: 'DELETE'
            });
            // Recarrega a lista após excluir
            carregarLivros();
        } catch (erro) {
            console.error('Erro ao deletar', erro);
        }
    }
}

async function cadastrarLivro() {
    const titulo =document.getElementById('titulo').value;
    const autor =document.getElementById('autor').value;
    const data_publicacao = document.getElementById('data_publicacao').value;

    if (!titulo || !autor || !data_publicacao){
        alert("Por favor, preencha todos os campos!!!");
        return;
    }
    try{
        const resposta = await fetch(URL_API,{
            method: 'POST',
            headers:{
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo:titulo,
                autor:autor,
                data_publicacao:data_publicacao
            })

        });
        if (resposta.ok){
            //limpa os campos e recarrega tablea
            document.getElementById('titulo').value = '';
            document.getElementById('autor').value = '';
            document.getElementById('data_publicacao').value = '';

            alert("Livro Cadastrado com Sucesso!");
            carregarLivros();
        }
    }catch(erro){
        console.error('Erro ao cadastrar Livro', erro);
    }
    
}


//funcao coloca os dados do livro de volta para formulario

function prepararEdicao(id,titulo,autor,data){
    document.getElementById('livro-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('autor').value = autor;

    const dataIso = new Date(data).toISOString().split('T')[0];
    document.getElementById('data_publicacao').value = dataIso;
    

    document.querySelector('.btn-save').innerText = "Atualizar Livro";
}

//modificar funcao cadastrar livro p ela tambem atualizar

async function salvarlivro() {

    const id = document.getElementById('livro-id').value;
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data_publicacao = document.getElementById('data_publicacao').value;


    if (!titulo || !autor || !data_publicacao){
        alert("Preencha tudo!");
        return;
    }
    
    const dataInserida = new Date(data_publicacao);
    const dataHoje = new Date();

    if (dataInserida > dataHoje) {
        alert("Ei! O livro não pode ter sido publicado no futuro! 🚀⏳");
        return; // IMPORTANTE: Esse return faz o código parar aqui!
    }



    const dados = {titulo,autor,data_publicacao};

        try{
            let resposta;
            if(id){
                //se tem ID usamos o metodo PUT p editar

                resposta = await fetch(`${URL_API}/${id}`,{
                   method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
                });
            }else{
//se nao tiver Id usamos post para criar novo
                resposta = await fetch(URL_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dados)                    
                });
            }
            if (resposta.ok){
                limparFormulario();
                carregarLivros();
                alert(id ? "Livro atualizado!":"Livro Cadastrado!");
            }
        }catch(erro){
            console.error("Erro ao salvar:", erro);
        }       
}
function limparFormulario() {
    document.getElementById('livro-id').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('autor').value = '';
    document.getElementById('data_publicacao').value = '';
    document.querySelector('.btn-save').innerText = "Salvar Livro 💾";

}



document.getElementById('data_publicacao').max = new Date().toISOString().split("T")[0];
// Inicia a aplicação
carregarLivros();