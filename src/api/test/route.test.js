const request = require("supertest");
const app = require("../app");
const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

describe("Comment routes", () => {
  let post;

  // create a post before tests
  beforeAll(async () => {
    post = await postModel.create({
      title: "Test post",
      des: "test post desc",
    });
    postId = response.body._id;
  });

  // delete all comments and the post after the tests
  afterAll(async () => {
    await commentModel.deleteMany({});
    await postModel.findByIdAndDelete(post._id);
  });

  describe("GET /comments/:id", () => {
    it("should return all post comments", async () => {
      const comment1 = await commentModel.create({
        names: "test comm 1",
        content: "test content 1",
        post: post._id,
      });
      const comment2 = await commentModel.create({
        names: "Test comm 2",
        content: "test content 2",
        post: post._id,
      });
      const res = await request(app).get(`/comments/${post._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]._id).toEqual(comment1._id.toString());
      expect(res.body[1]._id).toEqual(comment2._id.toString());
    });
  });

  describe("POST /comments/:id", () => {
    it("should create a new comment for a post", async () => {
      const res = await request(app)
        .post(`/comments/${post._id}`)
        .send({ names: "Test comm", content: "test content" });
      expect(res.statusCode).toEqual(201);
      expect(res.body.names).toEqual("Test comm");
      expect(res.body.content).toEqual("test content");
      expect(res.body.post).toEqual(post._id.toString());
    });
  });

  describe("PUT /comments/:id", () => {
    it("should update a comment based on its id", async () => {
      const comment = await commentModel.create({
        names: "Test comm",
        content: "test content",
        post: post._id,
      });
      const res = await request(app)
        .put(`/comments/${comment._id}`)
        .send({ content: "comm content update" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.content).toEqual("comm content update");
    });
  });

  describe(`DELETE /comments/${post._id}`, () => {
    it("should delete all comments from a post", async () => {
      const comm1 = await commentModel.create({
        names: "Test comm 1",
        content: "test content 1",
        post: post._id,
      });
      const comm2 = await commentModel.create({
        names: "Test Comment 2",
        content: "test content 2",
        post: post._id,
      });
      const res = await request(app).delete("/comments");
      expect(res.statusCode).toEqual(200);
      expect(res.body.deletedCount).toEqual(2);
    });
  });
});

describe("Post routes", () => {
  let postId;
  let token;

  //connection before tests
  beforeAll(async () => {
    await mongoose.connect(process.env.DBTEST, { useNewUrlParser: true });

    const response = await request(app).post("/auth/login").send({
      email: "kevintest@test.com",
      password: "testpassword",
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await postModel.deleteMany();
    await mongoose.connection.close();
  });

  describe("POST /posts", () => {
    test("should create a new post", async () => {
      const testPost = {
        title: "Test post",
        des: "test desc post",
      };

      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(testPost)
        .expect(201);

      expect(response.body.title).toEqual(testPost.title);
      expect(response.body.description).toEqual(testPost.description);

      postId = response.body._id;
    });

    test("should return 401 unauthorized without token", async () => {
      const testPost = {
        title: "Test Post",
        des: "test desc post",
      };

      const response = await request(app)
        .post("/posts")
        .send(testPost)
        .expect(401);

      expect(response.body.message).toEqual("No token provided");
    });
  });

  describe("GET /posts", () => {
    test("should return all posts", async () => {
      const response = await request(app).get("/posts").expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /posts/:id", () => {
    test("should return a post", async () => {
      const response = await request(app).get(`/posts/${postId}`).expect(200);
      expect(response.body._id).toEqual(postId);
    });

    test("should return 404 not found invalid id", async () => {
      const response = await request(app).get("/posts/invalid-id").expect(404);

      expect(response.body.message).toEqual("Post not found");
    });
  });

  describe("PUT /posts/:id", () => {
    test("should update a post", async () => {
      const updatedPost = {
        title: "test post update",
        description: "test desc post update",
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorisation", `Bearer ${token}`)
        .send(updatedPost)
        .expect(200);

      expect(response.body.title).toEqual(updatedPost.title);
      expect(response.body.description).toEqual(updatedPost.description);
    });
  });

  describe("DELETE /posts/:id", () => {
    test("should delete a post", async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toEqual("Post deleted");
    });
  });
});
