/**
 * Extracts a JSON code block (```json ... ```) from a string, parses it,
 * and optionally returns a specific key. If that key is `filebase64`,
 * this function also attempts to parse the `filebase64` value as JSON.
 *
 * @param inputString The full string containing a ```json ... ``` block.
 * @param key (Optional) If provided, returns just that key's value from the JSON.
 *            If it's "filebase64", we parse that string as JSON again.
 *            Otherwise, returns the entire parsed JSON object if omitted.
 * @returns The JSON object or a specific field's value.
 */
export default function extractJsonFromString(
  inputString: string,
  key?: "content" | "filebase64" | "id" | "role"
) {
  try {
    // 1. Regex to match ```json ... ```
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = inputString.match(regex);
    if (!match) {
      return null;
    }

    // 2. Parse the top-level JSON
    const topLevelObj = JSON.parse(match[1]);

    // 3. If no key is provided, return the entire object
    if (!key) {
      return topLevelObj;
    }

    // 4. If the requested key is filebase64, parse it as JSON
    if (key === "filebase64") {
      const fileBase64String = topLevelObj.filebase64;
      if (fileBase64String) {
        try {
          // Attempt to parse the filebase64 string as JSON (e.g., an array of objects)
          return JSON.parse(fileBase64String);
        } catch (err) {
          console.error("Failed to parse filebase64 as JSON:", err);
          // Fallback to returning the raw string if parsing fails
          return fileBase64String;
        }
      } else {
        return null;
      }
    }

    // 5. Otherwise, return the requested key from the top-level object
    return topLevelObj[key] ?? null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
