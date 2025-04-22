{{#each erros}}
<div class="container alert alert-danger"><h4>{{texto}}</h4></div>
{{else}}
{{/each}}

<h1>Cadastrar Novo Produto</h1>
<div class="card">
    <div class="card-body">
        <form action="/hamburguers/novo" method="POST">
        <label for="nome">Nome: </label>
        <input type="text" name='nome' class='form-control' required>
        <div class="form-row ingrediente">
            <div class="form-group col-md-4">
                <label for="ingrediente">Ingredientes: </label>
                <select class="form-control" name='ingrediente'>
                    {{#each produtos}}
                    <option value="{{descricao}}" class="produto">{{descricao}} - R${{custo}}</option>
                    {{/each}}
                </select>
            </div>
            <div class="form-group col-md-4">
                <label for="quantidade">Quantidade: </label>
                <input type="text" name="quantidade" class="form-control quantidade" required>
            </div>
            <div class="form-group col-md-4">
                <a class="btn btn-primary mt-4" onclick="addIngrediente()">Add Ingredientes</a>
            </div>
            <a class="btn btn-primary mt-4" onclick="criarNovoIngrediente()">Novo Ingredientes</a>
        </div>
        <div class="ingredientes"></div>
        <button type="submit" class="btn btn-success mt-4">Enviar Hamburguer!</button>
        </form>
    </div>
</div>

<script>
    let ingrediente = document.getElementsByClassName("ingrediente")[0]
    let indice = 1
    const criarNovoIngrediente = ()=>{
        let ingredientes = document.getElementsByClassName("ingredientes")[0]
        let clone = ingrediente.cloneNode(true)
        ingredientes.appendChild(clone)
        indice++
    }
    const addIngrediente = ()=>{
        for(i=0; i < indice; i++){
            produto = document.getElementsByClassName("produto")[i].innerText
            quantidade = document.getElementsByClassName("quantidade")[i].value
            console.log(Number(produto.split('$')[1].replace(',', '.')) * Number(quantidade.replace(',', '.')))
        }
    }
</script>