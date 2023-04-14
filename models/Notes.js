const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
      type:Date,
      default: Date.now
    },
    bcolour:{
        type:String,
        required:true
    }
    
  });
  const Note = mongoose.model('note',notesSchema);
  module.exports = Note;