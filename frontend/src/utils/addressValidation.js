export const validateAddress = (address) => {
    if (!address || typeof address !== 'string') return "Enter your Full Address";

    // Clean up the address
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return "Enter your Full Address";

    // Validate PIN Code
    // Regex: Exactly 6 digits, first digit 1-9
    const pinRegex = /\b[1-9][0-9]{5}\b/;
    const pinMatch = trimmedAddress.match(pinRegex);

    if (!pinMatch) {
        return "Invalid PIN code";
    }

    // Validation Requirements logic (heuristic for single string):
    // 1. House / Door number must not be empty
    // 2. Street name must not be empty and should have a minimum reasonable length
    // 3. City and State fields must be filled

    // Since we have a single string, we check if there's substantial content *outside* the PIN.
    const contentWithoutPin = trimmedAddress.replace(pinRegex, '').trim();

    // Heuristics:
    // - Length check: Assuming regular address parts take at least 10-15 chars.
    // - Should look like words are present.
    if (contentWithoutPin.length < 15) {
        return "Enter your Full Address"; // Generic error as requested for missing fields
    }

    return "Valid Address";
};
