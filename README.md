# BFHL Full Stack Challenge

A full stack application for processing hierarchical data from edges.

## Project Structure

```
bfhl-project/
├── backend/
│   ├── controllers/
│   │   └── bfhlController.js
│   ├── routes/
│   │   └── bfhlRoutes.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── treeLogic.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup

### Backend

1. Navigate to backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

The backend will run on http://localhost:3000

### Frontend

1. Navigate to frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will run on http://localhost:5173

## Usage

1. Start both backend and frontend servers.
2. Open the frontend in your browser.
3. Enter the edge data in the textarea (JSON array or comma-separated).
4. Click Submit to process the data.
5. View the hierarchies, invalid entries, duplicates, and summary.

## API

### POST /bfhl

Accepts:
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Returns:
```json
{
  "user_id": "john_doe_17091999",
  "email_id": "john@xyz.com",
  "college_roll_number": "ABCD123",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Sample Data

- Valid: ["A->B", "A->C", "B->D"]
- With cycle: ["A->B", "B->A"]
- With invalid: ["A->B", "a->b", "A->A", "AB->C"]