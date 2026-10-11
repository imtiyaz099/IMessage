// const express = require("express")
import express from "express";
import "dotenv/config";
import cors from "cors";
import job from "./lib/cron.js";

import fs from "fs"
import path from "path"

import {clerkMiddleware} from "@clerk/express"

import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import clerkWebhook  from "./webhooks/clerk.webhook.js"

const app = express();
const port = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

// its important you don't parse the webhook event data , it should be in the raw format
app.use("/api/webhooks/clerk",express.raw({type: "application/json"}),clerkWebhook);

app.use(express.json());
app.use(cors({origin : FRONTEND_URL , Credential : true}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// if the public directory exists, serve the static files 
// this is for the production build 
if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));
    app.get("/{*any}",(req,res,next)=>{
        res.sendFile(path.join(publicDir,"index.html" , (err) => next(err)))
    })
}

app.listen(port, () => {
  connectDB();
  console.log(`Server is up and runnning on port : ${port}`);

  if(process.env.NODE_ENV === "production") {
    job.start(); // start the cron job
  }
});
