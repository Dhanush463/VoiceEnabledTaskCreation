const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai'); 
const chrono = require('chrono-node');

const ai = new GoogleGenAI({});

const TaskSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The concise title for the task, derived from the input speech."
        },
        priority: {
            type: "string",
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            description: "The priority level inferred from the user's request. Default to 'Medium' if none specified."
        },
        status: {
            type: "string",
            enum: ['To Do', 'In Progress', 'Done'],
            description: "The starting status for the task. Default to 'To Do'."
        },
        dueDatePhrase: {
            type: "string",
            description: "The exact relative or absolute date/time phrase found in the speech, e.g., 'by tomorrow evening', 'next Monday', or 'in two days'."
        }
    },
    required: ["title", "priority", "status"]
};

router.post('/parse-voice', async (req, res) => {
    const { transcript } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: 'user', parts: [{ text: `You are an expert task parsing AI. Your job is to extract task details from a user's spoken transcript. You MUST return a JSON object conforming to the provided schema. If no due date phrase is found, omit the 'dueDatePhrase' field. Parse this task: "${transcript}"` }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: TaskSchema, 
            }
        });

        const rawJsonString = response.text;
        const parsedTask = JSON.parse(rawJsonString);

        let finalDueDate = null;
        if (parsedTask.dueDatePhrase) {
            const chronoResult = chrono.parseDate(parsedTask.dueDatePhrase);
            if (chronoResult) {
                finalDueDate = chronoResult.toISOString();
            }
        }

        res.json({
            success: true,
            rawTranscript: transcript,
            parsedData: {
                title: parsedTask.title,
                priority: parsedTask.priority,
                status: parsedTask.status,
                dueDate: finalDueDate,
                dueDatePhrase: parsedTask.dueDatePhrase || ''
            }
        });

    } catch (error) {
        console.error("Gemini Parsing Error:", error.message);
        res.status(500).json({ success: false, message: 'Failed to process and parse voice input.' });
    }
});

module.exports = router;