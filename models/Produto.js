const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
    nome: String,
    preco: String,
    imagem: String,
    marcado: { type: Boolean, default: false }, // Indica se o produto está marcado
});

module.exports = mongoose.model("Produto", ProdutoSchema);
