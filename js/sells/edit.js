const html = {
    get: element => document.querySelector(element),
    all: element => document.querySelectorAll(element),
    id: element => document.getElementById(element),
}
let index = html.all(".ingrediente").length + 1
const elements = {
    pastIng: html.all(".pastIng"),
    ingredient: html.get(".ingrediente"),
    index,
    indexBtn: index,
    ingredients: html.get("#ingredients"),
    margin: html.get("#margem"),
    markup: html.get("#markup"),
    sell: html.get("#venda"),
    finalCost: html.get("#custoFinal"),
    product: html.all(".product"),
    data: html.get(".data"),
    pastData: html.get(".pastData"),
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
        let clone = elements.ingredient.cloneNode(true)
        clone.setAttribute("id", elements.index)
        elements.ingredients.appendChild(clone)

        let del = html.all(".del")[elements.indexBtn - 1]
        del.setAttribute("onclick", `cloneIngredients.del(${elements.index})`)

        elements.index++
        elements.indexBtn++
        calcs.cost()
        controls.createListeners()
    },
    del: index => {
        let element = html.id(index)
        element.remove()
        elements.indexBtn--
        calcs.cost()
    },
}
const controls = {
    createListeners() {
        html.all(".create").forEach(item => {
            item.addEventListener("click", () => {
                cloneIngredients.create()
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
    sell: (product, i, cs, amount) =>
        calcs.turnNumber(product[i].options[product[i].selectedIndex].text.split("$")[cs]) * amount,
    cost: _ => {
        let cost = 0
        let sell = 0
        for (i = 0; i < elements.indexBtn - 1; i++) {
            let product = html.all(".produto")
            let amountEl = html.all(".quantidade")[i]
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

function setDate() {
    let now = new Date(elements.pastData.value)
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
    pastIngredient.tratamento()
    controls.createListeners()
}
init()

const gerarApontamento = () => {
    document.getElementsByName("apontamento")[0].value =
        parseInt(Math.random() * 10).toString() +
        parseInt(Math.random() * 10).toString() +
        parseInt(Math.random() * 10).toString() +
        parseInt(Math.random() * 10).toString()
}
const estoque = document.querySelector(".estoque")
const custo = document.querySelector(".custo")
const validade = document.querySelector(".validade")
validade.value = "2050-12-30"
function add() {
    estoque.addEventListener("change", () => {
        estoque.value = Number.parseFloat(estoque.value.replace(",", ".")).toFixed(3)
    })
    custo.addEventListener("change", () => {
        custo.value = Number.parseFloat(custo.value.replace(",", ".")).toFixed(2)
    })
}
add()
