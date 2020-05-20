const express = require('express');
const app = express();
const port = process.env.PORT || 3300;
const path = require('path');

const fs = require('fs');

const spisak = {};
const kontrolnoBlanki = [];
const domashnoBlanki = [];
let current = 0;

fs.readdirSync('blanki/').forEach((file) => {
  if (file !== '.DS_Store') {
    kontrolnoBlanki.push(file);
  }
});

fs.readdirSync('domashno/').forEach((file) => {
  if (file !== '.DS_Store') {
    domashnoBlanki.push(file);
  }
});

console.log('Kontrolni: ', kontrolnoBlanki);
console.log('Domashni: ',domashnoBlanki);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.use('/static/css', express.static(path.join(__dirname, '/build/static/css')));
app.use('/static/js', express.static(path.join(__dirname, '/build/static/js')));
app.use('/blanki', express.static(path.join(__dirname, '/blanki')));
app.use('/domashno', express.static(path.join(__dirname, '/domashno')));

app.get('/start', function (req, res) {
  const newEntry = req.query.klass + '_' + req.query.ime + '_' + req.query.nomer;
  if (!spisak[newEntry]) {
    spisak[newEntry] = kontrolnoBlanki[current];
    current++;
    console.log('НОВ УЧЕНИК: ' + newEntry + ' със задание: ' + spisak[newEntry]);
    if (current == kontrolnoBlanki.length) {
      current = 0;
    }
  } else {
    console.log('Повторен опит за дете: ' + newEntry + ' със задание: ' + spisak[newEntry]);
  }
  console.log(spisak);
  fs.appendFile('tests/' + newEntry + '.txt', spisak[newEntry], function (err) {
    if (err) {
      console.log(err);
      delete spisak[newEntry];
      res.status(400).send({
        message: 'Не можахме да те запишем',
      });
      return;
    }

    // var file = fs.createReadStream(__dirname + '/blanki/' + spisak[newEntry]);
    // var stat = fs.statSync(__dirname + '/blanki/' + spisak[newEntry]);
    // res.setHeader('Content-Length', stat.size);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=kontrolno.pdf');
    // file.pipe(res);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('/blanki/' + spisak[newEntry]);
    res.end();
  });
});

app.get('/domashno', function (req, res) {
  const newEntry = req.query.klass + '_' + req.query.ime + '_' + req.query.nomer;
  if (!spisak[newEntry]) {
    spisak[newEntry] = domashnoBlanki[current];
    current++;
    console.log('НОВ УЧЕНИК: ' + newEntry + ' със задание: ' + spisak[newEntry]);
    if (current == domashnoBlanki.length) {
      current = 0;
    }
  } else {
    console.log('Повторен опит за дете: ' + newEntry + ' със задание: ' + spisak[newEntry]);
  }
  console.log(spisak);
  fs.appendFile('tests/' + newEntry + '.txt', spisak[newEntry], function (err) {
    if (err) {
      console.log(err);
      delete spisak[newEntry];
      res.status(400).send({
        message: 'Не можахме да те запишем',
      });
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('/domashno/' + spisak[newEntry]);
    res.end();
  });
});

app.listen(port, () => console.log(`Kontrolno app listening at http://localhost:${port}`));
