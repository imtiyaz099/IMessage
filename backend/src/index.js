// const express = require("express")
import express from "express";
import "dotenv/config";
import cors from "cors";

import {clerkMiddleware} from "@clerk/express"

import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cors({origin : FRONTEND_URL , Credential : true}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is up and runnning on port : ${port}`);
});
