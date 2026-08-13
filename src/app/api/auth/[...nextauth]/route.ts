import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { jsonDb } from "@/lib/db/json-db";
import { verifyPassword } from "@/lib/utils/hash";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_CLIENT_SECRET",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
                }
                const user = jsonDb.getUserByEmail(credentials.email);
                if (!user) {
                    throw new Error("البريد الإلكتروني غير مسجل");
                }
                if (!user.password) {
                    throw new Error("يرجى تسجيل الدخول باستخدام Google");
                }
                const isValid = verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("كلمة المرور غير صحيحة");
                }
                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    subscriptionStatus: user.subscriptionStatus,
                    hasPaid: user.hasPaid,
                    paymentTimestamp: user.paymentTimestamp,
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const email = user.email;
                if (email) {
                    const existingUser = jsonDb.getUserByEmail(email);
                    if (!existingUser) {
                        const nameParts = (user.name || "").split(" ");
                        const firstName = nameParts[0] || "Google";
                        const lastName = nameParts.slice(1).join(" ") || "User";
                        jsonDb.addUser({
                            id: user.id || "google_" + Math.random().toString(36).substr(2, 9),
                            firstName,
                            lastName,
                            email,
                            authProvider: "google",
                            subscriptionStatus: "none",
                            hasPaid: false,
                            createdAt: new Date().toISOString(),
                        });
                    }
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/ar/dashboard`;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.firstName = (user as any).firstName;
                token.lastName = (user as any).lastName;
                token.subscriptionStatus = (user as any).subscriptionStatus;
                token.hasPaid = (user as any).hasPaid;
                token.paymentTimestamp = (user as any).paymentTimestamp;
            }
            if (token.email) {
                const dbUser = jsonDb.getUserByEmail(token.email);
                if (dbUser) {
                    token.id = dbUser.id;
                    token.firstName = dbUser.firstName;
                    token.lastName = dbUser.lastName;
                    token.subscriptionStatus = dbUser.subscriptionStatus;
                    token.hasPaid = dbUser.hasPaid;
                    token.paymentTimestamp = dbUser.paymentTimestamp;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).firstName = token.firstName;
                (session.user as any).lastName = token.lastName;
                (session.user as any).subscriptionStatus = token.subscriptionStatus;
                (session.user as any).hasPaid = token.hasPaid;
                (session.user as any).paymentTimestamp = token.paymentTimestamp;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "propai_default_secret_salt_123",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };