"use server";

import { z } from "zod";
import { suggestCropsBasedOnLocation as suggestCropsBasedOnLocationFlow } from "@/ai/flows/crop-suggestion-based-on-location";
import { kisanVoiceAssistant as kisanVoiceAssistantFlow } from "@/ai/flows/kisan-voice-assistant";
import { detectCropDisease as detectCropDiseaseFlow } from "@/ai/flows/detect-crop-disease";
import { getWeatherAndIrrigationAlerts as getWeatherAndIrrigationAlertsFlow } from "@/ai/flows/weather-irrigation-alerts";
import { getAgriculturalNews as getAgriculturalNewsFlow } from "@/ai/flows/agricultural-news-feed";
import { predictMarketPrice as predictMarketPriceFlow } from "@/ai/flows/market-price-predictor";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


const detectCropDiseaseSchema = z.object({
  photoDataUri: z.string(),
  language: z.string(),
});

export async function detectCropDisease(formData: FormData) {
  const input = detectCropDiseaseSchema.parse({
    photoDataUri: formData.get("photoDataUri"),
    language: formData.get("language"),
  });
  return await detectCropDiseaseFlow(input);
}


const suggestCropsSchema = z.object({
    country: z.string(),
    region: z.string(),
    season: z.string(),
    weatherDescription: z.string(),
    language: z.string(),
});

export async function suggestCropsBasedOnLocation(formData: FormData) {
    const input = suggestCropsSchema.parse({
        country: formData.get('country'),
        region: formData.get('region'),
        season: formData.get('season'),
        weatherDescription: formData.get('weatherDescription'),
        language: formData.get('language'),
    });
    return await suggestCropsBasedOnLocationFlow(input);
}

const weatherAlertsSchema = z.object({
    village: z.string(),
    cropType: z.string(),
    language: z.string(),
});

export async function getWeatherAndIrrigationAlerts(formData: FormData) {
    const input = weatherAlertsSchema.parse({
        village: formData.get('village'),
        cropType: formData.get('cropType'),
        language: formData.get('language'),
    });
    return await getWeatherAndIrrigationAlertsFlow(input);
}


const kisanAssistantSchema = z.object({
    language: z.string(),
    question: z.string(),
    location: z.string(),
});

export async function kisanVoiceAssistant(formData: FormData) {
    const input = kisanAssistantSchema.parse({
        language: formData.get('language'),
        question: formData.get('question'),
        location: formData.get('location'),
    });
    return await kisanVoiceAssistantFlow(input);
}

const newsFeedSchema = z.object({
    region: z.string(),
    language: z.string(),
});

export async function getAgriculturalNews(formData: FormData) {
    const input = newsFeedSchema.parse({
        region: formData.get('region'),
        language: formData.get('language'),
    });
    return await getAgriculturalNewsFlow(input);
}

const marketPredictorSchema = z.object({
    cropName: z.string(),
    marketName: z.string(),
    language: z.string(),
});

export async function predictMarketPrice(formData: FormData) {
    const input = marketPredictorSchema.parse({
        cropName: formData.get('cropName'),
        marketName: formData.get('marketName'),
        language: formData.get('language'),
    });
    return await predictMarketPriceFlow(input);
}


const applyForSchemeSchema = z.object({
    userId: z.string(),
    schemeId: z.string(),
    schemeName: z.string(),
    farmerName: z.string(),
    landSize: z.string(),
    aadhaarNumber: z.string(),
    bankAccount: z.string().optional(),
    cropType: z.string(),
    address: z.string(),
});

export async function applyForScheme(formData: FormData): Promise<{success: boolean, message: string}> {
    const documentFile = formData.get('document') as File | null;
    
    const rawData = {
        userId: formData.get('userId'),
        schemeId: formData.get('schemeId'),
        schemeName: formData.get('schemeName'),
        farmerName: formData.get('farmerName'),
        landSize: formData.get('landSize'),
        aadhaarNumber: formData.get('aadhaarNumber'),
        bankAccount: formData.get('bankAccount'),
        cropType: formData.get('cropType'),
        address: formData.get('address'),
    };

    if (!rawData.userId) {
        return { success: false, message: 'User not authenticated. Please log in.' };
    }

    const parsed = applyForSchemeSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error("Form validation failed:", parsed.error);
        return { success: false, message: 'Invalid form data provided. Please check all fields.' };
    }

    try {
        let documentUrl = '';
        if (documentFile && documentFile.size > 0) {
            const storageRef = ref(storage, `applications/${parsed.data.userId}/${parsed.data.schemeId}/${Date.now()}-${documentFile.name}`);
            const uploadResult = await uploadBytes(storageRef, documentFile);
            documentUrl = await getDownloadURL(uploadResult.ref);
        }

        await addDoc(collection(db, "applications"), {
            ...parsed.data,
            documentUrl: documentUrl,
            status: 'Pending',
            submittedAt: serverTimestamp(),
        });
        return { success: true, message: 'Application submitted successfully!' };
    } catch (error) {
        console.error("Error submitting application: ", error);
        return { success: false, message: 'Failed to submit application. Please check your network and try again.' };
    }
}
