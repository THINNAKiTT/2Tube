import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
};
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const { POST } = serve(
  async (context) => {
    const utapi = new UTApi();
    const input = context.requestPayload as InputType;
    const { videoId, userId, prompt } = input;

    const video = await context.run("get-video", async () => {
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(
          eq(videos.id, videoId),
          eq(videos.userId, userId)
        ));
      
      if (!existingVideo) {
        throw new Error("Not found");
      }
      
      return existingVideo;
    })

    const generateImageWithImagen = async (prompt: string) => {
      
      // required credit card
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",  
        prompt: prompt,                  
        config: {
            aspectRatio: "16:9",
            outputMimeType: "image/png",
            numberOfImages: 1, 
          },   
      });

      const generatedImage = response.generatedImages?.[0];
      const base64ImageBytes = generatedImage?.image?.imageBytes; 
      
      const thumbnailUrl = `data:image/png;base64,${base64ImageBytes}`; 
      
      return thumbnailUrl;
    }
    
    const tempThumbnailUrl = await generateImageWithImagen(prompt);

    await context.run("cleanup-thumbnail", async () => {
      if (video.thumbnailKey) {
        await utapi.deleteFiles(video.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(
            eq(videos.id, videoId),
            eq(videos.userId, userId)
          ));
      }
    });

    const uploadedThumbnail = await context.run("uploaded-thumbnail", async () => {
      const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

      if (!data) {
        throw new Error("Bad request");
      }

      return data;
    })

    
    await context.run("update-video", async () => {
      await db
        .update(videos)
        .set({
          thumbnailKey: uploadedThumbnail.key,
          thumbnailUrl: uploadedThumbnail.url,
        })
        .where(and(
          eq(videos.id, video.id),
          eq(videos.userId, video.userId)
        ))
    })
  }
)