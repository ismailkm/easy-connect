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

import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.Translator
import com.google.mlkit.nl.translate.TranslatorOptions
import com.google.android.gms.tasks.Tasks
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.Arguments
import kotlinx.coroutines.*
import com.google.mlkit.common.model.DownloadConditions;

class GemmaModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GemmaModule"
    private val modelName = "gemma3-1B-it-int4.task"
    private var llmInference: LlmInference? = null

    private val translators = mutableMapOf<String, Translator>()
    private val coroutineScope = CoroutineScope(Dispatchers.IO)

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

    @ReactMethod
    fun translateBatch(lines: ReadableArray, targetLang: String, promise: Promise) {
        if (targetLang != "dari") {
            promise.reject("LANG_ERROR", "Currently, only Dari is supported.")
            return
        }

        // --- 1. Define Translator Options ---
        val options = TranslatorOptions.Builder()
            .setSourceLanguage(TranslateLanguage.ENGLISH)
            .setTargetLanguage(TranslateLanguage.PERSIAN)
            .build()
        val translator = Translation.getClient(options)

        // --- 2. Create Download Conditions ---
        val conditions = DownloadConditions.Builder().build()

        // --- 3. Download the Model IF NEEDED ---
        translator.downloadModelIfNeeded(conditions)
            .addOnSuccessListener {
                Log.d("GemmaModule", "ML Kit Dari model is ready.")
                // --- 4. Once the model is ready, start the translation ---
                
                // We use Kotlin Coroutines to handle the list of async tasks cleanly.
                coroutineScope.launch {
                    val englishLines = lines.toArrayList().map { it.toString() }
                    try {
                        val translatedLines = englishLines.map { line ->
                            // Tasks.await() makes the code sequential and easier to debug
                            Tasks.await(translator.translate(line))
                        }

                        // Switch back to the main thread to resolve the promise
                        withContext(Dispatchers.Main) {
                            val writableArray = Arguments.createArray()
                            translatedLines.forEach { translatedLine ->
                                writableArray.pushString(translatedLine)
                            }
                            promise.resolve(writableArray)
                        }
                    } catch (e: Exception) {
                        // Handle errors during the actual translation
                        withContext(Dispatchers.Main) {
                            promise.reject("TRANSLATE_ERROR", "Failed to translate line: ${e.message}", e)
                        }
                    }
                }
            }
            .addOnFailureListener { e ->
                Log.e("GemmaModule", "ML Kit model download failed", e)
                promise.reject("MODEL_DOWNLOAD_ERROR", "Failed to download translation model: ${e.message}", e)
            }
    }

    override fun onCatalystInstanceDestroy() {
        translators.values.forEach { it.close() }
        coroutineScope.cancel()
    }
}