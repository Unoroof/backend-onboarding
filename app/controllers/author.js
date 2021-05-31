const Author = require("../models").Author;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      let blogs = await Blog.findAll();
      return blogs;
    } catch (error) {
      consumeError(error);
    }
  },

  async show(req, res) {
    try {
      let blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        consumeError({
          message: "Not Found",
          code: 404,
        });
      }
      return blog;
    } catch (error) {
      consumeError(error);
    }
  },

  async store(req, res) {
    try {
      let blog = await Author.create({
        name: req.body.name,
      });
      return blog;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let blog = await Blog.findByPk(req.params.id);

      if (!blog) {
        consumeError({
          message: "Not Found..",
          code: 404,
        });
      }

      blog = await blog.update({
        title: req.body.title || blog.title,
        excerpt: req.body.excerpt || blog.excerpt,
        content: req.body.content || blog.content,
      });

      return blog;
    } catch (error) {
      consumeError(error);
    }
  },

  async delete(req, res) {
    try {
      let blog = await Blog.findByPk(req.params.id);

      console.log("delete", blog);

      if (!blog) {
        consumeError({
          message: "Not Found..",
          code: 404,
        });
      }

      await blog.destroy();
      return {};
    } catch (error) {
      consumeError(error);
    }
  },
};
