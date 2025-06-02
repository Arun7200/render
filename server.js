const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/todo")
    .then(() => console.log("MongoDB CONNECTED"))
    .catch(err => console.log(err));

// Schema and model
const tryschema = new mongoose.Schema({
    name: String
});
const item = mongoose.model("task", tryschema);

// Optional: Insert default items (only run once)
const defaultItems = [
    { name: "some video" },
    { name: "DSA" },
    { name: "Reactjs" },
    { name: "Nodejs" },
    { name: "some rest" }
];

item.find({}).then(existing => {
    if (existing.length === 0) {
        item.insertMany(defaultItems)
            .then(() => console.log("Default items inserted"))
            .catch(err => console.log(err));
    }
});

// GET route
app.get('/', async function (req, res) {
    try {
        const foundItems = await item.find({});
        res.render("list", { dayej: foundItems });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});

// POST route to add new item
app.post('/', async function (req, res) {
    const newTask = req.body.ele1;
    if (newTask.trim() !== "") {
        const newItem = new item({ name: newTask });
        await newItem.save();
    }
    res.redirect('/');
});

app.post('/delete', async function (req, res) {
    const checkedId = req.body.checkbox1;
    try {
        await item.findByIdAndDelete(checkedId);
    } catch (err) {
        console.log(err);
    }
    res.redirect('/');
});


app.listen(5000, function () {
    console.log("Server is running on port 5000");
});
