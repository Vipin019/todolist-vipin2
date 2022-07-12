//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// const items=[];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://Vipin019:Vipin019@cluster0.8tamcce.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 ={
  name: "Nothing to do",
};
// const item2 = new Item({
//   name: "buy Butter",
// });
// const item3 = new Item({
//   name: "Complet H.W.",
// });

const defaulItems = [item1];

// const listSchema={
//   name: String,
//   items:[itemsSchema]
// };

// const List=mongoose.model("List",listSchema);


app.get("/", function (req, res) {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  var currentdate = today.toLocaleDateString("en-US", options);
  Item.find(function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaulItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("saved!!");
          }
        });
        res.redirect("/");
      }
       else {
        res.render("index.ejs", { num: currentdate, item: foundItems });
      }
    }
  });
});
app.post("/", function (req, res) {
  const newItemName = req.body.newItem;
  const newItem = new Item({
    name: newItemName,
  });
  newItem.save();
  res.redirect("/");
});
app.post("/delete", function (req, res) {
  const chekedItemId = req.body.checkbox;
  Item.findByIdAndRemove(chekedItemId, function (err) {
    console.log("deleted");

    res.redirect("/");
  });
});

// app.get("/:customList", function(req, res){
//   const customListName=req.params.customList;
//   List.findOne({name: customListName},function(err,foundList){
//     if(!err){
//       if(!foundList){
//         //creat new list
//         const list =new List({
//           name: customListName,
//           items: defaulItems
//         })
//       }
//       else{
//         res.render("index.ejs",{num: foundList.name, item: foundList.items})
//       }
//     }
//   })
  
// })
const port=process.env.PORT ;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
