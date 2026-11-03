import { NextRequest, NextResponse } from "next/server";
import { PROFILE } from "@/lib/content";

// In-memory rate limit store: ip -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MIN_SUBMIT_TIME_MS = 3000; // 3 seconds
const MAX_MESSAGE_LEN = 5000;

const spamPatterns =
    /(https?:\/\/|www\.|viagra|casino|lottery|crypto|click here|free money|earn \$|adult|xxx)/i;

function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Sends the message on. Returns false when no mail provider is configured,
 * so the caller can tell the visitor the truth instead of reporting a
 * delivery that never happened.
 */
async function deliver(name: string, email: string, message: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL ?? PROFILE.email;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !from) return false;

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to,
            reply_to: email,
            subject: `Portfolio message from ${name}`,
            html:
                `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
                `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>`,
        }),
    });

    if (!res.ok) {
        throw new Error(`Mail provider returned ${res.status}`);
    }
    return true;
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { name, email, message, company, elapsed } = body;

    // Honeypot: hidden field should always be empty
    if (company) {
        return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // Time-to-submit: reject if under 3 seconds
    if (typeof elapsed !== "number" || elapsed < MIN_SUBMIT_TIME_MS) {
        return NextResponse.json(
            { error: "Transmission too fast — detected as bot" },
            { status: 400 }
        );
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LEN) {
        return NextResponse.json(
            { error: "Message too long — keep it under 5000 characters" },
            { status: 400 }
        );
    }

    if (spamPatterns.test(message) || spamPatterns.test(name)) {
        return NextResponse.json({ error: "Message flagged as spam" }, { status: 400 });
    }

    // Rate limiting by IP
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record) {
        if (now < record.resetAt) {
            if (record.count >= RATE_LIMIT_MAX) {
                return NextResponse.json(
                    {
                        error: `Rate limit exceeded — max ${RATE_LIMIT_MAX} transmissions per hour`,
                    },
                    { status: 429 }
                );
            }
            record.count++;
        } else {
            rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    try {
        const sent = await deliver(name.trim(), email.trim(), message.trim());
        // `delivered: false` means the message was accepted but no mail provider
        // is configured. The UI points the visitor at the direct address.
        return NextResponse.json({ success: true, delivered: sent });
    } catch (err) {
        console.error("[CONTACT] delivery failed:", err);
        return NextResponse.json(
            { error: "Could not reach the mail relay — email the address below instead" },
            { status: 502 }
        );
    }
}
