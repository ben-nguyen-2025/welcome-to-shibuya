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
        text: 'You open your eyes, you feel the shaking of the train car. The familiar chime of the train informing you that you are nearing your destination. The train juts to a stop and people begin rushing off. Caught up in the wave of people we are ushered out onto the platform, after gathering yourself you decide to check your things.',
        choices: {
            backpack: { next: 'check_backpack' },
            wallet: { next: 'check_wallet' },
        },
    },
    check_backpack: {
        text: "From your back you swing around a large bag, searching it you find a balled up sweater, a water bottle and your wallet. You yank the hoodie out of your bag, quickly pulling it over your head. The familiar weight of the fabric settles around you, you take a deep breath and for a brief moment you can't help but feel a slight sense of comfort from the old thing.",
        choices: {
            // 'check wallet': {
            //     next: 'sword_collected',
            //     effect: { addItem: 'sword' },
            // },
            'check wallet': { next: 'check_wallet' },
        },
    },
    check_wallet: {
        text: 'Opening your wallet you find 5000 yen, your debit card, and your residence/school id cards.',
        choices: {
            continue: {
                next: 'start_with_wallet',
                effect: { addItem: '5000 yen' },
            },
        },
    },
    start_with_wallet: {
        text: 'You decide to check your pockets...',
        choices: {
            continue: { next: 'realize_no_money' },
        },
    },
    realize_no_money: {
        text: 'You realize you lost your phone! What are you going to do?',
        choices: {
            'talk to authorities': { next: 'talk_to_authorities' },
            'exit the station': { next: 'exit_the_station' },
            cry: { next: 'cry_game_over' },
        },
    },
    talk_to_authorities: {
        text: 'Seeing that your phone is lost, you decide that the next logical step is to talk to the transit authorities to see if you can somehow get it back. After talking to the officer you get the point across that your phone is missing. The officer scratches his head for a moment then makes a few quick calls. He then informs you that the train you were on became a special express and is now in hashimoto station, and that they will have someone hold it there until you go retrieve it.',
        choices: {
            'Try to persuade the officer ': { next: 'persuade_officer' },
            'Bribe the officer': { next: 'bribe_officer' },
            'Exit the station': { next: 'exit_the_station' },
        },
    },
    persuade_officer: {
        text: 'You try and persuade the officer to have someone bring it back to the station with tears in your eyes, he looks at you with a that anyone with a set of eyes could tell he was uncomfortable but in the end he agrees and someone should have the phone back to the station by the end of the day IF they find it.',
        choices: {
            'Exit the station': {
                next: 'exit_the_station',
                effect: { addPoints: 10 },
            },
        },
    },
    bribe_officer: {
        text: 'you try to hand persuade the officer with what little money you have, he takes one good looks at it and laughs, leaving you off with a warning to never do that again.',
        choices: {
            'Exit the station': { next: 'exit_the_station' },
        },
    },
    exit_the_station: {
        text: "After walking through the station, you go down the escalator and are met with a sea of people, a thousand neon lights, and just as many smells, to say it's overwhelming at first is an understatement, but in the best way possible.",
        choices: {
            'Go West (Hachiko)': {
                next: '',
                effect: { movePage: 'hachiko', addLocation: 'hachiko' },
            },
            'Go North (Meiji Jingu)': {
                next: '',
                effect: { movePage: 'meiji_jingu', addLocation: 'meiji_jingu' },
            },
            'Go East (Tokyo Tower)': {
                next: '',
                effect: { movePage: 'tokyo_tower', addLocation: 'tokyo_tower' },
            },

     
        },
    },
    realize_no_money: {
        text: 'You realize you lost your phone! What are you going to do?',
        choices: {
            'talk to authorities': { next: 'talk_to_authorities' },
            'exit the station': { next: 'exit_the_station' },
            cry: { next: 'cry_game_over' },
        },
    },
    cry_game_over: {
        text: 'you keep crying and crying and eventually you waste your whole day doing nothing',
        choices: {
            restart: { next: 'start', effect: { zeroPoints: true } },
        },
    },
};

function TextAdventure() {
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
                src="/subway.png"
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

export default TextAdventure;
// export default introPage;
