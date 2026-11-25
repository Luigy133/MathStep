from manim_voiceover.services.kokoro import KokoroService

class VideoCompletoMultiplicacion(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        self.set_speech_service(KokoroService(voice="ef_dora", lang="es"))

        # Instanciar y ejecutar cada escena
        scenes = [
            PortadaMultiplicacion(),
            Escena2RepasoRecta(),
            Escena3QueEsMultiplicar(),
            Escena4LeySignosIntro(),
            Escena5SignosIguales(),
            Escena6SignosDiferentes1(),
            Escena7SignosDiferentes2(),
            Escena8MasFactores(),
            Escena9Cierre()
        ]

        for scene in scenes:
            scene.construct()
            # Opcional: añadir pequeña pausa entre escenas
            self.wait(0.5)

