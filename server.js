const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/dhbw-broker-web/browser')));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/dhbw-broker-web/browser', 'index.html'));
});

app.listen(process.env.PORT || 4200, () => {
  console.log(`Server running on port ${process.env.PORT || 4200}`);
});
