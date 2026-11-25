from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.coqui import CoquiService

class PruebaKokoroCoqui(VoiceoverScene):
    def construct(self):
        # Usamos CoquiService con el modelo de Kokoro
        self.set_speech_service(CoquiService(model_name="kokoro"))
        
        texto = Text("Hola, esto es una prueba de Kokoro con Coqui", font_size=40)
        
        with self.voiceover(text="Hola, esto es una prueba de Kokoro con Coqui.") as tracker:
            self.play(Write(texto), run_time=tracker.duration)
            
        self.wait(1)
