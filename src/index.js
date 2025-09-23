import dotenv from 'dotenv'
import connectionDB from './db/index.js'
import { app } from './app.js'

dotenv.config({ path: './.env' })

connectionDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
        
    })
})
// .then( () => {
//     app.on("error", (error) => {
//         console.log(`Something went wront Error: ${error}`)
//     })
// })
.catch( (error) => {
    console.log(`Mongo DB connection failed: ${error}`);
    
})