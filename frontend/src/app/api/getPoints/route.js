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

        // Execute the query to get the points
        const [rows] = await connection.execute(
            'SELECT points FROM users WHERE id = ?',
            [userId],
        );

        await connection.end();
        if (rows.length > 0) {
            const user = rows[0]; // Store the first row (the user data)
            return new Response(
                JSON.stringify({ success: true, points: user.points }), // Return the JSON response
                {
                    status: 200,
                },
            );
        } else {
            // Handle case where no user is found
            return new Response(
                JSON.stringify({ success: false, error: 'User not found' }),
                { status: 404 },
            );
        }
    } catch (err) {
        console.error('Error in getPoints API:', err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 },
        );
    }
}
