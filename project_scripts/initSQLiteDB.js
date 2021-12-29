const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./devData/dev.db",(err)=>{
    if(err){
        console.log(`Error creating db: ${err}`);
    }
})


db.close((err)=>{
    if(err){
        console.log(`Database failed to close ${err.message}`)
    }
})
