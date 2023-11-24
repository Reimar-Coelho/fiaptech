const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static('public'));

const port = 3000;

app.use(bodyParser.urlencoded({extend: true}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/fiaptech', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000
})

const UsuarioSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.post("/cadastro", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null || nome == null) {
        return res.status(400).json({ error: "Preencher todos os campos" })
    }

    const emailExiste = await Usuario.findOne({ email: email });

    if (emailExiste) {
        return res.status(400).json({ error: "O email informado já existe" })
    }

    const usuario = new Usuario({
        nome: nome,
        email: email,
        password: password
    })

    try {
        const newUsuario = await usuario.save();
        return res.json({ error: null, msg: "Cadastro feito com sucesso", usuarioId: newUsuario._id });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

app.post("/login", async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ error: "Preencher todos os campos" });
    }

    try {
        const usuario = await Usuario.findOne({ email: email, password: password });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        res.json({ error: null, msg: "Login bem-sucedido", usuarioId: usuario._id });
    } catch (error) {
        res.status(400).json({ error });
    }
})

const ProdutoSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    descricao: { type: String},
    fornecedor: { type: String},
    dataFabricacao: { type: Date},
    quantidadeEstoque: { type: Number}
});

const Produto = mongoose.model("Produto", ProdutoSchema);

app.post("/cadprodutos", async (req, res) => {
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const dataFabricacao = req.body.dataFabricacao;
    const quantidadeEstoque = req.body.quantidadeEstoque;
  
    if(codigo == null || descricao == null || fornecedor == null || dataFabricacao == null || quantidadeEstoque == null){
      return res.status(400).json({error : "Preencha todos os campos"});
    }
  
    const produtoExiste = await Produto.findOne({codigo : codigo});
  
    if(produtoExiste){
      return res.status(400).json({error : "O produto informado já existe"});
    }
  
    
    const produto = new Produto({
      codigo: codigo,
      descricao: descricao,
      fornecedor: fornecedor,
      dataFabricacao: dataFabricacao,
      quantidadeEstoque: quantidadeEstoque
    });
  
    try {
      const newProduto = await produto.save();
      res.json({ error: null, msg: "Cadastro ok", ProdutoId: newProduto._id });
    } catch (error) {}
});






app.get("/index.html", async(req, res)=> {
    res.sendFile(__dirname + "/index.html")
})

app.get("/cadastro.html", async(req, res)=> {
    res.sendFile(__dirname + "/cadastro.html")
})

app.get("/login.html", async(req, res)=>{
    res.sendFile(__dirname + "/login.html")
})

app.get("/cadprodutos.html", async(req, res)=>{
    res.sendFile(__dirname + "/cadprodutos.html")
})

app.get("/sobre.html", async(req, res)=>{
    res.sendFile(__dirname + "/sobre.html")
})

app.listen(port, ()=>{
    console.log(`O servidor está rodando na porta ${port}`)
})