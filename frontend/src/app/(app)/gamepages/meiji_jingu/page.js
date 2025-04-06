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

const story = {
    start: {
        text: "After a short walk north, something catches your eye-a massive torii gate, towering above you, it's dark wood standing in stark contrast to the bright city around it. Behind the gate, a lush forest seems to appear out of nowhere, its dense trees a surreal sight amidst the concrete jungle of Tokyo. To your left, a small sandwich shop hums with the quiet chatter of locals, and just beside it a sign welcomes visitors with a simple yet elegant message: “Welcome to Meiji Jingu”.",
        choices: {
            'Enter the torii gate': { next: 'go_closer' },
            'Stop for lunch': { next: 'walk_away' },
            'Stop for lunch': { next: 'walk_away' },
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
                effect: { movePage: 'hachiko' },
            },
            'Go to Tokyo Tower': {
                next: '',
                effect: { movePage: 'hachiko' },
            },
        },
    },
};

function meiji_jingu() {
    const router = useRouter();
    const [currentNode, setCurrentNode] = useState('start');
    const [inventory, setInventory] = useState([]);
    const [userId, setUserId] = useState(null);
    const [points, setPoints] = useState(null);

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

    const handleChoice = async choice => {
        const nextNode = story[currentNode].choices[choice];

        if (nextNode.effect?.addItem) {
            setInventory(prev => [
                ...new Set([...prev, nextNode.effect.addItem]),
            ]);
        }

        if (nextNode.effect?.movePage) {
            router.push(nextNode.effect.movePage); // Navigate to the specified page
            return;
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

        if (nextNode.next) {
            setCurrentNode(nextNode.next);
        }
    };

    return (
        <div className="p-4">
            <img
                className="w-full h-full inset-0 object-cover object-top"
                src="/meiji_1.png"
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
                <h2 className="font-bold">Inventory:</h2>
                {inventory.length > 0 ? (
                    <ul>
                        {inventory.map((item, index) => (
                            <li key={index}>🗡 {item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nothing yet...</p>
                )}
            </div>
            <div className="mt-4 p-2 border rounded-md">
                <h2 className="font-bold">Points: {points}</h2>
            </div>
        </div>
    );
}

export default meiji_jingu;
// export default introPage;
