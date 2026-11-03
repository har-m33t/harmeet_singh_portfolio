import { NextResponse } from "next/server";

/**
 * GitHub's contribution calendar, without a token.
 *
 * The GraphQL `contributionsCollection` needs an authenticated request, which
 * would mean shipping a secret just to draw a decorative heatmap. This public
 * fragment — the same HTML the profile page embeds — carries one <td> per day
 * with `data-date` and `data-level`, which is all the chart needs.
 *
 * It is undocumented, so every failure path returns an empty day list and the
 * UI simply omits the heatmap rather than erroring.
 */

const USER = "har-m33t";
const SOURCE = `https://github.com/users/${USER}/contributions`;

export const revalidate = 86400; // once a day is plenty for a year view

type Day = { date: string; level: number };

export async function GET() {
  try {
    const res = await fetch(SOURCE, {
      headers: {
        // Identify the client generically; never the site owner's address.
        "User-Agent": "harmeet-singh.dev portfolio",
        Accept: "text/html",
      },
      next: { revalidate },
    });

    if (!res.ok) return NextResponse.json({ days: [], total: 0 });

    const html = await res.text();
    const days: Day[] = [];

    const cell = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    for (let m = cell.exec(html); m; m = cell.exec(html)) {
      days.push({ date: m[1], level: Number(m[2]) });
    }

    const totalMatch = /([\d,]+)\s*\n?\s*contributions/i.exec(html);
    const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;

    return NextResponse.json({ days, total });
  } catch {
    return NextResponse.json({ days: [], total: 0 });
  }
}
