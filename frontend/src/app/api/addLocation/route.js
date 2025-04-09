import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        const { userId, newLocation } = await req.json();

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'aes112100',
            database: 'login_data',
        });

        // Get current places_visited from the database
        const [rows] = await connection.execute(
            'SELECT places_visited FROM users WHERE id = ?',
            [userId],
        );

        if (rows.length > 0) {
            const user = rows[0];

            // Get current places_visited, which is already a JSON object/array
            let placesVisited = user.places_visited || []; // Default to an empty array if null

            console.log('Current places_visited:', placesVisited); // Log the current places_visited

            // Check if the new location is already in the array
            if (!placesVisited.includes(newLocation)) {
                placesVisited.push(newLocation); // Add the new location
                console.log('Updated places_visited:', placesVisited); // Log the updated places_visited
            } else {
                console.log('Location already exists:', newLocation); // Log if location already exists
            }

            // Update the places_visited field in the database
            await connection.execute(
                'UPDATE users SET places_visited = ? WHERE id = ?',
                [placesVisited, userId], // Directly store the array (JSON type)
            );

            await connection.end();

            return new Response(
                JSON.stringify({
                    success: true,
                    locations: placesVisited,
                }),
                { status: 200 },
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, error: 'User not found' }),
                { status: 404 },
            );
        }
    } catch (err) {
        console.error('Error in addLocation API:', err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 },
        );
    }
}
