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

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Middleware for checking visited countrys

async function getVisitedCountries() {
  const result = await db.query("SELECT country_code FROM visited_countries ");

  return result.rows.map((rows) => rows.country_code);
}

app.get("/", async (req, res) => {
  try {
    const country_code = await getVisitedCountries();
    const total = country_code.length;

    res.render("index", { countries: country_code, total });
  } catch (error) {
    console.error("Error while querying the database: ", error);
    res.status(500).send("Server Error");
  }
});

//post route qurey data from countries Db using user inpute
let test = "";
app.post("/add", async (req, res) => {
  const input = req.body["country"].toLowerCase();
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE country_name LIKE '%' || $1 || '%'",
      [input]
    );
    const data = result.rows;
    if (data.length !== 0) {
      data.forEach((country) => {
        country_code.push(country.country_code);
        test = country.country_code;
      });

      // Store the country code in visited countries DB             // Avoid duplicates ON CONFLICT (country_code) DO NOTHING
      try {
        const result = await db.query(
          "INSERT INTO visited_countries (country_code) VALUES ($1) ON CONFLICT (country_code) DO NOTHING ",
          [test]
        );

        if (result.rowCount > 0) {
          console.log("insert successfull ");
          res.redirect("/");
        } else {
          const countries = await getVisitedCountries();
          res.render("index", {
            countries: countries,
            error: "data alredy exist please inset new Country",
            total: countries.length,
          });
          console.log("data alredy exist or insertion faild ");
        }
      } catch (error) {
        console.error("faild query requeste  ");
      }
    } else {
      const countries = await getVisitedCountries();
      res.render("index", {
        countries: countries,
        error: "country not found",
        total: countries.length,
      });
      console.log("country not found ");
    }
  } catch (error) {
    console.error("Error while querying the database: ", error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
