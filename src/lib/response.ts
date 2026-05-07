import type { Context } from "hono";

type ErrorStatus = 400 | 404 | 422 | 500;

export const ok = <T>(
  c: Context,
  message: string,
  data: T,
  cacheSeconds = 0,
) => {
  if (cacheSeconds > 0) {
    c.header(
      "Cache-Control",
      `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`,
    );
  }

  return c.json({
    success: true,
    message,
    data,
  });
};

export const fail = (
  c: Context,
  message: string,
  status: ErrorStatus = 400,
  details: unknown = null,
) => {
  c.header("Cache-Control", "no-store");

  return c.json(
    {
      success: false,
      message,
      error: {
        statusCode: status,
        details,
      },
    },
    status,
  );
};
