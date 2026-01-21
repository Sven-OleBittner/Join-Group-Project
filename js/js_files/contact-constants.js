/**
 * Contact Management - Constants and Global Variables
 * This module contains all constants and global variables used across contact modules
 * Note: BASE_URL is defined in db.js
 */

let currentData = [];
let selectedContactKey = null;

// Available color classes from color.css
const colorClasses = [
    'color-orange',
    'color-pink',
    'color-purple',
    'color-violet',
    'color-cyan',
    'color-turquoise',
    'color-coral',
    'color-peach',
    'color-light-pink',
    'color-yellow',
    'color-blue',
    'color-lime-green',
    'color-light-yellow',
    'color-red',
    'color-goldenrod'
];

/**
 * Gets a random color class from the available color classes
 * @returns {string} A random color class name
 */
function getRandomColorClass() {
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}
