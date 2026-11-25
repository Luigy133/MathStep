from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.kokoro import KokoroService

class PruebaKokoro(VoiceoverScene):
    def construct(self):
        self.set_speech_service(KokoroService(voice="ef_dora", lang="es"))
        
        texto = Text("Hola, esto es una prueba de Kokoro", font_size=40)
        
        with self.voiceover(text="Hola, esto es una prueba de Kokoro.") as tracker:
            self.play(Write(texto), run_time=tracker.duration)
            
        self.wait(1)
