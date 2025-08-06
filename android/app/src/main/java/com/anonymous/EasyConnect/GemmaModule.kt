package com.anonymous.EasyConnect

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import java.io.File
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import com.google.mediapipe.tasks.genai.llminference.LlmInference.LlmInferenceOptions

class GemmaModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GemmaModule"

    private val modelName = "gemma3-1B-it-int4.task"
    private var llmInference: LlmInference? = null
    private var isNativeModelLoaded: Boolean = false

    @ReactMethod
    fun loadModel(promise: Promise) {
        if (isNativeModelLoaded && llmInference != null) {
            Log.d("GemmaModule", "Model already loaded on native side. Skipping reload.")
            promise.resolve("Model '$modelName' already loaded.")
            return
        }
        try {
            Log.d("GemmaModule", "Starting model loading with MediaPipe...")
            val modelFile = File(reactContext.cacheDir, modelName)
            reactContext.assets.open(modelName).use { inputStream ->
                modelFile.outputStream().use { outputStream ->
                    inputStream.copyTo(outputStream)
                }
            }
            Log.d("GemmaModule", "Model copied to cache: ${modelFile.absolutePath}")
            val options = LlmInferenceOptions.builder()
                .setModelPath(modelFile.absolutePath)
                .build()
            llmInference = LlmInference.createFromOptions(reactContext, options)
            isNativeModelLoaded = true
            modelFile.delete()
            Log.d("GemmaModule", "SUCCESS: Model loaded with MediaPipe.")
            promise.resolve("Model '$modelName' loaded successfully with MediaPipe.")
        } catch (e: Exception) {
            isNativeModelLoaded = false
            Log.e("GemmaModule", "FAILURE: An error occurred during MediaPipe model loading.", e)
            promise.reject("MODEL_LOAD_ERROR", "Failed to load model: ${e.message}")
        }
    }

    @ReactMethod
    fun unloadModel(promise: Promise) {
        if (!isNativeModelLoaded || llmInference == null) {
            Log.d("GemmaModule", "Model is not currently loaded. Nothing to unload.")
            promise.resolve("Model was not loaded.")
            return
        }
        try {
            Log.d("GemmaModule", "Unloading and releasing Gemma model...")
            llmInference?.close()
            llmInference = null
            isNativeModelLoaded = false
            Log.d("GemmaModule", "Gemma model successfully unloaded and memory released.")
            promise.resolve("Model successfully unloaded.")
        } catch (e: Exception) {
            Log.e("GemmaModule", "An error occurred while unloading the model.", e)
            llmInference = null
            isNativeModelLoaded = false
            promise.reject("UNLOAD_ERROR", "An error occurred while unloading the model: ${e.message}", e)
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
    
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        llmInference?.close()
        llmInference = null
        isNativeModelLoaded = false
        Log.d("GemmaModule", "LlmInference instance released.")
    }
}