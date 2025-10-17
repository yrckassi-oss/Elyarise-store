import { GoogleGenAI } from "@google/genai";
import type { OrderDetails } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

export const generateOrderEmailBody = async (cart: OrderDetails[], paymentMethod: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve(`Email generation is disabled. API_KEY is not configured.
        Order Details: ${JSON.stringify(cart, null, 2)}
        Payment Method: ${paymentMethod}`);
    }

    // FIX: Instantiate GoogleGenAI only when API key is available and inside the function call
    // to align with best practices and prevent crashes if key is missing.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const totalAmount = cart.reduce((sum, item) => sum + item.totalAmount, 0);

    const orderSummary = cart.map(item => `
---
  - Type d'opération: ${item.type}
  - Montant partiel: ${item.totalAmount.toLocaleString('fr-FR')} F CFA
  - Détails: ${JSON.stringify(item.details, null, 2)}
  - Informations client associées:
    - Contact Principal: ${item.clientInfo.mainContact}
    ${item.clientInfo.secondaryContact ? `    - Contact Secondaire: ${item.clientInfo.secondaryContact}` : ''}
    ${item.clientInfo.subscriberNumber ? `    - Numéro d'abonné/réabonnement: ${item.clientInfo.subscriberNumber}` : ''}
---
    `).join('\n');


    const prompt = `
        Agis en tant que système de confirmation de commande pour ELYARISE CANAL+ STORE. 
        Rédige un email de confirmation de commande pour yrc.kassi@gmail.com.
        L'email doit être clair, professionnel, bien formaté en HTML et en français.
        L'objet de l'email doit être "Confirmation de votre commande ELYARISE CANAL+ STORE".
        
        Voici le récapitulatif des opérations dans la commande:
        ${orderSummary}
        
        Récapitulatif final:
        - Montant Total Global: ${totalAmount.toLocaleString('fr-FR')} F CFA
        - Moyen de paiement choisi: ${paymentMethod}
        
        Ne génère que le corps de l'email, en commençant par 'Bonjour,' et en terminant par une formule de politesse appropriée.
        Structure bien les informations pour une lecture facile. Liste chaque opération clairement.
        Mets en évidence les informations importantes comme le montant total.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating email content:", error);
        return `Une erreur est survenue lors de la génération de l'email. Voici un récapitulatif de votre commande:\n\n${JSON.stringify(cart, null, 2)}`;
    }
};
