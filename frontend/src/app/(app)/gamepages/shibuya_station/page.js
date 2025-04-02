'use client';
import { useEffect, useState } from 'react';
import React from 'react';

// const introPage = () => {
//     var canLoad = true;
//     //NOTE: put the script for a screen line-by-line here. we can figure out how to
//     //adjust based on choices tomorrow
//     const [text, setText] = useState([
//         'You open your eyes, you feel the shaking of the train car.The familiar chime of the train informing you that you are nearing your destination',
//         '"We will soon arrive at Shibuya, IN-01. This is the last station of this line. Please change trains here for the JR Line, the Tokyu Line, and the Subway Line. The doors on the right side will open, thank you for using the Keio Inokashira Line"',
//         'The train juts to a stop and people begin rushing off. Caught up in the wave of people, you find yourself forcibly ushered out onto the platform. After gathering yourself you decide to check your things.',
//         '*1. Check pockets *2. Check backpack',
//     ]);
//     const [index, setIndex] = useState(0);
//     const [questionIndex] = useState([3]);

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

//         if (index == 3) {
//             //make a choice
//             //4 is pocket, 5 is backpack
//         }
//         //choices will be represented by number when they pop up in the screen
//     };

//     return (
//         <div className="relative">
//             <h1 className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-center font-bold">
//                 Shibuya Station
//             </h1>
// <img
//     className="w-full h-full inset-0 object-cover object-top"
//     src="/subway.png"
// />
//             <div>
//                 <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-10 p-2">
//                     {text[index]}
//                 </div>
//             </div>
//         </div>
//     );
// };

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
            continue: { next: 'start', effect: { addItem: '5000 yen' } },
        },
    },
    stay_here: {
        text: 'You stay put and wait. After a while, you hear something approaching...',
        choices: {
            run: { next: 'explore_forest' },
            hide: { next: 'game_over' },
        },
    },
    game_over: {
        text: 'You were caught by a wild beast. Game Over.',
        choices: {},
    },
};

function TextAdventure() {
    const [currentNode, setCurrentNode] = useState('start');
    const [inventory, setInventory] = useState([]); // Inventory state
    const [index, setIndex] = useState(0);

    useEffect(() => {
        document.addEventListener('keydown', moveText, true);
    }, []);

    const moveText = e => {
        console.log('clicked key: ' + e.key);
        if (e.key == ' ' || e.key == 'Enter' || e.key == 'ArrowRight') {
            //console.log('go forwards');
            setIndex(index => {
                if (index < text.length - 1) {
                    return index + 1;
                }
                return index;
            });
        }
        if (e.key == 'ArrowLeft') {
            //console.log('go backwards');
            setIndex(index => {
                if (index > 0) {
                    return index - 1;
                }
                return index;
            });
        }
    };

    const handleChoice = choice => {
        const nextNode = story[currentNode].choices[choice];

        if (nextNode.effect?.addItem) {
            setInventory(prev => [
                ...new Set([...prev, nextNode.effect.addItem]),
            ]);
        }

        setCurrentNode(nextNode.next);
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
