// server.js

// CONFIGURAÇÃO BASE
// ===========================================================================

// chamando os pacotes que precisamos
var express = require("express"); // chama o express
var app = express(); // define o nosso app utilizando o express
var bodyParser = require("body-parser");
var mongoose = require("mongoose"); // chama o mongoose

// conexão com o banco de dados
mongoose.connect('mongodb://127.0.0.1/bear');

var Bear = require("./app/models/bear");

// configurando o app para utilizar o body parser
// isso nos permitirá pegar um dado de um POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // seta a nossa porta

// ROTAS PARA A NOSSA API
// ===========================================================================
var router = express.Router(); // pega a instância da Router do express

// middleware a ser usado para todas as requisições
router.use(function (req, res, next) {
    // cria um log
    console.log("Alguma coisa está acontecendo...");
    next(); // certifica que vamos para as próximas rotas e não paremos aqui
});

// testa a rota para ter a certeza de que tudo está funcionando

router.get("/", function (req, res) {
    res.json({
        message: "Hooray! Bem-vindo à nossa API!"
    });
});

// mais rotas para nossa API vão vir aqui


// as rotas que terminam em /bears
// --------------------------------------------------
router.route("/bears").post(function (req, res) { // criando um urso (acessando no POST http://localhost:8080/api/bears)

    var bear = new Bear(); // cria uma nova instância do model Bear
    bear.name = req.body.name; // seta o nome do urso (vindo da requisição)

    // salva o urso e checa por erros
    bear.save(function (err) {
        if (err)
            res.send(err);

        res.json({
            message: "Urso criado!"
        });
    });
})

// pega todos os ursos (acessando no GET http://localhost:8080/api/bears)
.get(function (req, res) {

    Bear.find(function (err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
});

// sobre as rotas que terminam em /bears/:bear_id
// ----------------------------------------------------
router.route("/bears/:bear_id").get(function (req, res) { // pega o urso com o id tal (acessando no GET http://localhost:8080/api/bears/:bear_id)
    Bear.findById(req.params.bear_id, function (err, bear) {
        if (err)
            res.send(err);

        res.json(bear);
    });
})

// modifica o urso com seu id (acessando no PUT http://localhost:8080/api/bears/:bear_id)
.put(function (req, res) {
    // usa o Model Bear para encontrar o id do urso passado no parâmetro 3 da URL
    Bear.findById(req.params.bear_id, function (err, bear) {
        if (err)
            res.send(err);

        bear.name = req.body.name; // modifica as informações do urso

        // salva o urso
        bear.save(function (err) {
            if (err)
                res.send(err);

            res.json({
                message: "Urso modificado!"
            });
        });
    });
})

// deleta o urso com o id passado no parâmetro 3 da url (acessando no DELETE http://localhost:8080/api/bears/:bear_id)
.delete(function (req, res) {
    Bear.remove({_id: req.params.bear_id}, function (err, bear) {
        if (err)
            res.send(err);

        res.json({
            message: "Removido com sucesso!"
        });
    });
});

// REGISTRANDO NOSSAS ROTAS
// todas a nossas rotas terão o prefixo /api
app.use("/api", router);

// INICIANDO O SERVIDOR
// ============================================================================
app.listen(port);
console.log("Magic happens on port " + port);