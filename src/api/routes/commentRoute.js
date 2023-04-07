module.exports = (server) => {
  const commentController = require("../controllers/commentController");
  server
    .route("/posts/:id/comments")
    .get(commentController.getcomments)
    .post(commentController.createcomment);
  server
    .route("/comments/:id")
    .delete(commentController.deletecomments)
    .put(commentController.updatecomments);
};
