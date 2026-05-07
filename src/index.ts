import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { holidaysRoutes } from "./holidays/holidays.routes";
import { docsRoutes } from "./docs/docs.routes";
import { fail } from "./lib/response";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use("*", secureHeaders());

app.get("/", (c) => {
  return c.redirect("/api/docs");
});

app.route("/api", holidaysRoutes);
app.route("/api", docsRoutes);

app.notFound((c) => {
  return fail(c, "Ruta no encontrada.", 404, {
    path: new URL(c.req.url).pathname,
  });
});

app.onError((error, c) => {
  console.error(error);

  return fail(c, "Error interno de HOCO API.", 500);
});

export default app;
