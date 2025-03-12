import DefaultNeedle from "./DefaultNeedle";
import CompassNeedle from "./CompassNeedle";
import SpeedometerNeedle from "./SpeedometerNeedle";

/**
 * Factory function to create needle instances.
 * @param {string} type - The type of needle to create.
 * @returns {Function} The needle class.
 * @throws {Error} If the needle type is unknown.
 */
export function NeedleFactory(type) {
    switch (type.toLocaleLowerCase()) {
        case 'default':
            return DefaultNeedle;
        case 'compass':
            return CompassNeedle;
        case 'speedometer':
            return SpeedometerNeedle
        default:
            throw new Error('Unknown needle type');
    }
}

export default {
    DefaultNeedle,
    CompassNeedle,
    SpeedometerNeedle
};