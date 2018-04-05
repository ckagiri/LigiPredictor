
import * as mongoose from 'mongoose';

export const init = (mongoUri: string, cb?: any, options:any = {drop: false}) => {
  cb = cb || function() {}
  mongoose.connect(mongoUri, err => {
    if(options.drop) {
      mongoose.connection.db.dropDatabase(function (err) {
        cb(err);
      });
    } else {        
      cb(err);
    }
  });
}

export const drop = () => { 
  mongoose.connection.db.dropDatabase();
}

export const close = () => {
  mongoose.connection.close();
}