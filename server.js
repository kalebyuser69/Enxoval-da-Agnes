require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001' // Substitua pelo domínio correto do seu frontend
}));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("MongoDB conectado!"));
db.on("error", (err) => console.error("Erro na conexão:", err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const Produto = require("./models/Produto"); // Importa o modelo

// Endpoint para marcar/desmarcar produto
app.post("/marcar-produto", async (req, res) => {
    const { nome, marcado } = req.body;

    try {
        // Atualiza o produto no banco de dados
        const produto = await Produto.findOneAndUpdate(
            { nome },  // Procurar o produto pelo nome
            { marcado },  // Atualiza o campo "marcado" com o valor enviado
            { new: true }  // Retorna o documento atualizado
        );

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado!" });
        }

        res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao atualizar produto." });
    }
});
// Endpoint para recuperar todos os produtos
app.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.find();  // Recupera todos os produtos no banco de dados
        res.status(200).json(produtos);  // Retorna os produtos para o frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao carregar produtos." });
    }
});
