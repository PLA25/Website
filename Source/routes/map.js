/** Requires the Express module for routing. */
const express = require('express');

/** Creates router instance for this route. */
const router = express.Router();

/** Displays the map page content. */
router.get('/', (req, res) => {
  /** Renders the view 'map'. */
  res.render('map', {});
});

module.exports = router;
