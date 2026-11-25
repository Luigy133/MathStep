from kokoro import KPipeline
import soundfile as sf
import os

print("--- Starting standalone Kokoro test ---")

# Configuration
text = "Hola, esto es una prueba final de Kokoro"
voice = "af_bella"
lang_code = "e"
output_path = "test_output.wav"

print(f"Initializing KPipeline(lang_code='{lang_code}', repo_id='hexgrad/Kokoro-82M')...")
try:
    pipeline = KPipeline(lang_code=lang_code, repo_id='hexgrad/Kokoro-82M')
    print("KPipeline initialized.")

    print(f"Generating audio for: '{text}'")
    print(f"Using voice: {voice}")

    generator = pipeline(text, voice=voice, speed=1.0)
    print(f"Pipeline called, generator: {generator}")

    audio_written = False
    for i, (gs, ps, audio) in enumerate(generator):
        print(f"Generator yielded chunk {i}, shape: {audio.shape}")
        sf.write(output_path, audio, 24000)
        audio_written = True
        print(f"Successfully wrote audio to {output_path}")
        break

    if audio_written:
        print("--- Test successful! ---")
    else:
        print("--- Test failed: No audio produced. ---")

except Exception as e:
    print(f"--- Test failed with error: ---")
    import traceback
    traceback.print_exc()




