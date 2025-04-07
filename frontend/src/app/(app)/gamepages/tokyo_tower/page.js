'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    fetchCurrentUser,
    fetchUserPoints,
    fetchUserLocations,
} from '@/app/utils';

const story = {
    start: {
        text: 'Heading east from the palace you find yourself under the iconic tokyo tower in all its red and white painted glory, some say it looks like a candy cane and you have to say you definitely agree.',
        choices: {
            'go up the tower': { next: 'go_up_the_tower' },
            'investigate the base': { next: 'investigate_the_base' },
            'head out': { next: 'exit_the_tower' },
        },
    },

    go_up_the_tower: {
        text: 'You enter the tower, grabbing a ticket at the kiosk. Inside, you see two paths: a spiral staircase leading toward the stars, offering a slow climb with stunning views, or a sleek elevator that promises a fast, smooth ride to the top. The choice is yours.',
        choices: {
            'take stairs': { next: 'went_up_stairs', effect: { addPoints: 5 } },
            'take elevator': { next: 'went_up_elevator' },
        },
    },

    went_up_stairs: {
        text: 'Bravely, you muster what strength you have and begin your ascent up the stairs. It takes you much longer than you thought and once at the top you are absolutely wiped. But you did it!',
        choices: {
            'see the top': { next: 'the_peak' },
        },
    },

    went_up_elevator: {
        text: 'You stand at the base of the tower, your eyes scanning the daunting staircase. Seven, maybe eight flights of stairs—each step a promise of burn and exhaustion. You glance over to the elevator, gleaming with the promise of convenience and ease. For a moment, you consider the climb, the sense of accomplishment, the challenge. Then, the thought of the fatigue setting in halfway up makes you reconsider. With a slight sigh, you make the logical choice. The elevator, your reliable ally, awaits. You step inside, hit the button, and feel the tension of the decision lift as the doors close, taking you upward without a second thought. The climb can wait.',
        choices: {
            'see the top': { next: 'the_peak' },
        },
    },

    the_peak: {
        text: 'The views are breathtaking. Stretching out before you is a horizon that seems to go on forever, an endless canvas where the earth meets the sky in a seamless blend of colors. The platform itself is a small oasis, complete with a cozy cafe tucked to the side and tiny shrine, its presence quiet and reverent. But its view steals your attention completely. You stand there, frozen for a moment, your eyes tracing the vastness that stretches out in every direction. The world feels endless, and for a brief moment, you forget to breathe, as the beauty of it all takes your breath away.',
        choices: {
            'go down': { next: 'exit_the_tower' },
        },
    },

    exit_the_tower: {
        text: 'where will you go next?',
        choices: {
            home: { next: 'exit_the_tower' },
        },
    },
};

function tokyo_tower() {
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
                src="/tokyo_tower.jpg"
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

export default tokyo_tower;
// export default introPage;
