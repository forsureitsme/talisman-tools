// ==UserScript==
// @name         Talisman's Order Line Hover 
// @namespace    https://www.talismanstore.com.br/
// @version      0.1
// @description  Aplica o hover do nome da carta para a linha inteira do item
// @author       Pedro Cardoso da Silva (@forsureitsme)
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://www.talismanstore.com.br/?view=ecom/admin/compra&cod=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=talismanstore.com.br
// ==/UserScript==

var inline_src = (<><![CDATA[

    // Your code here...

]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);