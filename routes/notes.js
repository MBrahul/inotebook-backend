const express = require('express');
const router = express.Router();
const fatchUser = require('../middlewares/fatchuser')
const Note = require('../models/Notes.js')
const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');


// ROUTE:1 --> get all the notes


router.get('/fatchAllNotes', fatchUser, async (req, res) => {


   
        const notes = await Note.find({ user: req.user.id });
        res.send(notes);

 

});


// ROUTE:2 --> add notes using post requied ('/api/note/addNote') - login required

router.post('/addNote', fatchUser, [body('title','title can not be blank').exists(), body('description', 'description must be 3 letters').isLength({ min: 3 })], async (req, res) => {

    const {title , description,tag,bcolour}=req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    
    const newNote = new Note({
        title:title,
        description:description,
        tag:tag,
        user:req.user.id,
        bcolour:bcolour
       })
       newNote.save().then(()=>{
        res.json(newNote);
       })
     
    
  } catch (error) {
    res.json({error:error})
  }

});


// ROUTE:3 --> update notes using post requied ('/api/note/updateNote') - login required

router.put('/updateNote/:id',fatchUser,  [body('title','title can not be blank').exists(), body('description', 'description must be 3 letters').isLength({ min: 3 })],async (req,res) =>{

    const {title ,description,tag}=req.body;
  // create a new note

try {
    const newNote ={};
    if(title){
        newNote.title=title;
    }
    if(description){
        newNote.description=description;
    }
    if(tag){
        newNote.tag=tag;
    }


  // find a note to be updated and update it
    const note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString()!==req.user.id){

        return res.status(401).send("Not Allowed");

    };

     Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true}).then(()=>{
        res.send(note);
     });
   
} catch (error) {
    res.json({error:error})
}

});


// ROUTE:4 delete notes using delete ('/api/note/deleteNote');

router.delete('/deleteNote/:id',fatchUser,async(req,res)=>{

  try {
      // find the email existense
      const note = await Note.findById(req.params.id);

      //check user is valid
  
      if(!note){
          return res.status(404).send("Not Found")
      }
      if(note.user.toString()!==req.user.id){
  
          return res.status(401).send("Not Allowed");
  
      };
  
       Note.findByIdAndDelete(req.params.id).then(()=>{
          res.send('Note has been deleted');
       });
  
  } catch (error) {
     res.json({error:error})
  }
})



module.exports = router