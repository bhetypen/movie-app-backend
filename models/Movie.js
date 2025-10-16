// models/Movie.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User model
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        director: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true,
            trim: true
        },
        comments: [commentSchema], // Array of embedded subdocuments
    },
    { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

module.exports = Movie;
