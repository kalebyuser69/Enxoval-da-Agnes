// Espera o carregamento completo da página
window.addEventListener("load", function () {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none"; // Esconde a tela de carregamento
});

document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.getElementById("lista-produtos");

    // Exemplo de categorias e produtos
    const categorias = {
        "Roupas": [
            {
                nome: "Body",
                preco: "R$ 34,90",
                link: "https://shopee.com.br/Toalha-de-banho-infantil-felpuda-com-capuz-de-bichinho-i.417646323.21499371560?sp_atk=c288f75b-9ee6-41f4-9e9f-d11fb34bde6b&xptdk=c288f75b-9ee6-41f4-9e9f-d11fb34bde6b",
                imagem: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzp2xhfvdhz54e.webp",
                quantidade: 1
            },
            {
                nome: "Camiseta",
                preco: "R$ 29,90",
                link: "https://example.com/camiseta",
                imagem: "https://via.placeholder.com/800x400?text=Camiseta",
                quantidade: 5
            },
            {
                nome: "Jaqueta",
                preco: "R$ 120,00",
                link: "https://example.com/jaqueta",
                imagem: "https://via.placeholder.com/800x400?text=Jaqueta",
                quantidade: 3
            }
        ],
        "Calçados": [
            {
                nome: "Tênis",
                preco: "R$ 89,90",
                link: "https://example.com/tenis",
                imagem: "https://via.placeholder.com/800x400?text=Tênis",
                quantidade: 10
            },
            {
                nome: "Sapato",
                preco: "R$ 99,90",
                link: "https://example.com/sapato",
                imagem: "https://via.placeholder.com/800x400?text=Sapato",
                quantidade: 5
            }
        ],
        "Acessorios": [
            {
                nome: "Relógio",
                preco: "R$ 89,90",
                link: "https://example.com/relogio",
                imagem: "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzp2xhfvdhz54e.webp",
                quantidade: 5
            },
            {
                nome: "Pulseira",
                preco: "R$ 99,90",
                link: "https://example.com/pulseira",
                imagem: "https://via.placeholder.com/800x400?text=Pulseira",
                quantidade: 5
            }
        ]
    };

    Object.entries(categorias).forEach(([categoria, produtos], categoriaIndex) => {
        if (Array.isArray(produtos)) {
            const categoriaCol = document.createElement("div");
            categoriaCol.classList.add("col-md-12", "categoria-container");

            const categoriaTitulo = document.createElement("h3");
            categoriaTitulo.textContent = categoria.toUpperCase();
            categoriaCol.appendChild(categoriaTitulo);

            const carrossel = document.createElement("div");
            carrossel.classList.add("carousel", "slide");
            carrossel.id = `carousel-${categoriaIndex}`;

            const carrosselInner = document.createElement("div");
            carrosselInner.classList.add("carousel-inner");

            produtos.forEach((produto, index) => {
                const item = document.createElement("div");
                item.classList.add("carousel-item");
                if (index === 0) {
                    item.classList.add("active");
                }

                // Configurando o produto
                const produtoDiv = document.createElement("div");
                produtoDiv.classList.add("produto");

                const nomePreco = document.createElement("p");
                nomePreco.innerHTML = `<span class="produto-nome">${produto.nome}</span>`;
                produtoDiv.appendChild(nomePreco);

                const img = document.createElement("img");
                img.src = produto.imagem;
                img.alt = produto.nome;
                produtoDiv.appendChild(img);

                // Quantidade do produto
                const quantidadeProduto = document.createElement("p");
                quantidadeProduto.textContent = `${produto.preco} - Faltam: ${produto.quantidade}`;
                produtoDiv.appendChild(quantidadeProduto);

                // Recuperar a quantidade do localStorage ao carregar a página
                const storedQuantity = localStorage.getItem(produto.nome);
                if (storedQuantity) {
                    produto.quantidade = parseInt(storedQuantity, 10); // Corrigido para base 10
                    quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                }

                // Checkbox para marcar como "Escolhido"
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("checkbox");
                checkbox.id = `checkbox-${produto.nome}`;
                checkbox.setAttribute("data-product", produto.nome);  // Associando o nome do produto à checkbox
                produtoDiv.appendChild(checkbox);

                // Adiciona um label para a checkbox
                const label = document.createElement("label");
                label.setAttribute("for", checkbox.id);

                // Adiciona "Presentear" ou "Esgotado"
                if (produto.quantidade > 0) {
                    label.textContent = "Presentear"; // Se há estoque
                    checkbox.disabled = false; // Habilita a checkbox
                    produtoDiv.style.backgroundColor = ""; // Deixa o fundo sem cor
                } else {
                    label.textContent = "Limite atingido, Obrigado por participar 😊​"; // Se não há estoque
                    checkbox.disabled = true; // Desabilita a checkbox
                    produtoDiv.style.backgroundColor = "#b37878"; // Fundo vermelho para produtos esgotados
                }

                produtoDiv.appendChild(label);

                // Verifica se a checkbox deve estar marcada ao carregar a página
                if (produto.quantidade === 0) { // Se a quantidade for 0
                    checkbox.checked = true; // Marca a checkbox
                    checkbox.disabled = true; // Desabilita a checkbox
                    produtoDiv.style.backgroundColor = "#b37878"; // Muda a cor da caixa do produto para vermelho
                    label.textContent = "Limite atingido! Obrigado por participar 😊​"; // Garante que "Esgotado" seja mostrado
                }

                // Evento para checkbox
                checkbox.addEventListener("change", function () {
                    const telefone = localStorage.getItem("usuarioTelefone");
                    const productName = this.getAttribute("data-product");
                    const produto = produtos.find(p => p.nome === this.getAttribute("data-product"));

                    // Pergunta ao usuário antes de prosseguir
                    const confirmacao = confirm(`Você será redirecionado para o site de compra e não poderá desmarcar o produto.\n\nTEM CERTEZA QUE DESEJA SELECIONAR "${productName}"?`);

                    if (!confirmacao) {
                        this.checked = !this.checked; // Volta ao estado anterior se o usuário cancelar
                        return;
                    }

                    // Se a checkbox for marcada, redireciona para o link do produto
                    if (this.checked && produto) {
                        window.open(produto.link, "_blank"); // Abre o link em nova aba
                    }



                    // Caso a checkbox esteja marcada (usuário marca manualmente)
                    if (this.checked) {
                        // Verifica se ainda há quantidade disponível
                        if (produto.quantidade > 0) {
                            // Reduz a quantidade
                            produto.quantidade--;
                            quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                            localStorage.setItem(produto.nome, produto.quantidade); // Salva a nova quantidade no localStorage


                            // Função para atualizar a checkbox e outros detalhes do produto
                            function atualizarCheckbox(checkbox, quantidade, produto) {
                                if (quantidade === 0) {
                                    checkbox.checked = true;
                                    checkbox.disabled = true;
                                } else {
                                    checkbox.disabled = false;
                                    // Você pode adicionar algum comportamento visual para indicar que o produto ainda está disponível
                                    produtoDiv.style.backgroundColor = ""; // Reseta a cor de fundo para o normal
                                    produtoDiv.innerHTML = `<strong>${produto.nome}</strong>`; // Restaura o nome do produto
                                }
                            }

                            // Atualiza a checkbox imediatamente
                            atualizarCheckbox(this, produto.quantidade);

                        } else {
                            // Se quantidade for 0, mantém a checkbox marcada e desativada
                            this.checked = true; // Garante que fique marcada
                            this.disabled = true; // Desabilita a checkbox

                        }
                    }
                });

                item.appendChild(produtoDiv);
                carrosselInner.appendChild(item);
            })

            carrossel.appendChild(carrosselInner);

            // Controles do carrossel
            const prev = document.createElement("button");
            prev.classList.add("carousel-control-prev");
            prev.innerHTML = `<span class="carousel-control-prev-icon"></span>`;
            prev.setAttribute("data-bs-target", `#carousel-${categoriaIndex}`);
            prev.setAttribute("data-bs-slide", "prev");

            const next = document.createElement("button");
            next.classList.add("carousel-control-next");
            next.innerHTML = `<span class="carousel-control-next-icon"></span>`;
            next.setAttribute("data-bs-target", `#carousel-${categoriaIndex}`);
            next.setAttribute("data-bs-slide", "next");

            carrossel.appendChild(prev);
            carrossel.appendChild(next);

            categoriaCol.appendChild(carrossel);
            listaProdutos.appendChild(categoriaCol);
        }
    });

});
// Evento do botão de reset
document.getElementById("reset-button").addEventListener("click", function () {
    // Limpa o localStorage
    localStorage.clear();

    // Atualiza a interface do usuário para refletir as quantidades resetadas
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Desmarca todas as checkboxes
        checkbox.disabled = false; // Habilita todas as checkboxes
    });

    // Observa mudanças na quantidade dos produtos
    document.querySelectorAll(".produto").forEach(produto => {
        const quantidadeSpan = produto.querySelector(".quantidade"); // Supõe que a quantidade está em um elemento com classe "quantidade"
        const checkbox = produto.querySelector("input[type='checkbox']");

        if (quantidadeSpan && checkbox) {
            // Atualiza o estado da checkbox com base na quantidade
            const novaQuantidade = parseInt(quantidadeSpan.textContent.split(": ")[1], 10); // Extrai a quantidade de "Faltam: X"
            atualizarCheckbox(checkbox, novaQuantidade);
        }
    });
});