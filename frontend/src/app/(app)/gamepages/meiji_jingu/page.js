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
        text: "After a short walk north, something catches your eye-a massive torii gate, towering above you, it's dark wood standing in stark contrast to the bright city around it. Behind the gate, a lush forest seems to appear out of nowhere, its dense trees a surreal sight amidst the concrete jungle of Tokyo. To your left, a small sandwich shop hums with the quiet chatter of locals, and just beside it a sign welcomes visitors with a simple yet elegant message: “Welcome to Meiji Jingu”.",
        choices: {
            'Enter the torii gate': { next: 'torii_gate' },
            'Stop for lunch': { next: 'lunch' },
        },
    },

    start_food: {
        text: "After a short walk north, something catches your eye-a massive torii gate, towering above you, it's dark wood standing in stark contrast to the bright city around it. Behind the gate, a lush forest seems to appear out of nowhere, its dense trees a surreal sight amidst the concrete jungle of Tokyo. To your left, a small sandwich shop hums with the quiet chatter of locals, and just beside it a sign welcomes visitors with a simple yet elegant message: “Welcome to Meiji Jingu”.",
        choices: {
            'Enter the torii gate': { next: 'torii_gate' },
        },
    },

    lunch: {
        text: 'In all your excitement exploring Shibuya you almost forgot to stop for some lunch, luckily not even fifty steps away is a quaint little shop known as “Mori no Terrace”. Stepping inside, you’re greeted by warm, wooden walls that echo the Meiji Jingu forest’s concept of “recycle”, giving the place a cozy, natural feel. The soft hum of conversation fills the air as you approach the menu, which boasts a tempting selection of sandwiches, coffee, and pastries.',
        choices: {
            'Get a sandwich/drink ': {
                next: 'get_food',
            },
        },
    },

    get_food: {
        text: 'After perusing the menu, you settle on an egg and tuna sandwich paired with a rich cappuccino. You take your food and find a spot by the window. As you take a bite, your gaze drifts outside, the bustling city of Shibuya sprawling in every direction. The sharp contrast between the urban energy and the serene, green expanse of Meiji Jingu’s forest just behind you strikes you - a perfect moment of calm amidst the chaos.',
        choices: {
            'Go Back': { next: 'start_food' },
        },
    },

    torii_gate: {
        text: 'Walking through the towering gates, you wander for what feels like an eternity, passing small exhibits, statues, and monuments dedicated to the gods. In the distance, a temple rises amidst lush green trees, its grandeur drawing crowds of people who queue eagerly to enter.',
        choices: {
            'Enter the Temple': { next: 'enter_temple' },
            'Walk Away': { next: 'walk_away' },
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
            'Go east': {
                next: '',
                effect: { movePage: 'tokyo_tower', addLocation: 'tokyo_tower' },
            },
            'Go northeast': {
                next: '',
                effect: {
                    movePage: 'imperial_palace',
                    addLocation: 'imperial_palace',
                },
            },
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
            'Go east': {
                next: '',
                effect: {
                    movePage: 'tokyo_tower',
                    addLocation: 'tokyo_tower',
                },
            },
            'Go northeast': {
                next: '',
                effect: {
                    movePage: 'imperial_palace',
                    addLocation: 'imperial_palace',
                },
            },
        },
    },

    west_gate: {
        text: 'Going through the West Gate, you find it leads to a side exit with a small animal petting zoo on the other side. Unfortunately, it seems there’s not much else here, you go back to the front of Meiji Jingu.',
        choices: {
            'Go east': {
                next: '',
                effect: {
                    movePage: 'tokyo_tower',
                    addLocation: 'tokyo_tower',
                },
            },
            'Go northeast': {
                next: '',
                effect: {
                    movePage: 'imperial_palace',
                    addLocation: 'imperial_palace',
                },
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
            <div className="mt-4 p-2 border rounded-md">
                <h2 className="font-bold">Points: {points}</h2>
            </div>
        </div>
    );
}

export default meiji_jingu;
// export default introPage;
