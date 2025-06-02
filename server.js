const express= require("express");
const bodyparser=require('body-parser');
const mongoose=require('mongoose');

const  app=express();

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://arunku9050:zsgXK66fy4Hk75Nu@cluster0.jsl0dve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("MOngoDB CONNECTED"))
    .catch(err=> console.log(err));


const tryschema =new mongoose.Schema({
    name:String
});
const item=mongoose.model("task",tryschema);
const defaultItems = [
    { name: "some video" },
    { name: "DSA" },
    { name: "Reactjs" },
    { name: "Nodejs" },
    { name: "some rest" }
];
item.find({}).then(existing=>{
    if(existing.length===0){
    item.insertMany(defaultItems)
    .then(() => console.log("Default items inserted"))
    .catch(err => console.log(err));
    }
});
app.get('/',async function(req,res){
    try{
    const foundItems=await item.find({});
        res.render("list",{dayej:foundItems}); 
    }catch(err){
        console.log(err);

        res.status(500).send("Internal server error");
    }
})

//post
// POST route to add new item
app.post('/', async function (req, res) {
    const itemName = req.body.ele1;
    if (itemName.trim() !== "") {
        const newItem = new item({ name: itemName });
        await newItem.save();
    }
    res.redirect('/');
});
//delete
app.post('/delete', async function (req, res) {
    const checked = req.body.checkbox1;
    
    try{
        await item.findByIdAndDelete(checked);
    }catch(err){
        console.log(err);
    }
    res.redirect('/');
});
app.listen("5000",function(){
    console.log("server is running");
});