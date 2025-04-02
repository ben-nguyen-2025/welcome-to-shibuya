'use client';
import { useEffect, useState } from 'react';
import React from 'react';

const introPage = () => {
    var canLoad = true;
    //NOTE: put the script for a screen line-by-line here. we can figure out how to
    //adjust based on choices tomorrow
    const [text, setText] = useState([
        'You open your eyes, you feel the shaking of the train car.The familiar chime of the train informing you that you are nearing your destination',
        '"We will soon arrive at Shibuya, IN-01. This is the last station of this line. Please change trains here for the JR Line, the Tokyu Line, and the Subway Line. The doors on the right side will open, thank you for using the Keio Inokashira Line"',
        'The train juts to a stop and people begin rushing off. Caught up in the wave of people, you find yourself forcibly ushered out onto the platform. After gathering yourself you decide to check your things.',
    ]);
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
};
export default TextAdventure;
// export default introPage;
