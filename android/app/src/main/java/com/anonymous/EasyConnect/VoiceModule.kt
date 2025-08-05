package com.anonymous.EasyConnect

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import android.speech.tts.TextToSpeech
import java.util.Locale
import android.speech.tts.UtteranceProgressListener
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.facebook.react.bridge.ActivityEventListener

class VoiceModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    override fun getName() = "VoiceModule"

    private var textToSpeech: TextToSpeech? = null
    private var speechPromise: Promise? = null
    private val SPEECH_REQUEST_CODE = 101

    init {
        textToSpeech = TextToSpeech(reactContext) {
            if (it == TextToSpeech.SUCCESS) {
                textToSpeech?.language = Locale.UK
                Log.d("PlatformModule", "TextToSpeech initialized successfully")
                textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String) { sendTtsEvent("tts-start", utteranceId) }
                    override fun onDone(utteranceId: String) { sendTtsEvent("tts-finish", utteranceId) }
                    override fun onError(utteranceId: String) { sendTtsEvent("tts-error", utteranceId) }
                })
            } else {
                textToSpeech = null
                Log.e("PlatformModule", "TextToSpeech initialization failed")
            }
        }
        reactContext.addActivityEventListener(this)
    }

    private fun sendTtsEvent(eventName: String, utteranceId: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, utteranceId)
    }

    @ReactMethod
    fun speak(text: String, languageCode: String, utteranceId: String, promise: Promise) {
        if (textToSpeech == null) {
            promise.reject("TTS_ERROR", "TextToSpeech not initialized.")
            return
        }
        val locale = when (languageCode.toLowerCase()) {
            "en-gb" -> Locale.UK
            "fa-ir" -> Locale("ur", "PK")
            else -> Locale.UK
        }
        val result = textToSpeech?.setLanguage(locale)
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            promise.reject("TTS_ERROR", "Language not supported or missing data: $languageCode")
            return
        }
        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        promise.resolve(true)
    }

    @ReactMethod
    fun stopSpeaking(promise: Promise) {
        textToSpeech?.stop()
        promise.resolve(true)
    }

    @ReactMethod
    fun recognizeSpeech(languageCode: String, promise: Promise) {
        val currentActivity = reactContext.currentActivity
        if (currentActivity == null) {
            promise.reject("ACTIVITY_NULL", "Activity is null.")
            return
        }
        this.speechPromise = promise
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, languageCode)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak now...")
        }
        currentActivity.startActivityForResult(intent, SPEECH_REQUEST_CODE)
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == SPEECH_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                val bestResult = results?.get(0) ?: ""
                this.speechPromise?.resolve(bestResult)
            } else {
                this.speechPromise?.reject("ASR_ERROR", "Speech recognition failed or was canceled.")
            }
            this.speechPromise = null
        }
    }

    override fun onNewIntent(intent: Intent?) {}

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
    }
}