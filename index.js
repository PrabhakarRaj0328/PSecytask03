import express from "express";
const app= express();
const port=3000;
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Console } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Attendance",
  password: "2627#23",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/models', express.static(path.join(__dirname, 'models')));

async function checkLogin(){
const result = await db.query('SELECT username,password FROM userdata');
return(result);
}
app.get("/dashboard/markAttendance",(req,res)=>{
  res.render("markAttendance.ejs");
});
app.post("/dashboard/img",(req,res)=>{
global.data = req.body;
});
app.post("/dashboard/addUser/UserStatus", async(req,res)=>{
  const username =req.body.username;
  const password =req.body.password;
await db.query('INSERT INTO userdata (username , password , data) VALUES($1 ,$2 , $3)',[username,password,data]);
try{
res.render("response.ejs",{
  message: "User Added Successfully",
});}
catch(err){
  res.render("response.ejs",{
  message: err,
})}});
app.get('/dashboard/addUser/takePhoto',(req,res)=>{
  res.render("camera.ejs");
})
app.get('/dashboard/addUser',(req,res)=>{
  res.render("addUser.ejs");
})
app.get("/adminLogIn", (req,res)=>{
  res.render("admin.ejs");
})
app.post('/adminLogIn/admin', async(req,res)=>{
  const username=req.body.username;
  const password= req.body.password;
  const result = await checkLogin();
  if(result.rows[0].username == username && result.rows[0].password == password)
  res.render("dashboard.ejs",{
user: "admin",});
else
res.render("dashboard.ejs",{
  error: "Wrong Username or Password",
})
});

app.post("/dashboard/markAttendance",async(req,res)=>{
const datafaces = await db.query('SELECT data FROM userdata');
app.get('/dashboard/checkFaces',async(req,res)=>{
  res.json(datafaces);
});
app.post("/dashboard/result",async(req,res)=>{
  let dat='';
  if(req.body.status=="found")
dat = "Attendance Marked";
else
dat = "User not found";
req.customData = dat;
})
res.status(204).send()})

app.post("/dashboard", async(req,res)=>{
  const username= req.body.username;
  const password= req.body.password;
  const result = await checkLogin();
  let error='';
  let user='';
result.rows.forEach((data)=>{
 
  if(data.username == username ){
if(data.password == password)
user =data.username;
else
 error ="Wrong Password";
}
})
if(user==""&& error=="")
error="User does not Exist";

if(error!="")
res.render("dashboard.ejs",{
error:error,});
else
res.render("dashboard.ejs",{
  user: user,
});
})
app.get('/logout',(req,res)=>{
  res.redirect('/');
});
app.get('/',(req,res)=>{
  res.render('login.ejs');
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
