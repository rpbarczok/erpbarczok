export function removeBeforeLastDigits(str: string): number {
    // Regex to find the last sequence of digits
    const regex = /\d+$/;
    // Find the match
    const match = str.match(regex);
    // If there's a match, return the substring starting from the match
    if (match) {
        return Number(str.slice(str.lastIndexOf(match[0])));
    }
    // If no match, return an empty string
    return 0;
}