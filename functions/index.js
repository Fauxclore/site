export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie") || "";
  const hasLangCookie = /lang_pref=/.test(cookieHeader);

  // Manual override via switcher link (?lang=pt)
  if (url.searchParams.get("lang") === "pt") {
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.append(
      "Set-Cookie",
      "lang_pref=pt; Path=/; Max-Age=31536000",
    );
    return newResponse;
  }

  // Already has a remembered preference — don't auto-redirect again
  if (hasLangCookie) {
    return next();
  }

  // First visit, no preference yet — guess from browser language
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const primaryLang = acceptLanguage.split(",")[0].trim().toLowerCase();

  if (!primaryLang.startsWith("pt")) {
    return Response.redirect(`${url.origin}/en/`, 302);
  }

  return next();
}
