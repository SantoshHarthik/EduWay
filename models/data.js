const mongoose= require('mongoose')

const adminschema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    likes: {
        type: Array,
        default: [],
    },
    views:{
        type: Array,
        default: [],
    },
    materiallist:[],
    precautions:[String],
    instructions:[],
    writer:String,
})

const admin=mongoose.model('admin',adminschema)

module.exports=admin