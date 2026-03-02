const express = require('express');
const pool = require ('./db');
const app = express();
const cors = require('cors');
require('dotenv').config();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000; // Usar a porta do Render ou 3000 localmente

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Servidor Rorando na porta ${PORT}`);
});

//Rota para buscar todos os livros

app.get('/livros', async(req,res)=>{
    try{
        const resultado = await pool.query('SELECT * FROM livros');
        res.json(resultado.rows);
    }catch (erro){
        console.error(erro.message);
        res.status(500).send('Erro ao buscar livros');
    }

});


// Cadastrando um novo livro

app.post('/livros',async(req, res)=>{
    try{
        const {titulo,autor,data_publicacao}= req.body;
        const novoLivro = await pool.query( 'INSERT INTO livros (titulo, autor,data_publicacao) VALUES ($1,$2,$3)RETURNING *',
          [titulo,autor,data_publicacao] 
        );
        res.json(novoLivro.rows[0]);
    }catch(erro){
        console.error(erro.message);
        res.status(500).send('Erro ao cadastrar livro');
    }

});

//Atualizando livros existentes

app.put('/livros/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const {titulo,autor,data_publicacao} = req.body;
        const livroAtualizado = await pool.query(
            'UPDATE livros SET titulo = $1, autor = $2, data_publicacao = $3 WHERE id = $4  RETURNING *',
            [titulo, autor, data_publicacao, id]
        );

        if(livroAtualizado.rows.length === 0){
            return res.status(404).json('Livro não encontrado');
        }
        res.json(livroAtualizado.rows[0]);
        }catch(erro){
            console.error(erro.message);
            res.status(500).send('Erro ao atualizar livro');
        }
});


//Deletar o livro

app.delete ('/livros/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const deletarLivro = await pool.query('DELETE FROM livros WHERE id= $1',[id]);
        
        if(deletarLivro.rowCount === 0 ){
            return res.status(404).json('Livro não encontrado');
        }

        res.json('Livro excluido com sucesso!!!');
         }catch(erro){
            console.error(erro.message);
         }
});