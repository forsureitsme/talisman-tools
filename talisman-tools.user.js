// ==UserScript==
// @name         Talisman Tools
// @namespace    https://www.talismanstore.com.br/
// @version      0.6
// @description  Tools to bring a better quality of life for Talisman Store workers
// @author       Pedro Cardoso da Silva (@forsureitsme)
// @match        https://talismanstore.com.br/
// @match        https://*.talismanstore.com.br/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=talismanstore.com.br
// @homepageURL  https://github.com/forsureitsme/talisman-tools
// @downloadURL  https://gist.github.com/forsureitsme/dc75a79375cd1e6ee7d348b80f1178f7/raw/talisman-tools.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const isOrderPage = () => {
    const params = (new URL(window.location)).searchParams;

    return (
      params.get('view') === 'ecom/admin/compra'
      && params.get('cod')
    );
  }

  class Product {
    constructor(productLinkNode) {
      this.productLinkNode = productLinkNode;
      this.itemNode        = this.productLinkNode.closest("article");
      this.tooltipNode     = document.querySelector(
        `#${this.productLinkNode.dataset.tooltip}`
      );
      this.cardImageNode   = this.tooltipNode.firstElementChild;
    }

    get tooltipImageNode() {
      const tooltipImageNode = document.createElement("div");
      tooltipImageNode.insertBefore(this.cardImageNode, null);
      Object.assign(tooltipImageNode.style, {
        overflow: "hidden",
        borderRadius: "4.75% / 3.5%",
        position: "relative",
      });

      if (this.isFoil) {
        const foilOverlay = document.createElement("div");
        Object.assign(foilOverlay.style, {
          position: "absolute",
          inset: "0",
          background:
            "linear-gradient(0deg, #e9ee52, #e73c7e, #23a6d5, #23d5ab)",
          opacity: ".5",
          pointerEvents: "none",
        });

        tooltipImageNode.insertBefore(foilOverlay, null);

        /*
        window.requestAnimationFrame(() => {
          tooltipImageNode.animate(
            [
              {
                background:
                  "linear-gradient(0deg, #e9ee52, #e73c7e, #23a6d5, #23d5ab)",
              },
              {
                background:
                  "linear-gradient(359deg, #e9ee52, #e73c7e, #23a6d5, #23d5ab)",
              },
            ],
            {
              duration: 2000,
              iterations: Infinity,
            }
          );
        });
        */
      }

      return tooltipImageNode;
    }

    get isFoil() {
      return this.itemNode
      .querySelector(".extras-pedido")
      ?.innerText.includes("Foil");
    }

    get price() {
      return parseInt(
        this.productLinkNode
        .closest(".row")
          .children[1].innerText.match(/R\$ (\d+)/)[1],
        10
      );
    }

    moveTooltipFromLinkToRow() {
      this.itemNode.dataset.tooltip = this.productLinkNode.dataset.tooltip;
      delete this.productLinkNode.dataset.tooltip;
      window
      .$(this.productLinkNode)
      .unbind("mouseenter")
      .unbind("mousemove")
      .unbind("mouseleave");
    }

    get setCode() {
      return this.productLinkNode
      .querySelector(".input-infoaux")
      ?.innerText.match(/\(Código: (.*)\)/i)[1];
    }

    get infosColumnNode() {
      const infosNode = this.itemNode
      .querySelector(".icon_qualid")
      .closest(".row")
      .cloneNode(true);
      infosNode.classList.remove(...infosNode.classList);
      Object.assign(infosNode.style, {
        display: "flex",
        flexDirection: "column",
        fontSize: "6em",
      });

      const setInfo     = infosNode.children[0];
      setInfo.innerHTML = this.setCode;

      const langInfoNode     = infosNode.children[1];
      langInfoNode.innerHTML = langInfoNode.innerText.trim();

      return infosNode;
    }

    get tooltipRowNode() {
      // Cria um elemento de linha horizontal para poder deixar as informações do lado da carta
      const tooltipRowNode         = document.createElement("div");
      tooltipRowNode.style.display = "flex";
      tooltipRowNode.insertBefore(this.infosColumnNode, null);
      tooltipRowNode.insertBefore(this.tooltipImageNode, null);

      return tooltipRowNode;
    }

    renderTooltip() {
      this.tooltipNode.insertBefore(this.tooltipRowNode, null);
    }

    highlightBinderCards() {
      if (this.price >= 10) {
        [this.itemNode, this.tooltipNode].forEach((node) => {
          Object.assign(node.style, {
            backgroundColor: "rgba(255,0,0,.5)",
          });
        });
      }
    }
  }


  if (!isOrderPage()) {
    document
    .querySelectorAll(".panel-order--content .link-produto[data-tooltip]")
    .forEach((productLinkNode) => {
      const product = new Product(productLinkNode);

      product.moveTooltipFromLinkToRow();
      product.renderTooltip();
      product.highlightBinderCards();
    });

    if (window.stickytooltip) {
      window.stickytooltip.init("*[data-tooltip]", "mystickytooltip");
    }
  };
})();
