const { lookupAddress } = require("../controllers/address.controller.js");
const express = require('express');
const router = express.Router();

router.get('/:city/:street_name/:street_num', lookupAddress);

module.exports = router;
