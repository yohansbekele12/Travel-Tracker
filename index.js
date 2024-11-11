import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();
let country_code = [];
let total = 0;

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  country_code = [];
  const result = await db.query(
    "SELECT country_code FROM public.visited_countries"
  );

  const data = result.rows;

  data.forEach((country) => {
    country_code.push(country.country_code);
  });

  total = data.length;

  // rendern the result
  res.render("index", { countries: country_code, total });
});

//post route qurey data from countries Db using user inpute
let test = "".toLowerCase;
app.post("/add", async (req, res) => {
  const input = req.body["country"]; //access property of inpute

  // query countries DB for country code
  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name =$1",
    [input.toLowerCase()]
  );
  const data = result.rows;
  if (data.length !== 0) {
    data.forEach((country) => {
      country_code.push(country.country_code);
      test = country.country_code;
    });

    // Store the counries code in visited countries DB             // Avoid duplicates ON CONFLICT (country_code) DO NOTHING
    try {
      const result = await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1) ON CONFLICT (country_code) DO NOTHING ",
        [test]
      );

      if (result.rowCount > 0) {
        console.log("insert successfull ");
      } else {
        console.log("data alredy exist or insertion faild ");
      }
    } catch (error) {
      console.error("faild query requeste  ");
    }

    res.redirect("/");
  } else {
    console.error("data return undifined or not requested correctly ");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
