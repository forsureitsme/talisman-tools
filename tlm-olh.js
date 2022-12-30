// ==UserScript==
// @name         Talisman's Order Line Hover
// @namespace    https://www.talismanstore.com.br/
// @version      0.1
// @description  Aplica o hover do nome da carta para a linha inteira do item
// @author       Pedro Cardoso da Silva (@forsureitsme)
// @match        https://www.talismanstore.com.br/?view=ecom/admin/compra&cod=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=talismanstore.com.br
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    document.querySelectorAll('.panel-order--content [data-tooltip]').forEach(node => {
        node.closest('article').dataset.tooltip = node.dataset.tooltip
        delete node.dataset.tooltip

        window.$(node)
            .unbind('mouseenter')
            .unbind('mousemove')
            .unbind('mouseleave')
        ;
    });

    if (window.stickytooltip) {
        window.stickytooltip.init("*[data-tooltip]", "mystickytooltip")
    };
})();