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
        'The train just to a stop and people begin rushing off. Caught up in the wave of people, you find yourself forcibly ushered out onto the platform. After gathering yourself you decide to check your things.',
    ]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        document.addEventListener('keydown', moveText, true);
    }, []);

    const moveText = e => {
        console.log('clicked key: ' + e.key);
        if (e.key == ' ' || e.key == 'Enter' || e.key == 'ArrowRight') {
            console.log('go forwards');
            setIndex(index => {
                if (index < text.length - 1) {
                    return index + 1;
                }
                return index;
            });
        }
        if (e.key == 'ArrowLeft') {
            console.log('go backwards');
            setIndex(index => {
                if (index > 0) {
                    return index - 1;
                }
                return index;
            });
        }
    };

    return (
        <div className="relative">
            <h1 className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-center font-bold">
                Shibuya Station
            </h1>
            <img
                className="w-full h-full inset-0 object-cover object-top"
                src="/subway.png"
            />
            <div>
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-10 p-2">
                    {text[index]}
                </div>
            </div>
        </div>
    );
};

export default introPage;
