const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//Get all user notes from /api/notes/getnotes
router.get('/getnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error occured")
    }
})

//Adding notes in a user //POST /api/notes/addnote  
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must atleast be 6 characters").isLength({ min: 6 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //If there are errors , return Bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json( savedNote )
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error occured")
    }
})

//Update existing node /api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        //Find the note and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("UnAuthorised")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({note});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error occured")
    }
})

//delete note in notes;
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("UnAuthorised")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Status": "Success Deleted", note: note })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server error occured")
    }
})


module.exports = router