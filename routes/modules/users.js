const express = require('express');

const router = express.Router();

router.get('/', (req, res) =>
  res.send(`You pass the authentication to here by path /users`)
);

module.exports = router;
