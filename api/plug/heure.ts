import { Response } from "../../utils/types.ts";
/**
 * Returns the words that trigger the hour plugin
 */
export const words = [
    ["heure", "heures", "heure", "heures"],
    ["etre", "est", "être", "c'est", "donner", "donne"]
]

/**
 * Execute the hour plugin
 */
export const main = async function(initial, action, command, data) {
    let response:Response = {}
    // get the current date with the current timezone
    // using: data.timezone, data.timestamp
    const date = new Date(data.timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // create the message
    const message = "It's " + hours + " hours and " + minutes + " minutes";

    response.body = {
        error: false,
        talk: {
            needtotalk: true,
            message: message
        }
    }

    return response;
}