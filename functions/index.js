export async function onRequest(context) {
  const { request, next } = context;
  const acceptLanguage = request.headers.get("Accept-Language") || "";

  const primaryLang = acceptLanguage.split(",")[0].trim().toLowerCase();

  if (!primaryLang.startsWith("pt")) {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/en/`, 302);
  }

  return next();
}
