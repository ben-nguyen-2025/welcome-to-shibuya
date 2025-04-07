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
        text: 'Heading northeast from Meiji Jingu, you embark on quite a long trek, eventually coming face to face with what appears to be an important bridge. You cross over it, taking note of the wide moats that encircle the grounds of what seems to be a palace. Upon reaching the other side, the first thing that strikes you is the unexpected tranquility, especially for a palace in the heart of Tokyo. The lush greenery of the gardens and the tall trees create a serene atmosphere, offering a stark contrast to the city’s bustling energy that you’ve grown so accustomed to. It quickly becomes clear that you’ve arrived at the imperial palace.',
        choices: {
            'Keep going': { next: 'imperial_palace' },
        },
    },

    imperial_palace: {
        text: 'Entering the palace grounds, you are greeted by lush grass and meticulously maintained bushes and trees. People relaxing on benches that line the walkway, truly adding to the already peaceful atmosphere of the palace.',
        choices: {
            'Take a break': { next: 'take_break' },
            Continue: { next: 'east_garden' },
        },
    },

    take_break: {
        text: 'Finding the nearest bench, you take off your bag and sit down. As you observe the rolling clouds above, the sound of people chatting softly in the background becomes like white noise, almost lulling you into a peaceful sleep',
        choices: {
            'Doze Off': { next: 'doze_off' },
            'Get up and get going': { next: 'east_garden' },
        },
    },

    doze_off: {
        text: 'Closing your eyes for just a moment, you suddenly wake to a tap on your shoulder. It’s a worker, informing you that the palace is about to close and it’s time to leave. In your sleepy haze, you realize you’ve slept the day away by mistake.',
        choices: {
            restart: {
                next: '',
                effect: {
                    movePage: 'shibuya_station',
                    zeroPoints: true,
                    zeroLocation: true,
                },
            },
        },
    },

    east_garden: {
        text: 'As you walk out of the front gardens, you approach what appears to be the inner grounds of the palace, only to find that it’s closed. Curious, you ask one of the guards, who simply shakes his head and informs you that the inner grounds are open to the public only twice a year. A bit disappointed, you turn toward the direction of the East Gardens.',
        choices: {
            Next: { next: 'next' },
        },
    },

    next: {
        text: 'As you’ve heard in the rumors, the gardens are enormous. It takes quite a while to get around, but as you walk through, you take note of the remnants of Edo Castle and discover a few more green spaces to explore. Not finding much else to do in this section, you decide to move on to the final area: Kitanomaru Park.',
        choices: {
            'Go to Park': { next: 'park' },
        },
    },

    park: {
        text: 'Walking through the park, you notice many attractions, from museums and arenas to boat rides. Fortunately, you arrived in spring, one of the best times to visit, with the flowers in full bloom.',
        choices: {
            'Take a boat ride': {
                next: 'boat_ride',
                effect: { addPoints: 10 },
            },
            'Leave the palace': {
                next: '',
                effect: { movePage: 'tokyo_tower' },
            },
        },
    },

    boat_ride: {
        text: 'Right next to the park, in the moat section, you find a dock lined with boats available for rent. After chatting with an employee for a while, you choose a boat and head out onto the lake. Fortunately, it’s spring, and as you row through the moat, the cherry blossoms, in full bloom, dance in the wind, scattering petals around you. You spend some time just floating in the moment, until your time runs out and you’re forced to leave the palace.',
        choices: {
            'Leave the palace': {
                next: '',
                effect: { movePage: 'tokyo_tower' },
            },
        },
    },

    walk_away: {
        text: 'After seeing the line you decide it’s not worth it to wait all that time to just see yet another dusty old temple like the hundreds of others in Shibuya alone.',
        choices: {},
    },

    enter_temple: {
        text: 'Entering the temple, you are greeted by a sea of people. Some adding to the towering wall of ema near the old prayer tree, others watch the occasional wedding ceremony pass by, while a few at the front prepare for a ceremony of their own. At either end of the shrine stands two gates, labeled “East Gate” and “West Gate” respectively. ',
        choices: {
            'Pay your respects': { next: 'pay_respects' },
            'Go through east gate': { next: 'east_gate' },
            'Go through west gate': { next: 'west_gate' },
        },
    },

    enter_temple_c: {
        text: 'Entering the temple, you are greeted by a sea of people. Some adding to the towering wall of ema near the old prayer tree, others watch the occasional wedding ceremony pass by, while a few at the front prepare for a ceremony of their own. At either end of the shrine stands two gates, labeled “East Gate” and “West Gate” respectively. ',
        choices: {
            'Go through east gate': { next: 'east_gate' },
            'Go through west gate': { next: 'west_gate' },
        },
    },

    pay_respects: {
        text: 'Since you’re here, you decide to pay your respects. You grab an ema and add it to the wall, perhaps praying for a smooth rest of your day – but who knows?',
        choices: {
            'Go back': { next: 'enter_temple_c' },
        },
    },

    east_gate: {
        text: 'You decide to pass through the East Gate. After walking about 100 paces, you enter a field filled with stalls selling an assortment of charms and memorabilia. At the far end of the stalls, a path leads you back to the front of Meiji Jingu.',
        choices: {
            'Go east': { next: 'tokyo_tower' },
            'Go northeast': { next: 'imperial_palace' },
        },
    },

    west_gate: {
        text: 'Going through the West Gate, you find it leads to a side exit with a small animal petting zoo on the other side. Unfortunately, it seems there’s not much else here, you go back to the front of Meiji Jingu.',
        choices: {
            'Go east': { next: 'tokyo_tower' },
            'Go northeast': { next: 'imperial_palace' },
        },
    },
};

function imperial_palace() {
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

export default imperial_palace;
// export default introPage;
