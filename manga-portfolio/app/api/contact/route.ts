import { NextRequest, NextResponse } from "next/server";

// In-memory rate limit store: ip -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MIN_SUBMIT_TIME_MS = 3000; // 3 seconds

const spamPatterns = /(https?:\/\/|www\.|viagra|casino|lottery|crypto|click here|free money|earn \$|adult|xxx)/i;

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { name, email, message, company, elapsed } = body;

    // 1️⃣ Honeypot: hidden field should always be empty
    if (company) {
        return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // 2️⃣ Time-to-submit: reject if under 3 seconds
    if (typeof elapsed !== "number" || elapsed < MIN_SUBMIT_TIME_MS) {
        return NextResponse.json({ error: "Transmission too fast — detected as bot" }, { status: 400 });
    }

    // 3️⃣ Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // 4️⃣ Spam pattern filtering
    if (spamPatterns.test(message) || spamPatterns.test(name)) {
        return NextResponse.json({ error: "Message flagged as spam" }, { status: 400 });
    }

    // 5️⃣ Rate limiting by IP
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
                    { error: `Rate limit exceeded — max ${RATE_LIMIT_MAX} transmissions per hour` },
                    { status: 429 }
                );
            }
            record.count++;
        } else {
            // Window expired, reset
            rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    // ✅ All checks passed — log for now (email sending can be wired in later)
    console.log(`[CONTACT] New message from ${name} <${email}>: ${message.slice(0, 80)}`);

    return NextResponse.json({ success: true });
}
