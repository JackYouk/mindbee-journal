import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    const prompt = req.body.prompt
    if (!prompt || prompt.trim() === '') {
        return new Response('Prompt invalid or missing', { status: 400 });
    }
    const aiResult = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: 'user', content: prompt}],
    });
    const response = aiResult.data.choices[0].message.content.trim() || "ERROR";
    res.status(200).json({res: response});
}