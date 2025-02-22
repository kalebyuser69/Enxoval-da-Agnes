const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String,
    marcado: { type: Boolean, default: false }, // Propriedade de marcação com valor default
});

const Produto = mongoose.model("Produto", ProdutoSchema);

module.exports = Produto;
