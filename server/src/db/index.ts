
import * as mongoose from 'mongoose';

export const init = (mongoUri: string, cb?: any, options:any = {drop: false}) => {
  cb = cb || function() { }
  mongoose.connect(mongoUri, function(err) {
    if(options.drop) {
      mongoose.connection.db.dropDatabase(function (err) {
        cb(err);
      });
    } else {        
      cb(err);
    }
  });
}

export const drop = function() { 
  return mongoose.connection.db.dropDatabase();
}

export const close = function() {
  return mongoose.connection.close();
}