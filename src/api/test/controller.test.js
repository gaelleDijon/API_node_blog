const app = require("../../app");
const commentController = require("../controllers/commentController");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");

let postId;
let commTest;
let dbURI = process.env.DBTEST;

describe("commentController", () => {
  //execute before all tests, connection bd ans create a test comm
  beforeAll(async () => {
    await mongoose.connect(dbURI, { useNewUrlParser: true });
  });
  //after all tests delete test data, close db connection
  afterAll(async () => {
    await commentModel.deleteMany();
    await mongoose.connection.close();
  });

  //test comment creation
  describe("createcomment", () => {
    it("should create a new comment", async () => {
      const response = await request.post(`/posts/:${postId}/comments`).send({
        names: "test name",
        content: "new comment content",
      });

      expect(response.status).toBe(201);
      expect(response.body.names).toBe("test name");
      expect(response.body.content).toBe("new comment content");

      commTest = response.body._id;
    });
  });

  //test commment update
  describe("updatecomments", () => {
    it("should update an existing comment", async () => {
      const response = await request
        .put(`/comments/${postId}`)
        .send({ content: "updated test" });
      expect(response.status).toBe(200);
      expect(response.body.names).toBe("test name");
      expect(response.body.content).toBe("updated test");
    });
  });

  //test read all comments from a post
  describe("getcomments", () => {
    it("should return a comment from a post", async () => {
      const mockComments = [
        { name: "test1", content: "testcontent1", post: "str1" },
        { name: "test2", content: "testcontent2", post: "str2" },
      ];
      commentModel.find = jest.fn().mockResolvedValue(mockComments);
      const req = { params: { id: postId } };
      const res = { json: jest.fn() };
      await commentController.getcomments(req, res);
      expect(commentModel.find).toHaveBeenCalledWith({ post: postId });
      expect(res.json).toHaveBeenCalledWith(mockComments);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  //test delete comment
  describe("deletecomments", () => {
    it("should delete all comments", async () => {
      const response = await request.delete(`/comments/:${postId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ n: 1, ok: 1, deletedCount: 1 });
    });
  });
});
