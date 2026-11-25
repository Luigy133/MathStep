from manim import *
from manim_voiceover import VoiceoverScene
from kokoro_manim_wrapper import KokoroManimService

class PruebaKokoroFinal(VoiceoverScene):
    def construct(self):
        # Usamos nuestro nuevo servicio
        self.set_speech_service(KokoroManimService(voice="af_bella", lang_code="e"))
        
        texto = Text("Hola, esto es una prueba final de Kokoro", font_size=40)
        
        with self.voiceover(text="Hola, esto es una prueba final de Kokoro.") as tracker:
            self.play(Write(texto), run_time=tracker.duration)
            
        self.wait(1)
