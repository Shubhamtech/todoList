const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const date=require(__dirname + "/date.js"); //custom module
//console.log(date.getDate());
const app=express();
//let items=['code','buyfood','eat','sleep'];
//let workItems=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs'); //tell our app which is generated using express to use ejs
mongoose.set('strictQuery', false);
//create new DB in mongodb
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
const itemsSchema={
    name:String
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
 name:"welcome to todolist"
});
const item2=new Item({
    name:"use + to add new items"
});
const item3=new Item({
  name:"<- use this to remove item"
});

const defaultItems=[item1,item2,item3];


const listSchema={
    name:String,
    items:[itemsSchema]  //array of item document
}
const List=mongoose.model("List",listSchema);



app.get("/",function(req,res){
//couputation logic or business logic write here

//var today= new Date();


/*if(currentDay==6 || currentDay==0 ){
    //res.send("<h1>yay! its weekend</h1>"); //res.send send only single piece of data for multiple piece of data  use res.write
   day="weekend";
  
}
else{
   // res.write("<h1>ooh its week day!<h1>");
   // res.write("<i> you have to be a workholia</i>");
   //res.sendFile(__dirname + "/index.html");
   // res.send();
   day="weekday";
   
}*/
/*switch (currentDay) {
    case 0:
        day="sunday";
        break;
     case 1:
        day="monday";
        break;
     case 2:
        day="tuesday";
        break;
     case 3:
         day="wednesday";
         break;
     case 4:
         day="thrusday";
         break;
    case 5:
        day="friday";
        break;
    case 6:
        day="saturday";
        break;
                                    
    default:
        console.log("error current day is equal to" + currentDay);
        //break;
}*/
/*var options={
    weekday: "long",
    day:"numeric",
    month:"long"
};
var day=today.toLocaleDateString("en-US",options); */

let day=date.getDate();
 Item.find({},function(err,foundItems){

  if(foundItems.length===0){
    Item.insertMany(defaultItems,function(err){
        if(err){
            console.log(err);
        }
        else{
           console.log("sucessfully saved/inserted default items on db");
        }
    });
     
  }
    
  if(err){
    console.log(err);
  }
  else{
    //console.log(foundItems); //day
    res.render("list",{listTitle:"Today work",newListItems:foundItems,dd:date.getDate()}); //ejs 
  }
  
 });
});
//res.render("list",{listTitle:day,newListItems:items}); //ejs
//res.send("hello");

app.get("/:customListName",function(req,res){
    //console.log(req.params.customListName);
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
             //create a new list
             const list=new List({
                name:customListName,
                items:defaultItems
             });
             list.save();
             res.redirect("/" + customListName); 
            }
            else{
                //render/show existing list
                res.render("list",{listTitle:foundList.name, newListItems:foundList.items,dd:date.getDate()});
            }
        }
    });//DateDay:date ,DateDay:date <h1> <%=DateDay %> </h1>
});



app.post("/",function(req,res){
 let itemName=req.body.newItem;
 let listName=req.body.list;
const item= new Item({
    name:itemName
});
if(listName==="Today work"){
    item.save();
    res.redirect("/");
}
else{
    List.findOne({name:listName},function(err,foundList){
     foundList.items.push(item);
     foundList.save();
     res.redirect("/" + listName);
    });
}
//item.save();
//res.redirect("/");
 //console.log(req.body);
 /*if(req.body.button==="work"){
    workItems.push(item);
    res.redirect("/work")
 }
 else{
    items.push(item);
    //console.log(item);
    res.redirect("/");
   }*/
 
});
app.post("/delete",function(req,res){
    //console.log(req.body.checkbox);
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;
    if(listName==="Today work"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err){
                console.log("sucessfully deleted checked item");
            }
            res.redirect("/");
        });
    }
    else{//delete request is form custom list
     List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
        if(!err){
            res.redirect("/" + listName); //redir to custom list path
        }
     });
    }
    
});

/*app.get("/work",function(req,res){
res.render("list",{listTitle:"work list",newListItems:workItems});
});*/
app.get("/about",function(req,res){
res.render("about");
});
app.listen(3000,function(){
 console.log("server is sunning on port 3000");
});