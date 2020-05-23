const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

app.use(methodOverride("_method"));

mongoose.connect(
  "mongodb+srv://admin-abhishek:abhishek@cluster0-voopf.mongodb.net/todoDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const listSchema = new mongoose.Schema({
  task: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const List = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  List.find({})
    .lean()
    .sort({ date: "desc" })
    .then((list) => {
      res.render("index", {
        list: list,
      });
    });
});

app.get("/edit/:id", (req, res) => {
  List.findOne({ _id: req.params.id })
    .lean()
    .then((list) => {
      res.render("edit", {
        list: list,
      });
    });
});

app.post("/", (req, res) => {
  const newList = {
    task: req.body.task,
  };

  new List(newList).save().then(() => {
    res.redirect("/");
  });
});

app.put("/edit/:id", (req, res) => {
  const editedTask = req.params.id;

  List.findOne({ _id: editedTask }).then((list) => {
    list.task = req.body.task;

    list.save().then((list) => {
      res.redirect("/");
    });
  });
});

app.delete("/delete/:id", (req, res) => {
  List.deleteOne({ _id: req.params.id }).then((list) => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`The server is running on PORT: ${PORT}`);
});
