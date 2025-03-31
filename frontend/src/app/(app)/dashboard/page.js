'use client';
import Header from '@/app/(app)/Header';
import Link from 'next/link';
import React from 'react';

const Homepage = () => {
    const [count, setCount] = React.useState(0);

    return (
        <>
            <Header title="WELCOME TO SHIBUYA" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg text-center">
                        <Link
                            href="/gamepages"
                            className="absolute top-2/3 left-1/2 transform -translate-x-[100px] -translate-y-[70px]
                                       bg-black text-white py-6 px-8 rounded-lg text-xl font-bold">
                            Start the Game!
                        </Link>
                    </div>
                </div>
            </div>
            <img className="mx-auto" src="/shibuya-intro.jpg" />
        </>
    );
};

export default Homepage;
