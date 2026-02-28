import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set(name, value);
                    });
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Define public routes that don't require authentication
    const isPublicRoute = req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/auth/');

    // Allow access to public assets and api routes
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.startsWith('/api') ||
        req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
    ) {
        return res;
    }

    if (!user && !isPublicRoute) {
        // Rediect to home (login page) if not authenticated and trying to access a protected route
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
