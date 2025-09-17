import mongoose from 'mongoose';

const conectDB = async () => {
    try{
      await mongoose.connect(process.env.MONGO_URL);
      console.log('mongo DB connected')
    } catch(err){
       console.error(message.err);
       process.exit(1);
    }
}

export default conectDB;