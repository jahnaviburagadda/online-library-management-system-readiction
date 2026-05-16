# 📚 Readiction — Library Management System (v3)

A full-stack MERN digital library system with multilingual books, rental + penalty system, wishlist, and rich user profiles.

---

## Quick Start

### 1. Backend
```bash
cd readiction/backend
npm install
# Edit .env if needed (MongoDB URI, JWT secret)
npm run dev        # http://localhost:5000
```

### 2. Frontend
```bash
cd readiction/frontend
npm install
npm start          # http://localhost:3000
```

Make sure MongoDB is running locally, or set `MONGODB_URI` in `backend/.env` to your Atlas string.

---

## What's New in v3

### ✅ Registration — Confirm Password
- Removed: Student ID, Department fields
- Added: **Confirm Password** field with live match indicator (✓/✗)
- Added: **Show/Hide password** toggle (👁) on both password fields
- Password minimum 6 characters enforced
- Submit button disabled until passwords match

### ✅ Multilingual Books — Two Completely Separate Catalogs
| Catalog       | Where      | Books | Languages |
|---------------|-----------|-------|-----------|
| Browse        | Books Page | 18    | English, French, Russian, Japanese, Spanish, German, Portuguese, Italian |
| Genre Section | Genres Page| 24    | English, Russian, Spanish, French, German, Japanese, French, Italian |

**Zero overlap** between the two catalogs.

Language badge shown on every card (e.g. 🇫🇷 French, 🇯🇵 Japanese).
Language filter chips available on Books page and Genre detail pages.

### ✅ Book Cards — All Info Displayed
Every book card shows:
- **Language badge** (top-right corner)
- **Genre label**
- **Title & Author**
- **Star rating + numeric score**
- **Due-date strip** (when rented) — green/amber/red based on urgency:
  - 🟢 Green: `📅 Due 15 Jun · 5 days left`
  - 🟡 Amber: `⏳ Due in 1 day`
  - 🔴 Red: `⚠ Overdue by 3 days · ₹15 penalty`
- **Rent / Return button**
- **📖 Open Book button** (reads 15 pages in-browser)
- **♡ Wishlist button** (toggle add/remove)

### ✅ Penalty System
- 7-day rental period
- ₹5/day for overdue books — computed live
- Penalty shown on card strip, profile rental card, and admin table
- Pay button on profile rental cards
- Rentals blocked when unpaid dues exceed ₹50

### ✅ Profile — Full User Details
**Student Profile shows:**
- Avatar, Name, Email, Phone, Role badge (🎓 Student)
- Member Since, Rental Period, Penalty Rate
- Stats: Total / Active / Overdue / Returned / Unpaid Dues (₹)
- Full rental history sorted: Overdue → Active → Returned
- Overdue alert banner with total dues

**Admin Profile shows:**
- Same + Admin badge (👑 Administrator)
- Admin Dashboard: Overview, Add Book, Manage Books, All Rentals table

### ✅ Wishlist
- Dedicated **Wishlist page** (nav bar ♡ link)
- Toggle from any book card with the ♡ button
- Toast notifications: "Added to wishlist ♥" / "Removed from wishlist"

---

## API Endpoints

### Auth
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/auth/register`| Register (name, email, password, phone, role) |
| POST   | `/api/auth/login`   | Login                |
| GET    | `/api/auth/me`      | Current user (JWT)   |

### Books
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | `/api/books`                | Browse catalog (18 books) |
| GET    | `/api/books/genre-section`  | Genre catalog (24 books)  |
| GET    | `/api/books/genre/:genre`   | Filter genre catalog      |
| GET    | `/api/books/:id`            | Single book + pages       |
| POST   | `/api/books`                | Add book (admin)          |
| PUT    | `/api/books/:id`            | Update book (admin)       |
| DELETE | `/api/books/:id`            | Delete book (admin)       |

### Rentals
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/rentals/my`               | My rentals (live penalty)|
| GET    | `/api/rentals/all`              | All rentals (admin)      |
| POST   | `/api/rentals/rent/:bookId`     | Rent a book (7 days)     |
| PUT    | `/api/rentals/return/:rentalId` | Return a book            |
| PUT    | `/api/rentals/pay-penalty/:id`  | Pay overdue penalty      |

### Wishlist
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | `/api/wishlist`           | Get my wishlist     |
| POST   | `/api/wishlist/:bookId`   | Add to wishlist     |
| DELETE | `/api/wishlist/:bookId`   | Remove from wishlist|

---

## Multilingual Book Catalog

### Browse (Books Page)
| Title | Author | Language | Genre |
|-------|--------|----------|-------|
| Jane Eyre | Charlotte Brontë | English | Classic |
| Les Misérables | Victor Hugo | French | Classic |
| The Brothers Karamazov | Dostoevsky | Russian | Classic |
| The Big Sleep | Raymond Chandler | English | Crime |
| No Longer Human | Osamu Dazai | Japanese | Crime |
| El Nombre de la Rosa | Umberto Eco | Spanish | Crime |
| The Da Vinci Code | Dan Brown | English | Thriller |
| Das Parfum | Patrick Süskind | German | Thriller |
| O Alquimista | Paulo Coelho | Portuguese | Thriller |
| Rebecca | Daphne du Maurier | English | Mystery |
| In the Woods | Tana French | English | Mystery |
| Il Giorno della Civetta | Leonardo Sciascia | Italian | Mystery |
| Brave New World | Aldous Huxley | English | Fiction |
| Kokoro | Natsume Soseki | Japanese | Fiction |
| Sto años de soledad | García Márquez | Spanish | Fiction |
| The Time Traveler's Wife | Niffenegger | English | Romance |
| Madame Bovary | Gustave Flaubert | French | Romance |
| Lolita | Vladimir Nabokov | Russian | Romance |

### Genre Section (Genres Page)
| Title | Author | Language | Genre |
|-------|--------|----------|-------|
| Anna Karenina | Tolstoy | Russian | Classic |
| Don Quixote | Cervantes | Spanish | Classic |
| Germinal | Émile Zola | French | Classic |
| Buddenbrooks | Thomas Mann | German | Classic |
| The Girl Who Played with Fire | Larsson | English | Crime |
| Aguas Turbias | Donna Leon | Spanish | Crime |
| La Vérité sur l'Affaire Harry Quebert | Dicker | French | Crime |
| Rashomon | Akutagawa | Japanese | Crime |
| The Bourne Identity | Ludlum | English | Thriller |
| El Código Da Vinci | Dan Brown (tr.) | Spanish | Thriller |
| Der Vorleser | Bernhard Schlink | German | Thriller |
| L'Île Mystérieuse | Jules Verne | French | Thriller |
| The Secret History | Donna Tartt | English | Mystery |
| Kafka on the Shore | Murakami | Japanese | Mystery |
| L'Enquête | Philippe Claudel | French | Mystery |
| Il Commissario Montalbano | Camilleri | Italian | Mystery |
| The Midnight Library | Matt Haig | English | Fiction |
| Norwegian Wood | Murakami | Japanese | Fiction |
| El Túnel | Ernesto Sabato | Spanish | Fiction |
| Die Verwandlung | Franz Kafka | German | Fiction |
| Pride and Prejudice | Jane Austen | English | Romance |
| L'Amant | Marguerite Duras | French | Romance |
| El amor en los tiempos del cólera | Márquez | Spanish | Romance |
| Sanshiro | Natsume Soseki | Japanese | Romance |

---

## Project Structure
```
readiction/
├── backend/
│   ├── models/       User.js · Book.js (+ language) · Rental.js
│   ├── routes/       auth.js · books.js · rentals.js · wishlist.js
│   ├── middleware/   auth.js (JWT + adminOnly)
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        └── App.js    All pages in one file
```
