import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.get("/iusers", async (req, res) => {
  let collection = await db.collection("iusers");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/ilogs", async (req, res) => {
  let collection = await db.collection("ilogs");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/iratings", async (req, res) => {
  let collection = await db.collection("iratings");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

export default router;