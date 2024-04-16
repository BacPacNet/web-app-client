import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarsRating = ({ rating }: { rating: { value: number, totalStars: number } }) => {
    const { value, totalStars } = rating;
    // Calculate the number of filled stars
    const filledStars = Math.floor(value);
    // Calculate the number of remaining stars (either filled or empty)
    const remainingStars = totalStars - filledStars;

    // Render the filled stars
    const renderFilledStars = () => {
        const filledStarsArray = [];
        for (let i = 0; i < filledStars; i++) {
            filledStarsArray.push(
                <li key={i}>
                    <FaStar size={20} color="orange" />
                </li>
            );
        }
        return filledStarsArray;
    };

    // Render the remaining stars
    const renderRemainingStars = () => {
        const remainingStarsArray = [];
        for (let i = 0; i < remainingStars; i++) {
            remainingStarsArray.push(
                <li key={i + filledStars}>
                    <FaStar size={20} color="gray" />
                </li>
            );
        }
        return remainingStarsArray;
    };

    return (
        <span className="flex flex-row justify-center items-center">
            <ul className="flex flex-row gap-4">
                {/* Render filled stars */}
                {renderFilledStars()}
                {/* Render remaining stars */}
                {renderRemainingStars()}
            </ul>
        </span>
    );
};

export default StarsRating;
