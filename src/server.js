const cors = require("@koa/cors");

const Koa = require("koa");
const app = new Koa();
app.proxy = true;

const Router = require("koa-router");
const router = new Router();

const logger = require("koa-logger");

const bodyParser = require("koa-bodyparser");

const runServer = async () => {
  router.post("/api/proxy", async (ctx) => {
    ctx.type = "application/json; charset=utf-8";
    try {
      const body = ctx.request.body;
      console.log("POST /api/proxy", body);
      const headers = ctx.request.headers;
      const response = await fetch("https://api.near.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: headers.authorization,
        },
        body: JSON.stringify(body),
      });
      ctx.body = await response.json();
    } catch (e) {
      ctx.status = 400;
      ctx.body = `${e}`;
    }
  });

  app
    .use(logger("combined"))
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
  console.log("Listening on http://localhost:%d/", PORT);
};

module.exports = runServer;
