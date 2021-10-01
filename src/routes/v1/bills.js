const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');

const { dbConfig } = require('../../config');
const { isLoggedIn } = require('../../middleware');

const billSchema = Joi.object({
  group_id: Joi.number().positive().required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
});

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ msg: 'bills works' });
});

router.get('/bill/:id', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM bills WHERE group_id = ${mysql.escape(req.params.id)}`,
    );
    con.end();
    res.send(data);
  } catch (err) {
    res.status(400).send({ err: 'data was not provided' });
  }
});

router.post('/bill', isLoggedIn, async (req, res) => {
  let billInputs = req.body;
  try {
    billInputs = await billSchema.validateAsync(billInputs);
  } catch (err) {
    return res.status(400).send({ err: 'inccorect data passed' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO bills (group_id, amount, description) VALUES (${mysql.escape(
        billInputs.group_id,
      )}, ${mysql.escape(billInputs.amount)}, ${mysql.escape(
        billInputs.description,
      )})`,
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data was not provided' });
  }
});

module.exports = router;
