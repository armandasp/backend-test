const express = require('express');
const cors = require('cors');

const { port } = require('./config');

const auth = require('./routes/v1/auth');
const bills = require('./routes/v1/bills');
const accounts = require('./routes/v1/accounts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/auth', auth);
app.use('/v1/bills', bills);
app.use('/v1/accounts', accounts);

app.get('/', (req, res) => {
  res.send({ msg: 'Server is working succesfully' });
});

app.all('*', (req, res) => {
  res.status(400).send({ err: 'Page not found' });
});

app.listen(port, console.log(`Server is running on port ${port}`));
