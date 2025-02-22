const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Para armazenar credenciais de forma segura

const app = express();
const port = 5000;

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Definir uma rota padrão para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Conectar ao MongoDB Atlas
const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalebynog:56LbS7OxqE12PMyo@cluster0.jpuff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Conectado ao MongoDB Atlas');
}).catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
});

// Modelo de Produto
const Produto = mongoose.model('Produto', new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String,
    quantidade: Number,
    marcado: Boolean, // Marcação do produto
}));

// Rota para recuperar os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (err) {
        res.status(500).send('Erro ao recuperar produtos');
    }
});

// Rota para salvar a marcação de um produto
app.post('/api/marcar-produto', async (req, res) => {
    const { produtoNome, marcado } = req.body;

    // Busca o produto no banco
    let produto = await Produto.findOne({ nome: produtoNome });

    if (!produto) {
        // Se não encontrar, cria um novo produto
        produto = new Produto({ nome: produtoNome, marcado: marcado, quantidade: 10, preco: "R$ 50,00", imagem: "caminho-da-imagem.jpg" });
    } else {
        // Atualiza a marcação
        produto.marcado = marcado;
    }

    await produto.save();
    res.status(200).send('Marcações atualizadas');
});

// Iniciar o servidor após conectar ao banco
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`🚀 Servidor rodando na porta ${port}`);
    });
});
