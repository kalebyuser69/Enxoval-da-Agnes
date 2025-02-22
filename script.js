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

                const produtoDiv = document.createElement("div");
                produtoDiv.classList.add("produto");

                const nomePreco = document.createElement("p");
                nomePreco.innerHTML = `<span class="produto-nome">${produto.nome}</span>`;
                produtoDiv.appendChild(nomePreco);

                const img = document.createElement("img");
                img.src = produto.imagem;
                img.alt = produto.nome;
                produtoDiv.appendChild(img);

                const quantidadeProduto = document.createElement("p");
                quantidadeProduto.textContent = `${produto.preco} - Faltam: ${produto.quantidade}`;
                produtoDiv.appendChild(quantidadeProduto);

                // Armazena a quantidade inicial no localStorage
                const storedQuantity = localStorage.getItem(produto.nome);
                if (storedQuantity) {
                    produto.quantidade = parseInt(storedQuantity, 10);
                    quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                }

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("checkbox");
                checkbox.id = `checkbox-${produto.nome}`;
                checkbox.setAttribute("data-product", produto.nome);
                produtoDiv.appendChild(checkbox);

                const label = document.createElement("label");
                label.setAttribute("for", checkbox.id);

                // Atualiza o texto conforme a quantidade
                if (produto.quantidade > 0) {
                    label.textContent = "Presentear";
                    checkbox.disabled = false;
                    produtoDiv.style.backgroundColor = "";
                } else {
                    label.textContent = "Limite atingido, Obrigado por participar 😊​";
                    checkbox.disabled = true;
                    produtoDiv.style.backgroundColor = "#b37878";
                }

                produtoDiv.appendChild(label);

                // Marca como esgotado se a quantidade for 0
                if (produto.quantidade === 0) {
                    checkbox.checked = true;
                    checkbox.disabled = true;
                    produtoDiv.style.backgroundColor = "#b37878";
                    label.textContent = "Limite atingido! Obrigado por participar 😊​";
                }

                checkbox.addEventListener("change", function () {
                    const telefone = localStorage.getItem("usuarioTelefone");
                    const productName = this.getAttribute("data-product");
                    const produto = produtos.find(p => p.nome === this.getAttribute("data-product"));

                    const confirmacao = confirm(`Você será redirecionado para o site de compra e não poderá desmarcar o produto.\n\nTEM CERTEZA QUE DESEJA SELECIONAR "${productName}"?`);

                    if (!confirmacao) {
                        this.checked = !this.checked;
                        return;
                    }

                    if (this.checked && produto) {
                        window.open(produto.link, "_blank");
                    }

                    if (this.checked) {
                        if (produto.quantidade > 0) {
                            produto.quantidade--;
                            quantidadeProduto.textContent = `Faltam: ${produto.quantidade}`;
                            localStorage.setItem(produto.nome, produto.quantidade);
                        } else {
                            this.checked = true;
                            this.disabled = true;
                        }
                    }
                });

                item.appendChild(produtoDiv);
                carrosselInner.appendChild(item);
            });

            carrossel.appendChild(carrosselInner);

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
