const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//MongoDB database
mongoose.connect("mongodb+srv://admin:admin@b561-penetzdorfer.ggf3ovs.mongodb.net/MovieCatalogSystem?retryWrites=true&w=majority&appName=B561-Penetzdorfer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

const userRoutes = require("./router/user");
const movieRoutes = require("./router/movie");

app.use("/users", userRoutes);
app.use("/movies", movieRoutes)

/*
app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date(),
        database: states[dbState],
    });
});
 */


if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${ process.env.PORT || port }`)
    });
}

module.exports = {app,mongoose};