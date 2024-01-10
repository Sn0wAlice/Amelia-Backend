export async function translate(text:string, from:string, to:string) {
    try {
        const req = await fetch("https://api.reverso.net/translate/v1/translation", {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                format: 'text',
                from: from,
                input: text,
                options: {
                    contextResults: true,
                    languageDetection: true,
                    origin: 'reversomobile',
                    sentenceSplitter: false,
                },
                to: to,
            })
        })
        const json = await req.json();
        text = json.translation[0]
    } catch (error) {
        console.log(error);
    }
    return text;
}