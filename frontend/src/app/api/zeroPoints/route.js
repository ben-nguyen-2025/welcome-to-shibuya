import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'aes112100',
            database: 'login_data',
        });

        await connection.execute('UPDATE users SET points = 0 WHERE id = ?', [
            userId,
        ]);

        await connection.end();

        return new Response(
            JSON.stringify({ success: true, points: user.points }),
            {
                status: 200,
            },
        );
    } catch (err) {
        console.error('Error in zeroPoints API:', err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 },
        );
    }
}
