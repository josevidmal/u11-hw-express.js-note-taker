const fs = require("fs");
const util = require("util");
const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "public/notes.html"))
);

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) => 
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => 
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );

const readAndAppend = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received to get notes`)
    readFromFile("./db/db.json").then((data) => res.status(200).json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.info(req.rawHeaders);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, "./db/db.json");

        const response = {
            status: "success",
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json("Error in posting note");
    }
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

app.get("*", (req, res) => 
    res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () => 
    console.info(`App listening at http://localhost:${PORT}`)
);