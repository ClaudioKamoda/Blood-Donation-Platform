const express = require("express");
const server = express();

//confgurando os arquivos estáticos
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

const Pool = require("pg").Pool;
const db = new Pool({
	user: "postgres",
	password: "0000",
	host: "localhost",
	port: 5432,
	database: "doe"
});

//configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
	express: server,
	noCache: true
});

//apesentação da página
server.get("/", function(req, res) {
	db.query("select * from donors", function(err, result) {
		if (err) return res.send("erro no banco de dados");

		const donors = result.rows;
		return res.render("index.html", { donors });
	});
});

server.post("/", function(req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const blood = req.body.blood;

	if (name == "" || email == "" || blood == "") {
		res.send("Todos os campos são obrigatórios");
	}

	const consulta = `insert into donors ("name", "email", "blood") values($1, $2, $3)`;

	const values = [name, email, blood];

	db.query(consulta, values, function(err) {
		if (err) return res.send("erro no banco de dados");

		return res.redirect("/");
	});
});

//iniciando o server
server.listen(3000);
