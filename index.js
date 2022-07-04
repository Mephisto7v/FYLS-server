const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "Mfcmv74!",
    database: "databasewebsite"
});

mysql.createConnection({multipleStatements: true});

app.post("/api/AddUser", (req, res) => {
    const {email,mdp,prenom,nom,ville,adresse} = req.body.data;
    var admin =false;
    if(req.body.data.admin === 'on')  admin = true;
    db.query(
      "INSERT INTO user (UserEmail, UserPassword, UserFirstName, UserLastName, UserCity, UserAddress,admin) VALUES (?,?,?,?,?,?,?)",
      [email, mdp, prenom, nom, ville, adresse, admin],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          db.query("SELECT UserID, UserFirstName, admin FROM user where UserEmail=? and UserPassword=?",
            [email, mdp], 
            (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send(result);
            }
          });
        }
      }
    )
})

app.get("/api/VerifyUser", (req, res) => {
  console.log(req);
  const email = req.query.data['email'];
  const mdp = req.query.data['mdp'];
  db.query("SELECT UserID, UserFirstName, admin FROM user where UserEmail=? and UserPassword=?",
  [email, mdp], 
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/insertBien", (req, res) => {
  console.log(req.body);
  const nom = req.body.data.nom;
  const prix = req.body.data.prix;
  const stock = req.body.data.stock;
  const description = req.body.data.description;
  const fileName = req.body.file;
  db.query(
    "INSERT INTO products (ProductName, ProductPrice, ProductStock, ProductDescription, ProductImage) VALUES (?,?,?,?,?);",
    [nom, prix, stock, description, fileName],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Une erreur est survenu lors de l'ajout du produit")
      } else {
        res.send("Le produit a été ajouter avec succès");
      }
    }
  )
})

app.get("/api/getProduct", (req, res) => {
  db.query("SELECT * FROM Products", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
});