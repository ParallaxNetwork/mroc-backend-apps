import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import fileupload from 'express-fileupload'

import jwtRouter from "../routes/jwt.js";
import userRouter from "../routes/user.js";
import ipfsRouter from "../routes/ipfs.js";
import apiRouter from "../routes/api.js";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload())

app.use("/jwt", jwtRouter);
app.use("/user", userRouter);
app.use("/ipfs", ipfsRouter);
app.use("/api", apiRouter);

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

app._router.stack.forEach(print.bind(null, []));

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
