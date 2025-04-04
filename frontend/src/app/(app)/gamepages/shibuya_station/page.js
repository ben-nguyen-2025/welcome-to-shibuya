'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

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
            'Exit the station': { next: 'exit_station' },
        },
    },
    persuade_officer: {
        text: 'You try and persuade the officer to have someone bring it back to the station with tears in your eyes, he looks at you with a that anyone with a set of eyes could tell he was uncomfortable but in the end he agrees and someone should have the phone back to the station by the end of the day IF they find it.',
        choices: {
            'Exit the station': { next: 'exit_the_station' },
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
                effect: { movePage: 'hachiko' },
            },
            'Go North (Meiji Jingu)': { next: '' },
            'Go East (Tokyo Tower)': { next: '' },
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
            restart: { next: 'start' },
        },
    },
};

function TextAdventure() {
    const router = useRouter();
    const [currentNode, setCurrentNode] = useState('start');
    const [inventory, setInventory] = useState([]);

    const handleChoice = choice => {
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

        if (nextNode.next) {
            setCurrentNode(nextNode.next);
        }
    };

    // Inventory state
    // const [index, setIndex] = useState(0);

    // useEffect(() => {
    //     document.addEventListener('keydown', moveText, true);
    // }, []);

    // const moveText = e => {
    //     console.log('clicked key: ' + e.key);
    //     if (e.key == ' ' || e.key == 'Enter' || e.key == 'ArrowRight') {
    //         //console.log('go forwards');
    //         setIndex(index => {
    //             if (index < text.length - 1) {
    //                 return index + 1;
    //             }
    //             return index;
    //         });
    //     }
    //     if (e.key == 'ArrowLeft') {
    //         //console.log('go backwards');
    //         setIndex(index => {
    //             if (index > 0) {
    //                 return index - 1;
    //             }
    //             return index;
    //         });
    //     }
    // };

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
        </div>
    );
}

export default TextAdventure;
// export default introPage;
