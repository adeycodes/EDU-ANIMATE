import { GoogleGenAI, Type } from "@google/genai";
import { LessonAnalysis, Scene, Subject, GradeLevel } from "../types";

// Initialize Gemini Client
// In a real app, do not expose API_KEY in frontend code. Use a proxy backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

export const analyzeLesson = async (
  text: string, 
  subject: Subject, 
  grade: GradeLevel
): Promise<LessonAnalysis> => {
  if (!process.env.API_KEY) {
    // Mock response for preview without API key
    return new Promise(resolve => setTimeout(() => resolve({
      mainTopic: "Introduction to Photosynthesis",
      learningObjectives: ["Define photosynthesis", "Identify inputs and outputs", "Explain importance to plants"],
      keyConcepts: ["Sunlight", "Chlorophyll", "Glucose", "Oxygen"],
      difficulty: "medium",
      estimatedDuration: 120
    }), 1500));
  }

  const prompt = `
    You are an expert Nigerian education content creator specializing in ${subject} for ${grade} students.
    Analyze this lesson and extract key information.
    
    LESSON:
    ${text}
    
    Respond in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainTopic: { type: Type.STRING },
            learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
            estimatedDuration: { type: Type.NUMBER, description: "Estimated video duration in seconds" }
          },
          required: ["mainTopic", "learningObjectives", "keyConcepts", "difficulty", "estimatedDuration"]
        }
      }
    });
    
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as LessonAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze lesson content.");
  }
};

export const generateScenes = async (
  analysis: LessonAnalysis,
  originalText: string
): Promise<Scene[]> => {
  if (!process.env.API_KEY) {
     // Mock response
     return new Promise(resolve => setTimeout(() => resolve([
       {
         sceneNumber: 1,
         title: "Introduction",
         visualDescription: "A bright sun shining on a green leaf.",
         narrationScript: "Hello students! Today we will learn how plants make their own food using sunlight.",
         duration: 10,
         elements: [
           { type: 'circle', x: 100, y: 100, width: 80, height: 80, color: '#FDB813', animationDelay: 0 },
           { type: 'text', content: 'Sunlight', x: 200, y: 120, color: '#000', animationDelay: 1000 },
           { type: 'rectangle', x: 400, y: 200, width: 100, height: 150, color: '#22c55e', animationDelay: 2000 }
         ]
       },
       {
         sceneNumber: 2,
         title: "The Process",
         visualDescription: "Water coming from roots and CO2 entering leaves.",
         narrationScript: "Plants drink water from the soil through their roots. They also breathe in Carbon Dioxide.",
         duration: 15,
         elements: [
            { type: 'text', content: 'H2O + CO2', x: 300, y: 300, color: '#1e40af', animationDelay: 500 },
            { type: 'line', x: 300, y: 350, width: 200, height: 2, color: '#000', animationDelay: 1500 }
         ]
       }
     ]), 2000));
  }

  const prompt = `
    Create a whiteboard animation storyboard for this lesson.
    TOPIC: ${analysis.mainTopic}
    KEY CONCEPTS: ${analysis.keyConcepts.join(', ')}
    FULL TEXT: ${originalText}

    Generate 3-5 scenes.
    For 'elements', generate simplified drawing instructions. 'x' and 'y' should be between 0 and 800 (canvas width), 'width' and 'height' appropriate for the shape.
    Colors should be hex codes.
    Narration should be in a conversational Nigerian teacher tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              visualDescription: { type: Type.STRING },
              narrationScript: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ["text", "rectangle", "circle", "line"] },
                    content: { type: Type.STRING },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                    color: { type: Type.STRING },
                    animationDelay: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr) as Scene[];
  } catch (error) {
    console.error("Gemini Scene Generation Error:", error);
    throw new Error("Failed to generate scenes.");
  }
};