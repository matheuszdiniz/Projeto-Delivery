const gerarApontamento = () => {
    document.getElementsByName("apontamento")[0].value = parseInt(Math.random() * 10).toString() + parseInt(Math.random() * 10).toString() + parseInt(Math.random() * 10).toString() + parseInt(Math.random() * 10).toString()
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
