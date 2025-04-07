export async function fetchCurrentUser() {
    const res = await fetch('http://localhost:8000/api/user', {
        credentials: 'include',
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user; // contains { id, name, email, etc. }
}

export async function fetchUserPoints(userId) {
    const res = await fetch('/api/getPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    console.log('Response data:', data);

    if (data.success) {
        console.log('success');
        console.log(data.points);
        return data.points;
    } else {
        console.error('Failed to fetch points:', data.message || data.error);
        return null;
    }
}

export async function fetchUserLocations(userId) {
    const res = await fetch('/api/getLocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    console.log('Response data:', data);

    if (data.success) {
        console.log('success');
        console.log(data.locations);
        return data.locations;
    } else {
        console.error('Failed to fetch points:', data.message || data.error);
        return null;
    }
}
