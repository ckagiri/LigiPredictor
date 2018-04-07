import * as mongoose from 'mongoose';
import { config } from '../../config/environment/index';

function drop() {
  console.log('dropping db..');  
  mongoose.connect(config.mongo.uri);
  mongoose.connection.on('open', () => {
    mongoose.connection.dropDatabase().then(() => {
      mongoose.connection.close()
      console.log('db dropped');            
    })
  });
}

drop();