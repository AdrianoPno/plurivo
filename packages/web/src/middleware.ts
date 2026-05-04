import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pegamos o token ou cookie de sessão (implementaremos a lógica de cookie após o login)
  const session = request.cookies.get("session");

  // Se o usuário tentar acessar o dashboard sem sessão, mandamos para o login
  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o usuário logado tentar ir para o login, mandamos para o dashboard
  if (request.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuração para o Middleware rodar apenas em rotas específicas
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
