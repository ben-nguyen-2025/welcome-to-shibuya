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

export const handleChoice = async (
    choice,
    currentNode,
    setCurrentNode,
    setInventory,
    setPoints,
    setLocation,
    userId,
    story,
    router,
) => {
    const nextNode = story[currentNode].choices[choice];

    if (nextNode.effect?.addItem) {
        setInventory(prev => [...new Set([...prev, nextNode.effect.addItem])]);
    }

    if (nextNode.effect?.addPoints && userId) {
        const response = await fetch('/api/addPoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                pointsToAdd: nextNode.effect.addPoints,
            }),
        }).catch(err => console.error('Failed to add points:', err));
        const data = await response.json();
        if (data.success) {
            console.log('Points updated successfully');
            setPoints(data.points);
        }
    }

    if (nextNode.effect?.zeroPoints && userId) {
        const response = await fetch('/api/zeroPoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
            }),
        }).catch(err => console.error('Failed to zero points:', err));
        const data = await response.json();
        if (data.success) {
            console.log('Points reset successfully');
            setPoints(0);
        }
    }

    if (nextNode.effect?.addLocation && userId) {
        console.log('Adding location:', nextNode.effect.addLocation);
        try {
            const response = await fetch('/api/addLocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    newLocation: nextNode.effect.addLocation,
                }),
            });

            const data = await response.json();
            if (data.success) {
                console.log('Location added successfully:', data.locations);
                setLocation(data.locations); // Update the state with the new locations
            } else {
                console.error(
                    'Failed to add location:',
                    data.message || data.error,
                );
            }
        } catch (err) {
            console.error('Error in fetch request:', err);
        }
    }

    if (nextNode.effect?.determineEnding && userId) {
        const points = await fetchUserPoints(userId);
        const locations = await fetchUserLocations(userId);

        if (points != null && locations != null) {
            const finalScore = points + locations.length * 10;
            if (finalScore >= 50) {
                alert('you did it! you got your phone back :)');
                router.push('good_ending');
            } else {
                alert("you couldn't find your phone :(");
                router.push('bad_ending');
            }
        }
    }

    if (nextNode.effect?.zeroLocation && userId) {
        const response = await fetch('/api/zeroLocation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
            }),
        }).catch(err => console.error('Failed to zero location:', err));
        const data = await response.json();
        if (data.success) {
            console.log('Locations visited reset successfully');
            setLocation([]);
        }
    }

    if (nextNode.effect?.movePage) {
        // router.push('good_ending');
        router.push(nextNode.effect.movePage); // Navigate to the specified page
        return;
    }

    if (nextNode.next) {
        setCurrentNode(nextNode.next);
    }
};
