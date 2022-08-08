const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Link = require("./models/linkModel.js");
const methodOverride=require('method-override');

mongoose
  .connect("mongodb://localhost:27017/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Mongo connection error!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get("/", (req, res) => {
  res.render("main.ejs");
});
app.get("/new", (req, res) => {
  res.redirect("/");
});
app.post("/new", async (req, res) => {
  const newLink = new Link(req.body);
  await newLink.save();
  res.render("success.ejs");
});
app.get("/view_links", async(req, res) => {
  const allLinks=await Link.find({})
  res.render('viewLinks.ejs',{allLinks})
});
app.get("/:code/edit",async(req,res)=>{
  const foundLink=await Link.findOne(req.params)
  res.render('edit.ejs',{foundLink})
})
app.patch("/:id/update",async(req,res)=>{
  const {id}=req.params;
  const requestBody=req.body
  let {code:newCode,link:newLink}=(requestBody)
  await Link.findByIdAndUpdate(id,{code:newCode,link:newLink})
  res.redirect('/view_links')
})
app.delete("/delete/:id",async(req,res)=>{
  const {id}=req.params;
  await Link.findByIdAndDelete(id)
  res.redirect('/view_links')
})
app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const foundData = await Link.findOne({ code: code });
  if (foundData) {
    res.redirect(`${foundData.link}`);
  } else {
    res.render("notFound.ejs");
  }
});

app.listen("1234", () => {
  console.log("Listening on 1234");
});
