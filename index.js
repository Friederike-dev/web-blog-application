import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
//telling express that our static files are in the public folder
app.use(express.static("public"));
app.use(bodyParser.json());

let posts = [];

app.get("/", (req, res) => {
    const { type, adv } = getDayInfo();
    res.render("index.ejs", {
      dayType: type,
      advice: adv,
      posts: posts
    });
  });
  
  app.post("/submit", (req, res) => {
    const { type, adv } = getDayInfo();
    const newPostUser = req.body["postFromTextArea"];
    const now = new Date();
    const post = {
      text: newPostUser,
      date: now.toLocaleString(),
      isEditing: false
    };
    posts.unshift(post); // Fügt den neuen Post am Anfang des Arrays hinzu
    res.redirect('/');
  });

  app.post("/delete-post", (req, res) => {
    const index = req.body.index;
    if (index >= 0 && index < posts.length) {
      posts.splice(index, 1); // Entfernt den Post aus dem Array
    }
    res.redirect('/');
  });
  
  app.post("/edit-post", (req, res) => {
    const index = req.body.index;
    if (index >= 0 && index < posts.length) {
      posts[index].isEditing = true;
    }
    res.redirect("/");
  });

  app.post("/save-post", (req, res) => {
    
    const index = req.body.index;
    const editedPostUser = req.body["editedText"];
    if (index >= 0 && index < posts.length) {
      posts[index].text = editedPostUser;
      console.log(posts[index].text);
      posts[index].editedDate = new Date().toLocaleString(); // Fügt das Bearbeitungsdatum hinzu
      posts[index].isEditing = false;
    }
    res.redirect("/");
  });



  function getDayInfo() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const advices = ["enjoy the day!", "have a great week!", "stay positive!", "keep learning!", "almost ;-)", "almost weekend", "have a wonderful weekend!"];
    
    const now = new Date();
    const type = days[now.getDay()];
    const adv = advices[now.getDay()];
    return { type, adv };
  }


  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  
  