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

        // Set the JSON column to an empty array
        const [result] = await connection.execute(
            'UPDATE users SET places_visited = ? WHERE id = ?',
            [JSON.stringify([]), userId],
        );

        await connection.end();

        if (result.affectedRows > 0) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
            });
        } else {
            return new Response(
                JSON.stringify({ success: false, error: 'User not found' }),
                { status: 404 },
            );
        }
    } catch (err) {
        console.error('Error in zeroLocation API:', err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 },
        );
    }
}
