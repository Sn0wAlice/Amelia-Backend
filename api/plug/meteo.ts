import { Response } from "../../utils/types.ts";
import { logs } from "../../utils/logs.ts";
import { translate } from "../../utils/translate.ts";
/**
 * Returns the words that trigger the meteo plugin
 */
export const words = [
    ["meteo", "météo", "meteo", "météo"],
    ["etre", "est", "être", "c'est", "donner", "donne"]
]

/**
 * Execute the meteo plugin
 */
export const main = async function(initial, action, command, data) {
    let response:Response = {}

    // Step1: get the city
    const city = await getCity(initial.split(" "));
    if(city.length == 0) {
        response.body = {
            error: false,
            talk: {
                needtotalk: true,
                message: "You need to specify a city"
            }
        }
        return response;
    }

    // Step2: get the valid city
    const validCity = await getValidCity(city);
    if(!validCity) {
        response.body = {
            error: false,
            talk: {
                needtotalk: true,
                message: "The city you specified is not valid"
            }
        }
        return response;
    }

    logs.info("Meteo: " + validCity);

    // Step3: get the meteo
    const meteo = await getMeteo(validCity);

    // get current meteo
    const current = meteo.current_condition.condition

    // translate to english
    const translated = await translate(current, "fr", "en");
    

    response.body = {
        error: false,
        talk: {
            needtotalk: true,
            message: "The current weather is " + translated
        }
    }

    return response;
}


async function getCity(command:string[]) {
    let city:string[] = []
    for(let i = 0; i < command.length; i++) {
        const word = command[i];
        if(word == "à" || word == "a" || word == "dans" || word == "de" || word == "sur" || word == "pour") {
            city.push(command[i+1]);
            i++;
        }
    }
    return city;
}

async function getValidCity(city:string[]) {
    for(let i = 0; i < city.length; i++) {
        const c = city[i];
        const res = await fetch(`https://geo.api.gouv.fr/communes?fields=nom,code,codesPostaux&format=json&geometry=centre&nom=${c}`);
        const json = await res.json();
        if(json.length > 0) {
            // check if we have a perfect match
            const perfect = json.find((v:any) => v.nom.toLowerCase() == c.toLowerCase());
            if(perfect) {
                return perfect.nom;
            }
            // check if we have a partial match
            const partial = json.find((v:any) => v.nom.toLowerCase().includes(c.toLowerCase()));
            if(partial) {
                return partial.nom;
            }
            // return the first city
            return json[0].nom;
        }
    }
    return null
}

async function getMeteo(city:string) {
    try {
        const res = await fetch("https://www.prevision-meteo.ch/services/json/" + city);
        const json = await res.json();
        if(json.city_info) {
            return json;
        }
    } catch (error) {
        console.log(error);
    }
    return null
}