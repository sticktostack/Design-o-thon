const express = require("express");
const router = express.Router();

const {
  addRound,
  getRounds,
  deleteRound
} = require("../controllers/roundController");

router.post("/add", addRound);
router.get("/all", getRounds);
router.delete("/delete/:id", deleteRound);

module.exports = router;