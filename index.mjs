import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const dp = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "school",
  password : "mo55407499",
  port : 5432,
});
const app = express();
const port = 3005;

dp.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

dp.query("SELECT (name,password) from admin")
app.get("/main",(req,res)=>{
    res.render("home.ejs");
})
app.get("/", (req,res)=>{
    res.render("Login.ejs");
})
app.post("/login", async(req,res)=>{
    let username = req.body.email;
    let password = req.body.password; //okay this is the supposed to be the user entered data right ?
    
    try{
        const results = await dp.query("SELECT password FROM admin WHERE name = ($1)",[username]);
        console.log(results.rows);
        if(results.rowCount > 0){
            if(results.rows[0].password == password){
            //this means that user is registered and do actully exist in our database and password is correct
                console.log("correct password")
                res.redirect("main");
            }
            else{
                console.log("wrong password")
                //wrong password ? //it supposed to be working right now right
                res.render("Login.ejs",{message:"Wrong Password"})
            }
        }
        else{
            //user does not exist
            console.log("user does not exist");
            res.render("Login.ejs", {message:"User does not exist"});
        }
    }catch(err){
        console.log(err);
    }

})
app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
})
app.get("/main",(req,res)=>{
    res.render("home.ejs");
})
app.get("/Admincontrol",(req,res)=>{
    res.render("Admincontrol.ejs");
})

app.get("/add-student",(req,res)=>{
    res.render("addStudent.ejs");
})
app.get("/add-teacher",(req,res)=>{
    res.render("addTeacher.ejs");
})
app.get("/add-user",(req,res)=>{
    res.render("addUser.ejs");
})
app.get("/FAQ",(req,res)=>{
    res.render("FAQ.ejs");
})
app.get("/pack",(req,res)=>{
    res.render("packages.ejs");
})

app.post("/register-student",async (req,res)=>{
    const name = req.body.studentName;
    const Stdntclass = req.body.classNum;
    const Stdntgrade = req.body.studentGrade;
    const Stdntpass = req.body.studentPass;

    let grade = parseInt(Stdntgrade, 10);
    let classnum = parseInt(Stdntclass, 10);

    console.log(grade+" - "+classnum)
    try{
        await dp.query("INSERT INTO student (name,grade,classnum,password) VALUES ($1,$2,$3,$4)",[name, grade, classnum,Stdntpass]);
        console.log("Student has been registered");
        res.render("addStudent.ejs",{message: "Student Has been registered!"});

    }catch(err)
    {
        res.render("addStudent.ejs",{message:"An error occured "+err});
    }
});
app.post("/add-student", async (req,res)=>{
    res.redirect("/add-student");
});


app.post("/register-teacher",async (req,res)=>{
    const name = req.body.teacherName;
    const teacherCourse = req.body.techCourse;
    const teacherEmail = req.body.teacEmail;
    try{
        await dp.query("INSERT INTO teacher (name,course,email) VALUES ($1,$2,$3)",[name,+teacherCourse,teacherEmail]);
        console.log("Student has been registered");
        res.render("addTeacher.ejs",{message: "Teacher Has been registered!"});

    }catch(err)
    {
        res.render("addTeacher.ejs",{message:"An error occured "+err});
    }
});

app.post("/add-teacher",(req,res)=>{
    res.redirect("/add-teacher");
})


app.get("/registered-students",async(req,res)=>{
    try{
        const result = (await dp.query("SELECT * FROM student"));
        //results supposed to be students rows
        console.log(result.rows);
        res.render("showStudent.ejs",{student: result.rows});
    }catch(err){
        console.log(err);
    }
})


app.listen(port, () => {
console.log(`Server running on port ${port}`);
});