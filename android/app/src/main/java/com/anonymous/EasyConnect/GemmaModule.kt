package com.anonymous.EasyConnect 

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import java.io.File

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

import android.speech.tts.TextToSpeech
import java.util.Locale

import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import android.net.Uri

import android.speech.tts.UtteranceProgressListener
import com.facebook.react.modules.core.DeviceEventManagerModule

class GemmaModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "GemmaModule"

    private val modelName = "gemma3-1B-it-int4.task"
    private var llmInference: LlmInference? = null
    private var isNativeModelLoaded: Boolean = false

    private val translators = mutableMapOf<String, Translator>()
    private val coroutineScope = CoroutineScope(Dispatchers.IO)
    private var textToSpeech: TextToSpeech? = null

    init {
        textToSpeech = TextToSpeech(reactContext) {
            if (it == TextToSpeech.SUCCESS) {
                textToSpeech?.language = Locale.UK
                Log.d("GemmaModule", "TextToSpeech initialized successfully")
                // Set up the listener that will send events back to React Native.
                textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String) {
                        // We can send an event when speech starts
                        sendTtsEvent("tts-start", utteranceId)
                    }

                    override fun onDone(utteranceId: String) {
                        // THIS IS THE EVENT WE NEED: Speech is finished.
                        sendTtsEvent("tts-finish", utteranceId)
                    }

                    override fun onError(utteranceId: String) {
                        // We can also send an event on error
                        sendTtsEvent("tts-error", utteranceId)
                    }
                })
            } else {
                textToSpeech = null
                Log.e("GemmaModule", "TextToSpeech initialization failed")
            }
        }
    }

    private fun sendTtsEvent(eventName: String, utteranceId: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, utteranceId)
    }


    @ReactMethod
    fun loadModel(promise: Promise) {
        if (isNativeModelLoaded && llmInference != null) {
            Log.d("GemmaModule", "Model already loaded on native side. Skipping reload.")
            promise.resolve("Model '$modelName' already loaded.")
            return
        }
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
            isNativeModelLoaded = true // Set to true after successful load

            modelFile.delete()
            Log.d("GemmaModule", "Temporary model file deleted.")

            Log.d("GemmaModule", "SUCCESS: Model loaded with MediaPipe.")
            promise.resolve("Model '$modelName' loaded successfully with MediaPipe.")

        } catch (e: Exception) {
            isNativeModelLoaded = false // Reset on failure
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

    @ReactMethod
    fun speak(text: String, languageCode: String, utteranceId: String,promise: Promise) {
        if (textToSpeech == null) {
            Log.e("GemmaModule", "TextToSpeech not initialized.")
            promise.reject("TTS_ERROR", "TextToSpeech not initialized.")
            return
        }

        val locale = when (languageCode.toLowerCase()) {
            "en" -> Locale.UK
            "fa-ir" -> Locale("ur", "PK") // Farsi/Persian for Iran
            else -> Locale.UK // Default to US English
        }
        
        val result = textToSpeech?.setLanguage(locale)

        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Log.e("GemmaModule", "Language not supported or missing data: $languageCode")
            promise.reject("TTS_ERROR", "Language not supported or missing data: $languageCode")
            return
        }

        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        promise.resolve(true)
    }

    @ReactMethod
    fun recognizeTextFromImage(imageUri: String, promise: Promise) {
        Log.d("GemmaModule", "Received image for OCR: $imageUri")
        
        // --- A. Create the Text Recognizer instance ---
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        
        // --- B. Create an InputImage object from the URI ---
        val image: InputImage
        try {
            val uri = Uri.parse(imageUri)
            image = InputImage.fromFilePath(reactContext, uri)
        } catch (e: Exception) {
            Log.e("GemmaModule", "Failed to create InputImage from URI", e)
            promise.reject("OCR_IMAGE_ERROR", "Could not read the image file from the URI.", e)
            return
        }

        // --- C. Process the image ---
         recognizer.process(image)
            .addOnSuccessListener { visionText ->
                // 1. Create a React Native WritableArray to hold the lines.
                val lineArray = Arguments.createArray()

                // 2. Loop through each TextBlock, and then each Line within the block.
                for (block in visionText.textBlocks) {
                    for (line in block.lines) {
                        // 3. Add the text of each line to our array.
                        lineArray.pushString(line.text)
                    }
                }

                Log.d("GemmaModule", "OCR successful. Found ${lineArray.size()} lines.")
                // 4. Resolve the promise with the array of lines.
                promise.resolve(lineArray)
                // --- END OF NEW LOGIC ---
            }
            .addOnFailureListener { e ->
                Log.d("GemmaModule", "OCR failed.", e)
                promise.reject("OCR_PROCESS_ERROR", "Failed to recognize text.", e)
            }
    }

    @ReactMethod
    fun stopSpeaking(promise: Promise) {
        if (textToSpeech != null) {
            textToSpeech!!.stop()
            Log.d("GemmaModule", "TTS playback stopped by user.")
            promise.resolve(true)
        } else {
            // If TTS isn't ready, there's nothing to stop.
            promise.resolve(false)
        }
    }

    override fun onCatalystInstanceDestroy() {

        super.onCatalystInstanceDestroy()

        Log.d("GemmaModule", "Cleaning up native resources...")

        // --- Clean up Gemma Model ---
        llmInference?.close()
        llmInference = null
        isNativeModelLoaded = false
        Log.d("GemmaModule", "LlmInference instance released.")

        // --- Clean up ML Kit Translators ---
        translators.values.forEach { it.close() }
        translators.clear()
        Log.d("GemmaModule", "ML Kit translators closed.")

        // --- Clean up TTS Engine ---
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        Log.d("GemmaModule", "TextToSpeech engine shut down.")

        // --- Cancel any running coroutines ---
        coroutineScope.cancel()
        Log.d("GemmaModule", "Coroutine scope cancelled.")
    }
}