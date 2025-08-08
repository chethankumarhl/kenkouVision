import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });
  }

  // ✅ SYMPTOM ANALYZER - Fixed with improved JSON parsing
  async analyzeSymptoms(symptoms, patientHistory = "", age = null, gender = null) {
    const prompt = `
You are a medical AI assistant. Analyze these symptoms and respond with ONLY valid JSON in this exact format:

{
  "possibleConditions": [
    {
      "condition": "Condition name",
      "confidence": 8,
      "description": "Brief description", 
      "urgency": "Medium"
    }
  ],
  "recommendedActions": ["Action 1", "Action 2"],
  "urgencyLevel": "Medium",
  "additionalQuestions": ["Question 1?", "Question 2?"],
  "disclaimer": "This analysis is for informational purposes only."
}

Patient: Age ${age || 'unknown'}, Gender ${gender || 'unknown'}
Medical History: ${patientHistory || 'None'}
Symptoms: ${symptoms}

Return ONLY the JSON response, no additional text or formatting.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      console.log('Raw symptom analysis response:', text.substring(0, 200)); // Debug log
      
      // Clean up the response - remove markdown formatting if present
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*$/g, '');
      text = text.replace(/^\s*```json/g, '');
      
      // Try to parse JSON first
      try {
        const parsed = JSON.parse(text);
        // Ensure confidence values are numbers
        if (parsed.possibleConditions) {
          parsed.possibleConditions = parsed.possibleConditions.map(condition => ({
            ...condition,
            confidence: typeof condition.confidence === 'string' 
              ? parseInt(condition.confidence) 
              : condition.confidence
          }));
        }
        console.log('Successfully parsed symptom JSON'); // Debug log
        return parsed;
      } catch (parseError) {
        console.log('Symptom JSON parse failed, using fallback:', parseError); // Debug log
        return this.parseStructuredResponse(text);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  // ✅ DOCUMENT ANALYZER - Fixed with improved parsing
  async analyzeDocument(documentText, documentType = "medical report") {
    const prompt = `
You are a medical AI assistant. Analyze this ${documentType} and respond with ONLY valid JSON in this exact format:

{
  "documentType": "${documentType}",
  "summary": "Brief clinical summary",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "abnormalValues": [
    {
      "parameter": "Test name",
      "value": "Result value", 
      "normalRange": "Normal range",
      "significance": "Clinical meaning"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "urgency": "Low",
  "followUpRequired": true,
  "disclaimer": "AI analysis requires medical review."
}

Document Content: ${documentText}

CRITICAL: Return ONLY the JSON object, no additional text, markdown, or formatting.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      console.log('Raw document analysis response:', text.substring(0, 200)); // Debug log
      
      // More aggressive cleanup
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*$/g, '');
      text = text.replace(/^\s*```json/g, '');
      
      // Try to parse JSON first
      try {
        const parsed = JSON.parse(text);
        console.log('Successfully parsed document JSON'); // Debug log
        return parsed;
      } catch (parseError) {
        console.log('Document JSON parse failed, trying fallback:', parseError); // Debug log
        return this.parseStructuredDocumentResponse(text, documentType);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze document');
    }
  }

  // ✅ RADIOLOGY REPORT GENERATOR
  async generateRadiologyReport(imageDescription, patientInfo = {}) {
    const prompt = `
As a radiologist AI assistant, generate a comprehensive radiology report based on the following:

Image Description: ${imageDescription}
Patient Information: 
- Age: ${patientInfo.age || 'Not specified'}
- Gender: ${patientInfo.gender || 'Not specified'}
- Clinical History: ${patientInfo.clinicalHistory || 'Not provided'}

Generate a structured radiology report in JSON format:
{
  "reportType": "Radiology Report",
  "technique": "Imaging technique description",
  "findings": [
    "Finding 1",
    "Finding 2"
  ],
  "impression": "Overall clinical impression",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "urgency": "Low",
  "followUp": "Follow-up recommendations",
  "disclaimer": "This AI-generated report requires radiologist review and approval."
}

Return ONLY valid JSON, no additional text.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*$/g, '');
      text = text.replace(/^\s*```json/g, '');
      
      try {
        return JSON.parse(text);
      } catch {
        return this.parseStructuredRadiologyResponse(text);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate radiology report');
    }
  }

  // ✅ MEDICATION INFORMATION
  async getMedicationInfo(medicationName) {
    const prompt = `
Provide comprehensive information about the medication: ${medicationName}

Return a JSON response with:
{
  "medicationName": "${medicationName}",
  "genericName": "Generic name",
  "drugClass": "Drug classification",
  "indications": [
    "Primary indication 1",
    "Primary indication 2"
  ],
  "dosage": {
    "adult": "Adult dosing",
    "pediatric": "Pediatric dosing (if applicable)"
  },
  "sideEffects": {
    "common": ["Common side effect 1", "Common side effect 2"],
    "serious": ["Serious side effect 1", "Serious side effect 2"]
  },
  "contraindications": [
    "Contraindication 1",
    "Contraindication 2"
  ],
  "interactions": [
    "Drug interaction 1",
    "Drug interaction 2"
  ],
  "warnings": [
    "Important warning 1",
    "Important warning 2"
  ],
  "disclaimer": "This information is for educational purposes only. Consult healthcare providers for medical advice."
}

Return ONLY valid JSON, no additional text.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*$/g, '');
      text = text.replace(/^\s*```json/g, '');
      
      try {
        return JSON.parse(text);
      } catch {
        return this.parseStructuredMedicationResponse(text, medicationName);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get medication information');
    }
  }

  // ✅ DISCHARGE PLANNING CHAT
  async chatDischarge(question, patientContext = {}) {
    const prompt = `
You are a discharge planning specialist AI assistant. Answer the following question about discharge planning:

Question: ${question}

Patient Context:
- Condition: ${patientContext.condition || 'Not specified'}
- Age: ${patientContext.age || 'Not specified'}
- Medications: ${JSON.stringify(patientContext.medications) || 'Not specified'}

Provide a helpful response in JSON format:
{
  "response": "Detailed response to the question",
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "resources": [
    "Resource 1",
    "Resource 2"
  ],
  "followUp": "Follow-up instructions",
  "urgency": "Low",
  "disclaimer": "This information is for guidance only. Follow your healthcare provider's specific instructions."
}

Return ONLY valid JSON, no additional text.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*$/g, '');
      text = text.replace(/^\s*```json/g, '');
      
      try {
        return JSON.parse(text);
      } catch {
        return this.parseStructuredChatResponse(text, question);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to process discharge chat');
    }
  }

  // ✅ IMPROVED FALLBACK PARSERS

  // Fallback parser for symptoms - improved with JSON extraction
  parseStructuredResponse(text) {
    console.log('Using symptom fallback parser for:', text.substring(0, 100));
    
    // Try to extract JSON from mixed content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extracted = JSON.parse(jsonMatch[0]);
        // Ensure confidence values are numbers
        if (extracted.possibleConditions) {
          extracted.possibleConditions = extracted.possibleConditions.map(condition => ({
            ...condition,
            confidence: typeof condition.confidence === 'string' 
              ? parseInt(condition.confidence) 
              : condition.confidence
          }));
        }
        console.log('Extracted JSON from symptom fallback:', extracted);
        return extracted;
      } catch (error) {
        console.log('Failed to parse extracted symptom JSON:', error);
      }
    }

    // If all else fails, create structured response from text
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      possibleConditions: [
        {
          condition: "Analysis from AI response",
          confidence: 6,
          description: lines.slice(0, 3).join(' ').substring(0, 200),
          urgency: "Medium"
        }
      ],
      recommendedActions: [
        "Consult with healthcare provider",
        "Monitor symptoms closely",
        "Seek immediate care if symptoms worsen"
      ],
      urgencyLevel: "Medium",
      additionalQuestions: [
        "How long have you had these symptoms?",
        "Are symptoms getting worse or better?",
        "Do you have any known allergies?"
      ],
      disclaimer: "This AI analysis is for informational purposes only. Always consult with healthcare professionals for medical advice."
    };
  }

  // Fallback parser for documents - improved with JSON extraction
  parseStructuredDocumentResponse(text, documentType) {
    console.log('Using document fallback parser for:', text.substring(0, 100));
    
    // Try to extract JSON from mixed content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extracted = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON from document fallback:', extracted);
        return extracted;
      } catch (error) {
        console.log('Failed to parse extracted document JSON:', error);
      }
    }

    // Extract key information from text if JSON fails
    const lines = text.split('\n').filter(line => line.trim());
    
    // Try to find summary in the response
    const summaryMatch = text.match(/"summary":\s*"([^"]+)"/);
    const summary = summaryMatch ? summaryMatch[1] : lines.slice(0, 2).join(' ').substring(0, 200);
    
    return {
      documentType: documentType,
      summary: summary,
      keyFindings: [
        "Document analysis completed with parsing issues",
        "Key medical information detected",
        "Manual review recommended for complete assessment"
      ],
      abnormalValues: [
        {
          parameter: "Analysis Status",
          value: "Partial parsing successful",
          normalRange: "Complete structured parsing",
          significance: "Some data may require manual interpretation"
        }
      ],
      recommendations: [
        "Review original document manually for complete details",
        "Consult with healthcare provider for professional interpretation",
        "Consider document quality and formatting for optimal AI analysis"
      ],
      urgency: "Medium",
      followUpRequired: true,
      disclaimer: "This AI analysis encountered parsing challenges and requires medical professional review for completeness."
    };
  }

  // Fallback parser for radiology reports
  parseStructuredRadiologyResponse(text) {
    console.log('Using radiology fallback parser');
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log('Failed to parse extracted radiology JSON:', error);
      }
    }

    return {
      reportType: "Radiology Report",
      technique: "Standard imaging protocol",
      findings: [
        "Image analysis completed",
        "Detailed findings require radiologist interpretation"
      ],
      impression: "AI analysis suggests further professional review required",
      recommendations: [
        "Radiologist review and approval required",
        "Correlate with clinical findings",
        "Follow institutional reporting guidelines"
      ],
      urgency: "Medium",
      followUp: "Standard radiologist review and sign-off required",
      disclaimer: "This AI-generated report is preliminary and requires formal radiologist review and approval before clinical use."
    };
  }

  // Fallback parser for medication information
  parseStructuredMedicationResponse(text, medicationName) {
    console.log('Using medication fallback parser');
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log('Failed to parse extracted medication JSON:', error);
      }
    }

    return {
      medicationName: medicationName,
      genericName: "Consult prescribing information",
      drugClass: "Consult prescribing information",
      indications: ["Consult healthcare provider for specific indications"],
      dosage: {
        adult: "Consult prescribing information or healthcare provider",
        pediatric: "Consult prescribing information or healthcare provider"
      },
      sideEffects: {
        common: ["Consult prescribing information"],
        serious: ["Consult prescribing information"]
      },
      contraindications: ["Consult prescribing information"],
      interactions: ["Consult prescribing information"],
      warnings: ["Consult prescribing information and healthcare provider"],
      disclaimer: "This information is incomplete due to parsing issues. Always consult healthcare providers and official prescribing information for complete medication details."
    };
  }

  // Fallback parser for discharge chat
  parseStructuredChatResponse(text, question) {
    console.log('Using chat fallback parser');
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log('Failed to parse extracted chat JSON:', error);
      }
    }

    return {
      response: text.substring(0, 300) || "I understand your question about discharge planning. Due to technical issues, I recommend speaking directly with your healthcare team for specific guidance.",
      recommendations: [
        "Consult with your discharge coordinator",
        "Review written discharge instructions carefully",
        "Contact your healthcare team with specific questions"
      ],
      resources: [
        "Hospital discharge planning department",
        "Primary care physician office",
        "Pharmacy for medication questions"
      ],
      followUp: "Follow your healthcare provider's specific discharge instructions",
      urgency: "Medium",
      disclaimer: "This information is for general guidance only. Always follow your healthcare provider's specific discharge instructions and contact them with any concerns."
    };
  }
}

export default new GeminiService();