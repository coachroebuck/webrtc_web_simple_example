let debug = require('debug')('socket_example:routes');
let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get(`${path.sep}`, function(req, res, next) {
  res.render(`${path.basename(__filename).replace(".js", "")}`, {
    title: `Broadcast`,
    name: 'John'
  });
});

module.exports = router;
module.exports.launchParams = null;
