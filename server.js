const fs = require("fs");
const express = require("express");
const path = require("path");
const db = require("./db/db.json")

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("*", (req, res) => 
    res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
    res.json(`${req.method} request received`);

    console.info(req.rawHeaders);

    console.info(`${req.method} request received`);
});

app.delete("/api/notes/:id", (req, res) => {
    const deleteNote = req.params.id.toLowerCase();

    for (let i = 0; i < db.length; i++) {
        if (deleteNote === db[i].id.toLowerCase()) {
            return res.json(db[i]);
        }
    }
    return res.json("There doesn't exist a Note with such id");
})

app.listen(PORT, () => 
    console.info(`App listening at http://localhost:${PORT}`)
);