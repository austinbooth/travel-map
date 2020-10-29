import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  trip: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  photos: [
    {
      image_url: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
      },
    },
  ],
});

const Post = mongoose.model("post", postSchema);

export default Post;
