import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// This section will help you get a list of all iusers
router.get("/iusers", async (req, res) => {
  let collection = await db.collection("iusers");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/ilogs", async (req, res) => {
  let collection = await db.collection("ilogs");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

export default router;