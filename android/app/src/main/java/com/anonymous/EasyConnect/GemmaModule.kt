package com.anonymous.EasyConnect 

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import java.io.File

// V-- We are importing from the NEW MediaPipe library --V
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions

class GemmaModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GemmaModule"
    private val modelName = "Gemma3-1B-IT_multi-prefill-seq_q4_ekv2048.task"
    private var llmInference: LlmInference? = null

    @ReactMethod
    fun loadModel(promise: Promise) {
        try {
            Log.d("GemmaModule", "Starting model loading with MediaPipe...")

            // 1. Copy the model from assets to a temporary cache file (this logic stays the same)
            val modelFile = File(reactContext.cacheDir, modelName)
            reactContext.assets.open(modelName).use { inputStream ->
                modelFile.outputStream().use { outputStream ->
                    inputStream.copyTo(outputStream)
                }
            }
            Log.d("GemmaModule", "Model copied to cache: ${modelFile.absolutePath}")

            // 2. Set up the options using the new MediaPipe builder pattern.
            val options = LlmInferenceOptions.builder()
                .setModelPath(modelFile.absolutePath)
                .build()

            // 3. Create the LlmInference instance from MediaPipe.
            llmInference = LlmInference.createFromOptions(reactContext, options)

            modelFile.delete()
            Log.d("GemmaModule", "Temporary model file deleted.")

            Log.d("GemmaModule", "SUCCESS: Model loaded with MediaPipe.")
            promise.resolve("Model '$modelName' loaded successfully with MediaPipe.")

        } catch (e: Exception) {
            Log.e("GemmaModule", "FAILURE: An error occurred during MediaPipe model loading.", e)
            promise.reject("MODEL_LOAD_ERROR", "Failed to load model: ${e.message}")
        }
    }

    @ReactMethod
    fun generateResponse(prompt: String, promise: Promise) {
        if (llmInference == null) {
            promise.reject("NOT_LOADED", "Model is not loaded. Call loadModel() first.")
            return
        }
        try {
            val response = llmInference!!.generateResponse(prompt)
            promise.resolve(response)
        } catch (e: Exception) {
            promise.reject("INFERENCE_ERROR", "Failed to generate response: ${e.message}")
        }
    }
}