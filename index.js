const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const keys = require('./keys.json');

app.use(bodyParser.urlencoded({ extended: true }));

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Berhasil terhubung ke Google Sheets!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


app.post('/submit-form', (req, res) => {
  const NIS = req.body.NIS;
  const nama = req.body.nama;
  const select = req.body.select;
  const nilai = req.body.nilai;

  const sheets = google.sheets({ version: 'v4', auth: client });

  sheets.spreadsheets.values.append({
    spreadsheetId: '1LJ3-aUgOrBK1wPCeJWUojxkajZh0lCmsamu6NC3Hle4',
    range: 'DATA!A:A',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [NIS,nama,select,nilai]
      ]
    }
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(result.data);
      res.send('Data berhasil ditambahkan ke Google Sheets');
    }
  });
});
