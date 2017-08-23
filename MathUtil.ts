export class MathUtil
{
    /// <summary>
    /// Returns distance between two sets of coords
    /// </summary>
    /// <returns>
    /// distance between sets of coords
    /// </returns>
    public static getDistance(x1, y1, x2, y2): float
    {
        //! using long to avoid possible overflows when multiplying
        let dx: long = x2 - x1;
        let dy: long = y2 - y1;

        //? return Math.hypot(x2 - x1, y2 - y1); // Extremely slow
        //? return Math.Sqrt(Math.Pow(x, 2) + Math.Pow(y, 2)); // 20 times faster than hypot
        return <float>Math.sqrt(dx * dx + dy * dy); // 10 times faster then previous line
    }
    public static getRandom(min: Int32, max: Int32): Int32
    {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
}