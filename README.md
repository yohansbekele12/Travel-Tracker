# Travel Tracker

**Travel Tracker** is a web application to log and display visited countries. Users can add countries they've visited, and the app ensures no duplicates are added. It displays a list of visited countries and allows users to add more.

---

## Features
- **View Visited Countries**: Displays a list of countries the user has visited.
- **Add New Countries**: Users can add countries to the visited list using a search functionality.
- **Prevent Duplicates**: Duplicate country entries are avoided.
- **Error Handling**: Provides feedback when a country is not found or already exists.

---

## Requirements
- **Node.js** (v20.16.0 or higher)
- **PostgreSQL** database
- **npm packages**:
  - `express`
  - `body-parser`
  - `pg`
  - `dotenv`
  - `ejs`

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository_url>
cd travel-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root with the following details:
```
DB_PASSWORD=<your_postgres_password>
DB_PORT=<your_postgres_port>
```

### 4. Initialize Database
Create a PostgreSQL database and execute the following SQL:
```sql
CREATE DATABASE world;

CREATE TABLE countries (
    country_code VARCHAR(3) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL
);

CREATE TABLE visited_countries (
    country_code VARCHAR(3) PRIMARY KEY REFERENCES countries(country_code)
);
```

### 5. Run the Application
Start the server:
```bash
node index.js
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Adding a Country
1. Enter a country name in the input field.
2. Click "Add".
3. If the country exists in the database, it will be added to the list of visited countries.

### Viewing Visited Countries
- All visited countries are displayed on the homepage along with the total count.

---

## Known Issues
- Ensure the `countries` table is populated with valid `country_code` and `country_name` data for the search functionality to work.
- Wildcard search (`LIKE`) might return unintended matches for very short country names.

---

## Contributing
Feel free to submit issues or pull requests for new features or bug fixes.

---

## License
This project is open-source and available under the [MIT License](LICENSE).
