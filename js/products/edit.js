const html = {
    get: element => document.querySelector(element),
    id: element => document.getElementById(element),
    all: element => document.querySelectorAll(element),
}

const elements = {
    pastIng: html.all(".pastIng"),
    ingredient: html.get(".ingrediente"),
    ingredients: html.get("#ingredients"),
    margin: html.get("#margem"),
    markup: html.get("#markup"),
    sell: html.get("#venda"),
    finalCost: html.get("#custoFinal"),
}

const pastIngredient = {
    eachPast: element => {
        const id = element.value.split("|")[1]
        const innerTextE = html.id(id).innerText
        element.innerText = innerTextE
    },
    tratamento() {
        elements.pastIng.forEach(pastIngredient.eachPast)
    },
}

const cloneIngredients = {
    create: _ => {
        let index = html.all(".ingrediente").length - 1
        let indexBtn = Number.parseInt(html.all(".ingrediente")[index].id) + 1

        let clone = elements.ingredient.cloneNode(true)
        clone.setAttribute("id", indexBtn)
        elements.ingredients.appendChild(clone)

        let del = html.all(".del")[index + 1]
        del.setAttribute("onclick", `cloneIngredients.del(${indexBtn})`)

        calcs.cost()
    },
    del: index => {
        let element = html.id(index)
        element.remove()
        calcs.cost()
    },
}
const controls = {
    createListeners: _ => {
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
        let costEl = html.all(".custo")
        let index = html.all(".ingrediente").length - 1
        for (i = 0; i < index; i++) {
            let product = html.all(".produto")
            let amountEl = html.all(".quantidade")[i]
            let amount = calcs.turnNumber(amountEl.value).toFixed(3)
            cost += calcs.sell(product, i, 1, amount)
            amountEl.value = amount
            costEl[i].value = calcs.sell(product, i, 1, amount).toFixed(2)
        }
        elements.finalCost.value = (cost + 2).toFixed(2)
        calcs.margin()
    },
    margin: _ => {
        let sell = calcs.turnNumber(html.get("#venda").value)
        let cost = calcs.turnNumber(html.get("#custoFinal").value)
        elements.margin.value = (((sell - cost) / sell) * 100).toFixed(0)
        elements.markup.value = ((sell / cost - 1) * 100).toFixed(0)
    },
    markup: _ => {
        let markup = calcs.turnNumber(html.get("#markup").value)
        let cost = calcs.turnNumber(html.get("#custoFinal").value)
        let calc = (cost * (markup / 100 + 1)).toFixed(0)
        elements.sell.value = calc
        elements.margin.value = (((calc - cost) / calc) * 100).toFixed(0)
    },
}
function init() {
    controls.createListeners()
    pastIngredient.tratamento()
}
init()