const URL_API = 'https://biblioteca-backend-6j95.onrender.com/livros';

// 1. Função para carregar os livros da API (Neon + Render)
async function carregarLivros() {
    try {
        const resposta = await fetch(URL_API);
        const livros = await resposta.json();

        const corpoTabela = document.querySelector('#tabela-livros tbody');
        corpoTabela.innerHTML = '';

        livros.forEach(livro => {
            const linha = document.createElement('tr');
            
            // Formata a data para o padrão brasileiro
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




// 2. Função única para Salvar (Cadastrar ou Atualizar)
async function salvarlivro() {
    const id = document.getElementById('livro-id').value;
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const data_publicacao = document.getElementById('data_publicacao').value;

    // Validação de campos vazios
    if (!titulo || !autor || !data_publicacao) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Validação de data (não permite futuro)
    const dataInserida = new Date(data_publicacao);
    const dataHoje = new Date();
    if (dataInserida > dataHoje) {
        alert("Ei! O livro não pode ter sido publicado no futuro! 🚀⏳");
        return;
    }

    const dados = { titulo, autor, data_publicacao };

    try {
        let resposta;
        if (id) {
            // Se tem ID, editamos (PUT)
            resposta = await fetch(`${URL_API}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            // Se não tem ID, criamos novo (POST)
            resposta = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        if (resposta.ok) {
            alert(id ? "Livro atualizado com sucesso!" : "Livro cadastrado com sucesso!");
            limparFormulario();
            carregarLivros();
        }
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
    }
}

// 3. Função para carregar dados no formulário para edição
function prepararEdicao(id, titulo, autor, data) {
    document.getElementById('livro-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('autor').value = autor;

    // Converte a data para o formato YYYY-MM-DD que o input date exige
    const dataIso = new Date(data).toISOString().split('T')[0];
    document.getElementById('data_publicacao').value = dataIso;

    // Muda o visual do botão
    const btnSave = document.querySelector('.btn-save');
    btnSave.innerText = "Atualizar Livro 🔄";
    
    // Rola para o topo para facilitar a visualização
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Função para deletar livro
async function deletarLivro(id) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            const resposta = await fetch(`${URL_API}/${id}`, {
                method: 'DELETE'
            });
            
            if (resposta.ok) {
                carregarLivros();
            }
        } catch (erro) {
            console.error('Erro ao deletar', erro);
        }
    }
}

// 5. Função de Busca em Tempo Real
function filtrarLivros() {
    const termoBusca = document.getElementById('inputBusca').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabela-livros tbody tr');

    linhas.forEach(linha => {
        const titulo = linha.cells[1].textContent.toLowerCase();
        const autor = linha.cells[2].textContent.toLowerCase();

        if (titulo.includes(termoBusca) || autor.includes(termoBusca)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

// 6. Funções Auxiliares e Inicialização
function limparFormulario() {
    document.getElementById('livro-id').value = '';
    document.getElementById('titulo').value = '';
    document.getElementById('autor').value = '';
    document.getElementById('data_publicacao').value = '';
    document.querySelector('.btn-save').innerText = "Salvar Livro 💾";
}

// Bloqueia datas futuras no calendário do HTML
document.getElementById('data_publicacao').max = new Date().toISOString().split("T")[0];


//filtro de busca
function filtrarLivros() {
    const termoBusca = document.getElementById('inputBusca').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabela-livros tbody tr');

    linhas.forEach(linha => {
        // Coluna 1 é Título, Coluna 2 é Autor
        const titulo = linha.cells[1].textContent.toLowerCase();
        const autor = linha.cells[2].textContent.toLowerCase();

        if (titulo.includes(termoBusca) || autor.includes(termoBusca)) {
            linha.style.display = ""; // Mostra a linha
        } else {
            linha.style.display = "none"; // Esconde a linha
        }
    });
}


// Inicia a lista ao abrir a página
carregarLivros();