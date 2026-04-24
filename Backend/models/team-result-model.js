import mongoose from "mongoose";

const teamResultSchema = mongoose.Schema({
    tournamentId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tournament",
        required:true
    },
    event : {
        type:String,
        enum:["Epee","Foil","Sabre"],
        required :true
    },
    gender : {
        type :String,
        enum:["Male","Female", "Other"],
        required:true
    },
    place:{
        type:String,
        enum:["First","Second","Third"],
        required:true
    }
})

const TeamResult = mongoose.model('TeamResult',teamResultSchema)
export default TeamResult