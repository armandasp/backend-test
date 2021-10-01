const express = require('express');
const mysql = require('mysql2/promise');

const { dbConfig } = require('../../config');
const { isLoggedIn } = require('../../middleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ msg: 'acc works' });
});

router.get('/acc', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT accounts.group_id, cao_groups.name FROM accounts LEFT JOIN cao_groups ON (accounts.group_id = cao_groups.id) WHERE user_id = ${mysql.escape(
        req.user.id,
      )}`,
    );
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data was not passed' });
  }
});

router.post('/acc', isLoggedIn, async (req, res) => {
  const { group_id } = req.body;
  if (!group_id) {
    return res.status(400).send({ err: 'Inccorect data' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO accounts (group_id, user_id) VALUES (${mysql.escape(
        group_id,
      )}, ${mysql.escape(req.user.id)})`,
    );

    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(400).send({ err: 'data was not passed' });
  }
});

module.exports = router;
