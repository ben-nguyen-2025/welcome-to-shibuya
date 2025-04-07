'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

async function fetchCurrentUser() {
    const res = await fetch('http://localhost:8000/api/user', {
        credentials: 'include',
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user; // contains { id, name, email, etc. }
}

async function fetchUserPoints(userId) {
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

async function fetchUserLocations(userId) {
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

const story = {
    start: {
        text: 'Cutting through the unyielding wave of people, you finally stumble into a small, open space. Four thin trees stand huddled together to one side, their branches sway gently in the wind. In the center of the clearing, almost dwarfed by the chaotic crowd around it, is a tiny bronze statue weathered, yet steadfast. A plaque beneath it reads “Hachiko”',
        choices: {
            'go closer': { next: 'go_closer' },
            'walk away': { next: 'walk_away' },
        },
    },
    go_closer: {
        text: 'You step closer, and the line stretching in front of the statue catches your eye. It snakes out in a tight coil, winding all the way back, a never-ending trail of faces waiting to pay their respects. The sight of it makes you pause for a moment, unsure whether to join the line or turn away. The soft clink of coins and the murmurs of visitors surround you, but it’s the statue itself that seems to hold the most weight in this place.',
        choices: {
            'Join the line': {
                next: 'join_the_line',
                effect: { addPoints: 10 },
            },
            'Cut the line': {
                next: 'cut_the_line',
                effect: { addPoints: 3 },
            },
        },
    },

    join_the_line: {
        text: "A bit hesitant, you take a deep breath and step forward. The shuffle of feet and soft whispers fill the air as you find yourself at the end of the queue. You glance up at the small statue of hachiko, feeling a quiet sense of reverence settle over you, and before you know it you're at the front of the queue getting your picture taken with the famous dog Hachiko.",
        choices: {
            'Head onwards': {
                next: 'walk_away',
            },
        },
    },

    cut_the_line: {
        text: 'After a bit of reflection you decide that waiting in this line is just a waste of time, with a few quick steps you snake your way to the front of the line take your picture and bolt away, not without first getting some of the nastiest looks and quite a few choice words hurled your way, before escaping back into the crowd.',
        choices: {
            'Head onwards': {
                next: 'walk_away',
            },
        },
    },

    walk_away: {
        text: 'Where will you go?',
        choices: {
            'Go to Meiji Jingu': {
                next: '',
                effect: { movePage: 'meiji_jingu', addLocation: 'meiji_jingu' },
            },
            'Go to Tokyo Tower': {
                next: '',
                effect: { movePage: 'tokyo_tower', addLocation: 'tokyo_tower' },
            },
        },
    },
};

function Hachiko() {
    const router = useRouter();
    const [currentNode, setCurrentNode] = useState('start');
    const [inventory, setInventory] = useState([]);
    const [userId, setUserId] = useState(null);
    const [points, setPoints] = useState(null);
    const [location, setLocation] = useState([]);

    useEffect(() => {
        fetchCurrentUser().then(user => {
            if (user) {
                setUserId(user.id);
            }
        });
    }, []);

    useEffect(() => {
        fetchUserPoints(userId).then(setPoints);
    });

    useEffect(() => {
        if (userId) {
            fetchUserLocations(userId).then(setLocation);
        }
    }, [userId]);

    const handleChoice = async choice => {
        const nextNode = story[currentNode].choices[choice];

        if (nextNode.effect?.addItem) {
            setInventory(prev => [
                ...new Set([...prev, nextNode.effect.addItem]),
            ]);
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

        if (nextNode.effect?.movePage) {
            router.push(nextNode.effect.movePage); // Navigate to the specified page
            return;
        }

        if (nextNode.next) {
            setCurrentNode(nextNode.next);
        }
    };

    return (
        <div className="p-4">
            <img
                className="w-full h-full inset-0 object-cover object-top"
                src="/hachiko.png"
            />
            <h1 className="text-2xl font-bold mb-4">
                {story[currentNode].text}
            </h1>

            <div className="space-y-2">
                {Object.entries(story[currentNode].choices).map(
                    ([choice, details]) => (
                        <button
                            key={choice}
                            onClick={() => handleChoice(choice)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            {choice}
                        </button>
                    ),
                )}
            </div>

            {/* Display inventory */}
            <div className="mt-4 p-2 border rounded-md">
                <h2 className="font-bold">Locations Visited:</h2>
                {location != null ? (
                    <ul>
                        {location.map((location, index) => (
                            <li key={index}>📍 {location}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nothing yet...</p>
                )}
            </div>

            {/* Display points */}
            <div className="mt-4 p-2 border rounded-md">
                <h2 className="font-bold">Points: {points}</h2>
            </div>
        </div>
    );
}

export default Hachiko;
// export default introPage;
