export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Here you would typically integrate with a mail service (e.g., Resend, SendGrid)
        // or store it in a database.
        console.log(`Received contact message from ${name} (${email}): ${message}`);

        return Response.json({ success: true, message: 'Message received successfully in the Quantum Realm.' });
    } catch (error) {
        return Response.json({ success: false, error: 'Failed to process request.' }, { status: 400 });
    }
}
