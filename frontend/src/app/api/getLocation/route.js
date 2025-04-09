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

        // Execute the query to get the places_visited
        const [rows] = await connection.execute(
            'SELECT places_visited FROM users WHERE id = ?',
            [userId],
        );

        await connection.end();

        if (rows.length > 0) {
            const user = rows[0];
            // Handle the `places_visited` field as needed (e.g., split or parse)
            const locations = user.places_visited;
            console.log('Fetched locations:', locations); // Debugging log
            return new Response(
                JSON.stringify({
                    success: true,
                    locations: locations,
                }),
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
