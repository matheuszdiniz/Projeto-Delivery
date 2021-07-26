const html = {
    get: element => document.querySelector(element),
    all: element => document.querySelectorAll(element),
    class: element => document.getElementsByClassName(element),
    id: element => document.getElementById(element),
}

let index = html.class("ingrediente").length + 1
const elements = {
    ingredient: html.get(".ingrediente"),
    index,
    indexBtn: index,
    ingredients: html.id("ingredients"),
    margin: html.id("margem"),
    markup: html.id("markup"),
    sell: html.id("venda"),
    finalCost: html.id("custoFinal"),
    product: html.class("product"),
    data: html.get(".data"),
}

const cloneIngredients = {
    create: _ => {
        let clone = elements.ingredient.cloneNode(true)
        clone.setAttribute("id", elements.index)
        elements.ingredients.appendChild(clone)

        let del = document.getElementsByClassName("del")[elements.indexBtn - 1]
        del.setAttribute("onclick", `cloneIngredients.del(${elements.index})`)

        html.class("create")[elements.indexBtn - 1].addEventListener("click", () => {
            cloneIngredients.create()
        })

        elements.index++
        elements.indexBtn++
        calcs.cost()
    },
    del: index => {
        let element = html.id(index)
        element.remove()
        elements.indexBtn--
        calcs.cost()
    },
}
const controls = {
    createListeners: _ => {
        html.get(".create").addEventListener("click", () => {
            cloneIngredients.create()
        })
        html.all(".produto").forEach(item => {
            item.addEventListener("change", () => {
                calcs.cost()
            })
        })
        html.get("#venda").addEventListener("change", () => {
            calcs.margin()
        })
        html.get("#markup").addEventListener("change", () => {
            calcs.markup()
        })
    },
}
const calcs = {
    turnNumber: number => Number.parseFloat(number.replace(",", ".")),
    sell: (product, i, cs, amount) => calcs.turnNumber(product[i].options[product[i].selectedIndex].text.split("$")[cs]) * amount,
    cost: _ => {
        let cost = 0
        let sell = 0
        for (i = 0; i < elements.indexBtn - 1; i++) {
            let product = html.class("produto")
            let amountEl = html.class("quantidade")[i]
            let amount = calcs.turnNumber(amountEl.value).toFixed(2)
            sell += calcs.sell(product, i, 2, amount)
            cost += calcs.sell(product, i, 1, amount)
            amountEl.value = amount
        }
        elements.sell.value = sell.toFixed(2)
        elements.finalCost.value = cost.toFixed(2)
        calcs.margin()
    },
    margin: _ => {
        let sell = calcs.turnNumber(html.id("venda").value)
        let cost = calcs.turnNumber(html.id("custoFinal").value)
        elements.margin.value = (((sell - cost) / sell) * 100).toFixed(0)
        elements.markup.value = ((sell / cost - 1) * 100).toFixed(0)
    },
    markup: _ => {
        let markup = calcs.turnNumber(html.id("markup").value)
        let cost = calcs.turnNumber(html.id("custoFinal").value)
        let calc = (cost * (markup / 100 + 1)).toFixed(0)
        elements.sell.value = calc
        elements.margin.value = (((calc - cost) / calc) * 100).toFixed(0)
    },
}

function setDate() {
    let now = new Date()
    const date = {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    }

    if (date.day < 10) date.day = "0" + date.day
    if (date.month < 10) date.month = "0" + date.month

    now = `${date.year}-${date.month}-${date.day}`
    elements.data.value = now
}

function init() {
    setDate()
    controls.createListeners()
}
init()
