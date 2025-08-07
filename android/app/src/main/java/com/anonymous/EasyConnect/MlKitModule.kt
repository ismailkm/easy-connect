package com.anonymous.EasyConnect

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.Translator
import com.google.mlkit.nl.translate.TranslatorOptions
import com.google.android.gms.tasks.Tasks
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.Arguments
import kotlinx.coroutines.*
import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import android.net.Uri

class MlKitModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MlKitModule"

    private val translators = mutableMapOf<String, Translator>()
    private val coroutineScope = CoroutineScope(Dispatchers.IO)

    @ReactMethod
    fun translateBatch(lines: ReadableArray, sourceLang: String, targetLang: String, promise: Promise) {
        val sourceLanguageCode = when (sourceLang) {
            "dari" -> TranslateLanguage.PERSIAN
            else -> TranslateLanguage.ENGLISH
        }
        val targetLanguageCode = when (targetLang) {
            "dari" -> TranslateLanguage.PERSIAN
            else -> TranslateLanguage.ENGLISH
        }
        val options = TranslatorOptions.Builder()
            .setSourceLanguage(sourceLanguageCode)
            .setTargetLanguage(targetLanguageCode)
            .build()
        val translator = Translation.getClient(options)
        val conditions = DownloadConditions.Builder().build()
        translator.downloadModelIfNeeded(conditions)
            .addOnSuccessListener {
                Log.d("MlKitModule", "ML Kit model is ready.")
                coroutineScope.launch {
                    val englishLines = lines.toArrayList().map { it.toString() }
                    try {
                        val translatedLines = englishLines.map { line ->
                            Tasks.await(translator.translate(line))
                        }
                        withContext(Dispatchers.Main) {
                            val writableArray = Arguments.createArray()
                            translatedLines.forEach { translatedLine ->
                                writableArray.pushString(translatedLine)
                            }
                            promise.resolve(writableArray)
                        }
                    } catch (e: Exception) {
                        withContext(Dispatchers.Main) {
                            promise.reject("TRANSLATE_ERROR", "Failed to translate line: ${e.message}", e)
                        }
                    }
                }
            }
            .addOnFailureListener { e ->
                Log.e("MlKitModule", "ML Kit model download failed", e)
                promise.reject("MODEL_DOWNLOAD_ERROR", "Failed to download translation model: ${e.message}", e)
            }
    }

    @ReactMethod
    fun recognizeTextFromImage(imageUri: String, promise: Promise) {
        Log.d("MlKitModule", "Received image for OCR: $imageUri")
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        val image: InputImage
        try {
            val uri = Uri.parse(imageUri)
            image = InputImage.fromFilePath(reactContext, uri)
        } catch (e: Exception) {
            Log.e("MlKitModule", "Failed to create InputImage from URI", e)
            promise.reject("OCR_IMAGE_ERROR", "Could not read the image file from the URI.", e)
            return
        }
        recognizer.process(image)
            .addOnSuccessListener { visionText ->
                val blockArray = Arguments.createArray()
                for (block in visionText.textBlocks) {
                    blockArray.pushString(block.text)
                }
                Log.d("MlKitModule", "OCR successful. Found ${blockArray.size()} blocks.")
                promise.resolve(blockArray)
            }
            .addOnFailureListener { e ->
                Log.e("MlKitModule", "OCR failed.", e)
                promise.reject("OCR_PROCESS_ERROR", "Failed to recognize text.", e)
            }
    }

    @ReactMethod
    fun prepareDariTranslator(promise: Promise) {
        Log.d("MlKitModule", "Proactively preparing Dari translator...")

        val options = TranslatorOptions.Builder()
            .setSourceLanguage(TranslateLanguage.ENGLISH)
            .setTargetLanguage(TranslateLanguage.PERSIAN)
            .build()
        val translator = Translation.getClient(options)

        val conditions = DownloadConditions.Builder().build()

        translator.downloadModelIfNeeded(conditions)
            .addOnSuccessListener {
                Log.d("MlKitModule", "Dari translation model is ready.")
                promise.resolve("Dari model is ready.")
            }
            .addOnFailureListener { e ->
                Log.e("MlKitModule", "Dari model download failed.", e)
                promise.reject("MODEL_DOWNLOAD_ERROR", "Could not prepare Dari model: ${e.message}", e)
            }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        translators.values.forEach { it.close() }
        translators.clear()
        coroutineScope.cancel()
        Log.d("MlKitModule", "ML Kit resources cleaned up.")
    }
}