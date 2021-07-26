function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        let key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

const html = {
    get: element => document.querySelector(element),
    all: element => document.querySelectorAll(element),
}
const vendasDia = []

const elementos = {
    dataVenda: html.all(".data"),
    date: html.all(".date"),
    venda: html.all(".venda"),
    custo: html.all(".custo"),
    taxa: html.all(".taxa"),
}

elementos.dataVenda.forEach((element, index) => {
    let obj = {
        data: element.innerText,
        date: elementos.date[index].value,
        venda: Number.parseFloat(elementos.venda[index].innerText.split("$")[1]),
        custo: Number.parseFloat(elementos.custo[index].innerText.split("$")[1]),
        taxa: Number.parseFloat(elementos.taxa[index].innerText.split("$")[1]),
        index: index,
    }
    vendasDia.push(obj)
})

const agruparArray = groupBy(vendasDia, "data")
vendasDia.length = 0

Array.from(Object.keys(agruparArray)).forEach(dias => {
    const obj = {
        data: dias,
        date: agruparArray[dias][0].date,
        venda: 0,
        custo: 0,
        taxa: 0,
        vendaPorDia: 0,
    }
    Array.from(agruparArray[dias]).forEach(elemento => {
        obj.venda += Number.parseFloat(elemento.venda)
        obj.custo += Number.parseFloat(elemento.custo)
        obj.taxa += Number.parseFloat(elemento.taxa)
        obj.vendaPorDia++
    })
    vendasDia.push(obj)
})

let page = 0
const state = {
    page,
    perPage: vendasDia[page].vendaPorDia,
    perPageAnt: 0,
    totalPage: vendasDia.length,
}

const controls = {
    funcSell: index => +vendasDia[index].vendaPorDia,
    next() {
        if (state.page < state.totalPage - 1) {
            state.page++
            state.perPageAnt = state.perPage
            state.perPage = state.perPageAnt + controls.funcSell(state.page)
        }
    },
    prev() {
        if (state.page < 1) {
            state.page = 0
            state.perPage = controls.funcSell(0)
            state.perPageAnt = 0
        } else {
            state.page--
            state.perPage = state.perPageAnt
            state.perPageAnt = state.perPage - controls.funcSell(state.page)
        }
    },
    calcState(pagina) {
        let state = 0
        for (i = 0; i < pagina; i++) {
            state += controls.funcSell(i)
        }
        return state
    },
    goTo(pagina) {
        if (pagina <= 0) {
            state.perPage = controls.funcSell(0)
            state.perPageAnt = 0
            state.page = 0
        } else if (pagina >= state.totalPage) {
            state.perPage = controls.calcState(state.totalPage)
            state.perPageAnt = state.perPage - controls.funcSell(state.totalPage - 1)
            state.page = state.totalPage - 1
        } else if (pagina > 0) {
            state.perPage = controls.calcState(pagina)
            state.perPageAnt = state.perPage - controls.funcSell(pagina - 1)
        }
    },
    createListeners() {
        html.get(".first").addEventListener("click", () => {
            controls.goTo(0)
            update()
        })
        html.get(".last").addEventListener("click", () => {
            controls.goTo(state.totalPage)
            update()
        })
        html.get(".next").addEventListener("click", () => {
            controls.next()
            update()
        })
        html.get(".prev").addEventListener("click", () => {
            controls.prev()
            update()
        })
        html.get(".number").addEventListener("click", () => {
            controls.goTo(3)
            update()
        })
    },
}

const list = {
    items: Array.from(html.all(".item")),
    create: item => html.get(".list").appendChild(item),
    update() {
        html.get(".list").innerHTML = ""
        html.get("#vendasDia").innerHTML = ""
        const paginatedItems = list.items.slice(state.perPageAnt, state.perPage)
        paginatedItems.forEach(list.create)
        let element = vendasDia[state.page]
        const li = document.createElement("li")
        li.setAttribute("class", "list-group-item list-group-item-info")
        li.innerHTML = `Dia: ${element.data}  |  Venda: R$${element.venda.toFixed(
            2
        )}  |  Custo: R$${element.custo.toFixed(2)}  |  Lucro: R$${(
            element.venda - element.custo
        ).toFixed(2)}  |  Taxa Motoboy: R$${element.taxa.toFixed(2)}`
        html.get("#vendasDia").appendChild(li)
    },
}

const buttons = {
    create() {},
    update() {
        html.get(".number").innerHTML = ""
    },
}

function update() {
    buttons.update()
    list.update()
}

function init() {
    update()
    controls.createListeners()
}
init()
