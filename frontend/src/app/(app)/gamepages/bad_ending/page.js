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
        text: 'Feeling beaten down, tired, and drained of hope for your phone, you make your way back to Shibuya station, still clinging to a sliver of hope that it might somehow turn up. You approach the station authorities, but they simply shake their heads, confirming the sinking feeling in your chest. Without your phone and utterly exhausted, you mutter to yourself that you’ll never return to Shibuya again',
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
};

function bad_ending() {
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
                src="/badending.png"
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

export default bad_ending;
// export default introPage;
