from kokoro import KPipeline
import soundfile as sf
import os
from manim_voiceover.services.base import SpeechService

class KokoroManimService(SpeechService):
    def __init__(self, voice="af_bella", lang_code="e", **kwargs):
        super().__init__(**kwargs)
        self.voice = voice
        self.lang_code = lang_code
        print(f"DEBUG: Initializing KPipeline with lang_code={self.lang_code}...")
        self.pipeline = KPipeline(lang_code=self.lang_code)
        print(f"DEBUG: KPipeline initialized.")

    def generate_from_text(self, text, cache_dir=None, path=None):
        target_dir = cache_dir if cache_dir else self.cache_dir
        if path is None:
            path = os.path.join(target_dir, "audio.wav")
        os.makedirs(target_dir, exist_ok=True)
        
        print(f"DEBUG: Generating audio for '{text}' to {path}")
        
        # Ensure voice is a valid string
        print(f"DEBUG: Using voice: {self.voice}")
        
        try:
            # Generate audio using Kokoro
            print(f"DEBUG: Calling pipeline...")
            generator = self.pipeline(text, voice=self.voice, speed=1.0)
            print(f"DEBUG: Pipeline called, generator created: {generator}")
            
            # Save the audio
            audio_written = False
            print(f"DEBUG: Before iterating generator")
            
            # Try to get the first item
            for i, (gs, ps, audio) in enumerate(generator):
                print(f"DEBUG: Generator yielded audio chunk {i}, type: {type(audio)}, shape: {getattr(audio, 'shape', 'no shape')}")
                sf.write(path, audio, 24000)
                audio_written = True
                print(f"DEBUG: sf.write finished for chunk {i}.")
                break # Only need first chunk for test
                
            print(f"DEBUG: Generator iteration finished.")
        except Exception as e:
            print(f"DEBUG: Exception during audio generation/write: {e}")
            import traceback
            traceback.print_exc()
        
        if audio_written and os.path.exists(path):
            print(f"DEBUG: Audio file successfully written to {path}")
        else:
            print(f"DEBUG: Failed to write audio file to {path}. audio_written={audio_written}, exists={os.path.exists(path)}")
        
        # Return the structure expected by manim-voiceover.
        filename = os.path.basename(path)
        return {"input_text": text, "final_audio": filename, "original_audio": filename}
