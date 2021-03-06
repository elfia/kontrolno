const express = require('express');
const app = express();
const port = process.env.PORT || 3300;
const path = require('path');

const fs = require('fs');

const spisak = {};
const kontrolnoBlanki = [];
let current = 0;

fs.readdirSync('blanki/').forEach((file) => {
  if (file !== '.DS_Store') {
    kontrolnoBlanki.push(file);
  }
});

console.log('Kontrolni: ', kontrolnoBlanki);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.use('/static/css', express.static(path.join(__dirname, '/build/static/css')));
app.use('/static/js', express.static(path.join(__dirname, '/build/static/js')));
app.use('/blanki', express.static(path.join(__dirname, '/blanki')));

app.get('/start', function (req, res) {
  const newEntry = (req.query.klass + '_' + req.query.ime.trim() + '_' + req.query.nomer).toLowerCase();
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
  // fs.appendFile('tests/' + newEntry + '.txt', spisak[newEntry], function (err) {
  //   if (err) {
  //     console.log(err);
  //     delete spisak[newEntry];
  //     res.status(400).send({
  //       message: 'Не можахме да те запишем',
  //     });
  //     return;
  //   }

  //   // var file = fs.createReadStream(__dirname + '/blanki/' + spisak[newEntry]);
  //   // var stat = fs.statSync(__dirname + '/blanki/' + spisak[newEntry]);
  //   // res.setHeader('Content-Length', stat.size);
  //   // res.setHeader('Content-Type', 'application/pdf');
  //   // res.setHeader('Content-Disposition', 'attachment; filename=kontrolno.pdf');
  //   // file.pipe(res);

  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.write('/blanki/' + spisak[newEntry]);
  //   res.end();
  // });
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('/blanki/' + spisak[newEntry]);
  res.end();
});

app.listen(port, () => console.log(`Kontrolno app listening at http://localhost:${port}`));
