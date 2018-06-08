const express = require('express');
const add = require('./add.json');
const basic = require('./basic.json');

const app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/api/v1/forms/add', (req, res) => {
	console.log('hit me');
	res.json(add);
});

app.post('/api/v1/action/execute', (req, res) => {
	console.log('hit me');
	res.json(basic);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
