'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    fetchCurrentUser,
    fetchUserPoints,
    fetchUserLocations,
    handleChoice,
} from '@/app/utils';

const story = {
    start: {
        text: 'after such a frantic day, exhaustion weighs heavily on you as you begin your trek back to Shibuya station. You’ve heard nothing from the station authorities all day, and the hope of finding your phone is slowly falling. With a deep breath, you ascend the escalator and approach the station booth. The employee looks up, locking eyes with you, in that instant their face brightens, and they quickly duck under the desk, emerging with a small black rectangle it’s your phone.',
        choices: {
            Next: { next: 'next' },
        },
    },

    next: {
        text: 'A surge of relief washes over you. You can’t help but break into a goofy grin, your heart lifting. You thank the guard profusely, feeling a wave of gratitude as you take the phone from their hand. Without wasting another moment, you rush to catch the train, feeling lighter than you have all day. As you settle into your seat, you can’t help but think to yourself you can’t help but think to yourself, “This has been such a great day”',
        choices: {
            'Restart?': {
                next: '',
                effect: {
                    movePage: 'shibuya_station',
                    zeroPoints: true,
                    zeroLocation: true,
                },
            },
        },
    },

    restart: {
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
            home: {
                next: '',
                effect: {
                    movePage: 'shibuya_station',
                    determineEnding: true,
                },
            },
        },
    },
};

function good_ending() {
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

    return (
        <div className="p-4">
            <img
                style={{ margin: 'auto', height: '60vh' }}
                className="object-contain object-center object-top"
                src="/goodending.png"
            />
            <h1 className="text-2xl font-bold mb-4">
                {story[currentNode].text}
            </h1>
            <div className="space-y-2">
                {Object.entries(story[currentNode].choices).map(
                    ([choice, details]) => (
                        <button
                            key={choice}
                            onClick={() =>
                                handleChoice(
                                    choice,
                                    currentNode,
                                    setCurrentNode,
                                    setInventory,
                                    setPoints,
                                    setLocation,
                                    userId,
                                    story,
                                    router,
                                )
                            }
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

export default good_ending;
// export default introPage;
