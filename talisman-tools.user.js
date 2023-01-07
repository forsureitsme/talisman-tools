// ==UserScript==
// @name         Talisman's Order Line Hover
// @namespace    https://www.talismanstore.com.br/
// @version      0.5
// @description  Aplica o hover do nome da carta para a linha inteira do item
// @author       Pedro Cardoso da Silva (@forsureitsme)
// @match        https://www.talismanstore.com.br/?view=ecom/admin/compra&cod=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=talismanstore.com.br
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    // Pra cada link de produto (que tem o atributo que habilita o hover)
    document.querySelectorAll('.panel-order--content .link-produto[data-tooltip]').forEach(productLinkNode => {
        // Coloca em uma variável o elemento <article> mais próximo subindo o DOM a partir do link do produto
        const itemNode = productLinkNode.closest('article');
        // Copia o atributo que habilita o tooltip para o artigo
        itemNode.dataset.tooltip = productLinkNode.dataset.tooltip;
        // Remove o atributo do link do produto
        delete productLinkNode.dataset.tooltip;
        // Remove a tooltip já configurada no link do produto
        window.$(productLinkNode)
            .unbind('mouseenter')
            .unbind('mousemove')
            .unbind('mouseleave')
        ;

        // Busca o elemento que possui a qualidade do produto
        const rowInfosNode = itemNode.querySelector('.icon_qualid')
            // e busca a linha mais próxima(a que contém as informações da carta)
            .closest('.row')
            // cria um clone em uma variável
            .cloneNode(true)
        ;
        // Remove as classes desse elemento
        rowInfosNode.classList.remove(...rowInfosNode.classList);
        // Define o novo estilo de linha vertical
        Object.assign(rowInfosNode.style, {
            display: 'flex',
            flexDirection: 'column',
            fontSize: '10em'
        });

        // Busca o texto do elemento que contém o código do set
        let setCode = productLinkNode.querySelector('.input-infoaux').innerText;
        // Pega as 3 letras do código do set
        setCode = setCode.match(/\(Código: (.{3})/i)[1];

        // Pega a primeira linha de informações
        const setInfo = rowInfosNode.children[0];
        // Substitui ela pelo código do set
        setInfo.innerHTML = setCode;

        // Pega a segunda linha de informações
        const langInfo = rowInfosNode.children[1];
        // Tira tudo dela que não é texto
        langInfo.innerHTML = langInfo.innerText.trim();

        // Cria um elemento de linha horizontal para poder deixar as informações do lado da carta
        const tooltipRowNode = document.createElement('div');
        tooltipRowNode.style.display = 'flex';

        // Pega elemento da tooltip em uma variável
        const tooltipNode = document.querySelector(`#${itemNode.dataset.tooltip}`);
        // Pega a imagem da carta
        const tooltipImageNode = tooltipNode.firstElementChild;

        // Coloca as informações dentro do elemento de linha horizontal
        tooltipRowNode.insertBefore(rowInfosNode, null);
        // Tira a imagem da carta de dentro do tooltip
        // e coloca ela dentro do elemento de linha horizonta
        tooltipRowNode.insertBefore(tooltipImageNode, null);

        // Coloca o elemento de linha horizontal dentro da tooltip
        tooltipNode.insertBefore(tooltipRowNode, null);

        // Busca o texto do elemento que contém o preço da carta
        let price = productLinkNode.closest('.row').children[1].innerText;
        // Pega as 3 letras do código do set
        price = parseInt(price.match(/R\$ (\d+)/)[1], 10);

        if (price >= 10) {
            // Pinta os elementos relevantes
            [itemNode, tooltipNode].forEach(node => {
                Object.assign(node.style, {
                    backgroundColor: 'rgba(255,0,0,.5)'
                });
            });
        }
    });

    // Reinicializa tooltips
    if (window.stickytooltip) {
        window.stickytooltip.init("*[data-tooltip]", "mystickytooltip");
    };
})();