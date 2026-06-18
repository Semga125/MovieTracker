#  MovieTracker

A full-stack web application where users can register, add movies, mark favourites, and manage their personal film collection.

---

## Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcrypt

**Frontend**
- Vanilla JavaScript
- Tailwind CSS (CDN)
- HTML5

---

## Features

- **Authentication** — Register and log in with a username and password. Passwords are hashed with bcrypt. Sessions are managed via JWT access tokens stored in localStorage.
- **Movie List** — All movies added by any user are displayed on the home page as cards with poster, title, year, genre, description, and the name of who added them.
- **Add Movie** — Logged-in users can add a movie by filling in a modal form (title required; year, genre, poster URL, and description are optional).
- **Delete Movie** — Users can delete only the movies they added themselves. The delete button is only visible on your own movies.
- **Favourites** — Users can mark any movie as a favourite by clicking the ★ button on a card. Clicking again removes it. The Favourite button in the header toggles between all movies and your favourites list.
- **Search** — Live search filters the movie list by title as you type. No extra server requests — filtering happens on the already-loaded data.
- **Account Page** — Displays your user ID, username, and registration date.
- **Logout** — Available both on the home page (Quit button) and the account page (Logout button). Clears the token and redirects to the index page.

---

## Project Structure

```
├── server.ts           # Express app entry point
├── db.ts               # PostgreSQL connection pool
├── middleware/
│   └── auth.ts         # JWT verification middleware
├── routes/
│   ├── tasks.ts        # Route definitions
│   └── controlers.ts   # Request handlers
├── frontend/
│   ├── index.html      # Landing page
│   ├── register.html   # Registration page
│   ├── login.html      # Login page
│   ├── home.html       # Main movie list page
│   ├── account.html    # User profile page
│   ├── home.js         # Home page logic
│   ├── account.js      # Account page logic
│   ├── register.js     # Registration logic
│   ├── login.js        # Login logic
│   └── style.css       # Global styles
```

---

## Database Schema

```sql
users (id, username, password_hash, created_at)
movies (id, title, year, genre, poster_url, description, created_by, created_at)
favorites (id, user_id, movie_id)
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /users/register | No | Register a new user |
| POST | /users/login | No | Log in and receive access token |
| GET | /users/profile | Yes | Get current user profile |
| GET | /users/movies | Yes | Get all movies |
| POST | /users/movies | Yes | Add a new movie |
| DELETE | /users/movies/:id | Yes | Delete a movie (owner only) |
| GET | /users/movies/favorites | Yes | Get current user's favourites |
| POST | /users/movies/:id/favorite | Yes | Toggle favourite on a movie |

---

## Getting Started

**1. Clone the repository and install dependencies:**
```bash
npm install
```

**2. Create a `.env` file:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
ACCESS_SECRET=your_secret_key
PORT=10000
```

**3. Set up the database:**

Run the following SQL to create the required tables:
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    genre VARCHAR(100),
    poster_url TEXT,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(user_id, movie_id)
);
```

**4. Start the server:**
```bash
npx ts-node server.ts
```

**5. Open the frontend:**

Open `index.html` with Live Server or any static file server.

---

## Notes

- JWT refresh tokens are not implemented — the access token expires in 24 hours.
- Movie posters are loaded via external URLs, no file uploads.
- The frontend uses Tailwind CSS via CDN, suitable for development only.
