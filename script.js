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