import { Hono } from "hono";
import { getOpenApiSpec } from "./openapi";

export const docsRoutes = new Hono();

docsRoutes.get("/openapi.json", (c) => {
  const origin = new URL(c.req.url).origin;
  return c.json(getOpenApiSpec(origin));
});

docsRoutes.get("/docs", (c) => {
  return c.html(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>HOCO API Docs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Documentación oficial de HOCO API para consultar festivos y días hábiles de Colombia."
    />

    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />

    <style>
      :root {
        --bg: #07110f;
        --panel: #0d1915;
        --panel-soft: #12221d;
        --panel-line: #20342d;
        --text: #f4fff9;
        --muted: #9fb2aa;
        --green: #20d38f;
        --green-dark: #0f8f62;
        --yellow: #f2d35f;
        --blue: #4aa8ff;
        --danger: #ef6b6b;
        --black: #06100d;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: var(--text);
        background: var(--bg);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .topbar {
        display: none !important;
      }

      .page {
        width: min(1080px, calc(100% - 28px));
        margin: 0 auto;
        padding: 28px 0 40px;
      }

      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 18px;
        padding: 22px;
        border: 1px solid var(--panel-line);
        border-radius: 20px;
        background: var(--panel);
      }

      .brand {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .brand-mark {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        color: var(--black);
        background: var(--green);
        font-weight: 950;
      }

      .brand strong {
        display: block;
        font-size: 16px;
        line-height: 1;
      }

      .brand span {
        display: block;
        margin-top: 5px;
        color: var(--muted);
        font-size: 12px;
      }

      .header h1 {
        max-width: 620px;
        margin: 18px 0 8px;
        font-size: clamp(30px, 4vw, 44px);
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .header p {
        max-width: 720px;
        margin: 0;
        color: var(--muted);
        font-size: 15px;
        line-height: 1.6;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
      }

      .action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        padding: 0 15px;
        border: 1px solid var(--panel-line);
        border-radius: 12px;
        background: var(--panel-soft);
        color: var(--text);
        font-size: 13px;
        font-weight: 800;
      }

      .action.primary {
        border-color: var(--green);
        background: var(--green);
        color: var(--black);
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
        min-width: 210px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        height: 30px;
        padding: 0 11px;
        border-radius: 999px;
        background: var(--panel-soft);
        color: var(--muted);
        font-size: 11px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .docs-card {
        padding: 18px;
        border: 1px solid var(--panel-line);
        border-radius: 20px;
        background: var(--panel);
      }

      .docs-footer {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        margin-top: 14px;
        color: var(--muted);
        font-size: 12px;
      }

      /* Swagger base */
      .swagger-ui {
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
      }

      .swagger-ui .wrapper {
        max-width: 100%;
        padding: 0;
      }

      .swagger-ui .info {
        margin: 0 0 18px;
      }

      .swagger-ui .info .title {
        color: var(--text);
        font-size: 26px;
        font-weight: 950;
        letter-spacing: -0.035em;
      }

      .swagger-ui .info p,
      .swagger-ui .info li,
      .swagger-ui .info .base-url,
      .swagger-ui .opblock-description-wrapper p,
      .swagger-ui .opblock-summary-description,
      .swagger-ui .opblock-tag small,
      .swagger-ui .responses-inner h4,
      .swagger-ui .responses-inner h5,
      .swagger-ui .parameter__name,
      .swagger-ui .parameter__type,
      .swagger-ui .parameter__deprecated,
      .swagger-ui .markdown p,
      .swagger-ui table thead tr td,
      .swagger-ui table thead tr th,
      .swagger-ui table tbody tr td,
      .swagger-ui table tbody tr th,
      .swagger-ui .response-col_description,
      .swagger-ui .response-col_status {
        color: var(--muted) !important;
      }

      .swagger-ui .scheme-container {
        margin: 0 0 18px;
        padding: 14px;
        border: 1px solid var(--panel-line);
        border-radius: 16px;
        background: var(--panel-soft);
        box-shadow: none;
      }

      .swagger-ui .servers > label {
        color: var(--muted) !important;
        font-size: 12px;
        font-weight: 850;
      }

      .swagger-ui select,
      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"],
      .swagger-ui input[type="email"],
      .swagger-ui textarea {
        border: 1px solid var(--panel-line);
        border-radius: 10px;
        outline: none;
        background: var(--black);
        color: var(--text);
      }

      .swagger-ui select,
      .swagger-ui .servers select {
        min-height: 40px;
        padding: 0 12px;
      }

      .swagger-ui input[type="text"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"],
      .swagger-ui input[type="email"] {
        min-height: 40px;
        padding: 0 12px;
      }

      .swagger-ui textarea {
        min-height: 140px;
        padding: 12px;
      }

      .swagger-ui select:focus,
      .swagger-ui input:focus,
      .swagger-ui textarea:focus {
        border-color: var(--green);
        box-shadow: 0 0 0 3px rgba(32, 211, 143, 0.16);
      }

      .swagger-ui .filter-container {
        margin: 0 0 16px;
      }

      .swagger-ui .filter-container input {
        width: 100%;
      }

      /* Tags */
      .swagger-ui .opblock-tag {
        margin: 18px 0 10px;
        padding: 10px 2px;
        border-bottom: 1px solid var(--panel-line);
        color: var(--text);
        font-size: 22px;
        font-weight: 950;
        letter-spacing: -0.03em;
      }

      .swagger-ui .opblock-tag:hover {
        background: transparent;
      }

      /* Endpoint cards */
      .swagger-ui .opblock {
        overflow: hidden;
        margin: 0 0 12px;
        border: 1px solid var(--panel-line);
        border-radius: 14px;
        background: #0f1d18;
        box-shadow: none;
      }

      .swagger-ui .opblock.opblock-get {
        border-color: #28506a;
        background: #0e2024;
      }

      .swagger-ui .opblock .opblock-summary {
        align-items: center;
        padding: 10px 12px;
      }

      .swagger-ui .opblock .opblock-summary-method {
        min-width: 56px;
        border-radius: 10px;
        background: var(--blue);
        color: #ffffff;
        font-size: 11px;
        font-weight: 950;
      }

      .swagger-ui .opblock .opblock-summary-path {
        color: var(--text);
        font-family:
          "JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", monospace;
        font-size: 13px;
        font-weight: 850;
      }

      .swagger-ui .opblock .opblock-summary-description {
        font-size: 12px;
      }

      .swagger-ui .opblock-body {
        padding: 8px 10px 14px;
      }

      .swagger-ui .opblock-section-header {
        min-height: 48px;
        padding: 10px 14px;
        border: 1px solid var(--panel-line);
        border-radius: 12px;
        background: #13241e !important;
        box-shadow: none;
      }

      .swagger-ui .opblock-section-header h4,
      .swagger-ui .opblock-title_normal,
      .swagger-ui .opblock-section-header label,
      .swagger-ui .opblock-section-header span {
        color: var(--text) !important;
        font-weight: 800;
      }

      .swagger-ui .opblock-section-header .tab-header .tab-item {
        color: var(--muted) !important;
        font-weight: 700;
      }

      .swagger-ui .opblock-section-header .tab-header .tab-item.active h4,
      .swagger-ui .opblock-section-header .tab-header .tab-item.active span,
      .swagger-ui .opblock-section-header .tab-header .tab-item.active {
        color: var(--text) !important;
      }

      .swagger-ui .parameters-col_description input,
      .swagger-ui .parameters-col_description textarea,
      .swagger-ui .parameters-col_name,
      .swagger-ui .parameters-col_description,
      .swagger-ui .parameter__name,
      .swagger-ui .parameter__type {
        color: var(--text) !important;
      }

      .swagger-ui table {
        background: transparent !important;
      }

      .swagger-ui table thead tr th,
      .swagger-ui table thead tr td {
        color: var(--text) !important;
        background: #13241e !important;
        border-bottom: 1px solid var(--panel-line) !important;
      }

      .swagger-ui table tbody tr td,
      .swagger-ui table tbody tr th {
        background: transparent !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      }

      .swagger-ui .responses-inner h4,
      .swagger-ui .responses-inner h5 {
        color: var(--text) !important;
      }

      /* Botones sólidos y visibles */
      .swagger-ui button,
      .swagger-ui .btn,
      .swagger-ui .btn.execute,
      .swagger-ui .btn.authorize,
      .swagger-ui .btn.cancel,
      .swagger-ui .btn.try-out__btn,
      .swagger-ui .download-contents {
        min-height: 38px;
        border: 1px solid var(--panel-line) !important;
        border-radius: 10px !important;
        background: var(--panel-soft) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        font-size: 12px;
        font-weight: 850;
      }

      .swagger-ui button:hover,
      .swagger-ui .btn:hover,
      .swagger-ui .download-contents:hover {
        border-color: var(--green) !important;
      }

      .swagger-ui .btn.execute {
        border-color: var(--green) !important;
        background: var(--green) !important;
        color: var(--black) !important;
      }

      .swagger-ui .btn.cancel {
        border-color: var(--danger) !important;
        background: var(--danger) !important;
        color: #ffffff !important;
      }

      .swagger-ui .btn.clear {
        border-color: var(--yellow) !important;
        background: var(--yellow) !important;
        color: var(--black) !important;
      }

      .swagger-ui .authorization__btn {
        background: var(--panel-soft) !important;
      }

      .swagger-ui svg {
        fill: currentColor;
      }

      .swagger-ui .copy-to-clipboard {
        background: var(--panel-soft) !important;
      }

      /* Respuestas y código */
      .swagger-ui .highlight-code,
      .swagger-ui .microlight,
      .swagger-ui pre,
      .swagger-ui .renderedMarkdown code,
      .swagger-ui .model-box {
        border-radius: 12px;
        background: var(--black) !important;
      }

      .swagger-ui pre {
        border: 1px solid var(--panel-line);
      }

      .swagger-ui .responses-table {
        color: var(--muted);
      }

      .swagger-ui .response-col_status {
        font-weight: 850;
      }

      .swagger-ui section.models {
        display: none;
      }

      @media (max-width: 760px) {
        .header {
          flex-direction: column;
          border-radius: 16px;
        }

        .meta {
          justify-content: flex-start;
        }

        .header h1 {
          font-size: 34px;
        }

        .docs-card {
          padding: 12px;
          border-radius: 16px;
        }

        .swagger-ui .info .title {
          font-size: 22px;
        }

        .swagger-ui .opblock-tag {
          font-size: 19px;
        }

        .swagger-ui .opblock .opblock-summary {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .docs-footer {
          flex-direction: column;
        }
      }
    </style>
  </head>

  <body>
    <main class="page">
      <header class="header">
        <div>
          <div class="brand">
            <div class="brand-mark">HO</div>
            <div>
              <strong>HOCO API</strong>
              <span>Holiday Colombia API</span>
            </div>
          </div>

          <h1>Documentación de la API</h1>
          <p>
            Consulta festivos de Colombia, valida fechas festivas y calcula días hábiles
            desde endpoints simples en formato JSON.
          </p>

          <div class="actions">
            <a class="action primary" href="/api/openapi.json" target="_blank" rel="noreferrer">
              OpenAPI JSON
            </a>
            <a class="action" href="/api/health" target="_blank" rel="noreferrer">
              Estado de la API
            </a>
          </div>
        </div>

        <div class="meta">
          <span class="pill">OpenAPI 3.0</span>
          <span class="pill">JSON</span>
          <span class="pill">Gratis</span>
        </div>
      </header>

      <section class="docs-card">
        <div id="swagger-ui"></div>

        <footer class="docs-footer">
          <span>HOCO API · Colombia</span>
          <span>Festivos y días hábiles en una API simple</span>
        </footer>
      </section>
    </main>

    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/api/openapi.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          filter: true,
          displayRequestDuration: true,
          tryItOutEnabled: false,
          docExpansion: "list",
          defaultModelsExpandDepth: -1,
          defaultModelExpandDepth: 1,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: "BaseLayout"
        });
      };
    </script>
  </body>
</html>`);
});

