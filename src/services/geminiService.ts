import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });
  }

  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  async generateResearchTopics(field: string, interestArea?: string): Promise<any[]> {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please provide an API key.');
    }

    const prompt = `Generate 4 innovative and specific research topic suggestions for a student in ${field}${
      interestArea ? ` with interest in ${interestArea}` : ''
    }.

For each topic, provide:
1. A compelling, specific title (not generic)
2. A brief 1-2 sentence description explaining the research focus
3. The field category

Format your response as a JSON array with this structure:
[
  {
    "title": "Specific Research Title Here",
    "description": "Brief description of the research focus and potential impact.",
    "field": "${field}"
  }
]

Make sure the topics are:
- Current and relevant to modern challenges
- Feasible for student-level research
- Innovative and not overly common
- Specific enough to provide clear research direction
- Varied in approach and methodology

Focus on emerging trends, interdisciplinary approaches, and practical applications.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return suggestions.map((suggestion: any) => ({
          title: suggestion.title,
          description: suggestion.description,
          field: suggestion.field || field
        }));
      } else {
        // Fallback parsing if JSON format is not perfect
        return this.parseAlternativeFormat(text, field);
      }
    } catch (error) {
      console.error('Error generating topics with Gemini:', error);
      throw new Error('Failed to generate research topics. Please try again.');
    }
  }

  private parseAlternativeFormat(text: string, field: string): any[] {
    // Fallback parser for when Gemini doesn't return perfect JSON
    const topics = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentTopic: any = {};
    
    for (const line of lines) {
      if (line.includes('title') || line.match(/^\d+\./)) {
        if (currentTopic.title) {
          topics.push({ ...currentTopic, field });
          currentTopic = {};
        }
        currentTopic.title = line.replace(/^\d+\./, '').replace(/title:?/i, '').replace(/['"]/g, '').trim();
      } else if (line.includes('description') || (currentTopic.title && !currentTopic.description)) {
        currentTopic.description = line.replace(/description:?/i, '').replace(/['"]/g, '').trim();
      }
    }
    
    if (currentTopic.title) {
      topics.push({ ...currentTopic, field });
    }
    
    return topics.slice(0, 4); // Limit to 4 topics
  }
}

export const geminiService = new GeminiService();