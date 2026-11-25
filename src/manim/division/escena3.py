from manim import *
from manim_voiceover import VoiceoverScene
from edge_tts_wrapper import EdgeTTSService

class Estilo:
    FONDO = "#EFF6FF"            
    AZUL_HEADER = "#3B82F6"
    AZUL_TEXTO = "#1D4ED8"
    AZUL_OSCURO = "#1E3A8A"
    COLOR_POSITIVO = "#2563EB"     
    COLOR_NEGATIVO = "#DC2626"     
    GRIS_TEXTO = "#4B5563"
    FUENTE_FAMILIA = "Arial"

    @staticmethod
    def texto(contenido: str, font_size: float = 24, color=None, weight=NORMAL, **kwargs) -> Text:
        col = color if color is not None else Estilo.AZUL_OSCURO
        escala = font_size / 64.0
        return Text(contenido, font=Estilo.FUENTE_FAMILIA, font_size=64, color=col, weight=weight, **kwargs).scale(escala)

class PruebaEscena3(VoiceoverScene):
    def construct(self):
        self.camera.background_color = Estilo.FONDO
        self.set_speech_service(EdgeTTSService(voice="es-MX-JorgeNeural"))

        # --- 1. Tarjeta y Header ---
        tarjeta = RoundedRectangle(width=13.0, height=7.2, corner_radius=0.4, fill_color=WHITE, fill_opacity=1.0, stroke_color="#DBEAFE", stroke_width=2).move_to(ORIGIN)
        header = RoundedRectangle(width=13.0, height=1.25, corner_radius=0.4, fill_color=Estilo.AZUL_HEADER, fill_opacity=1.0, stroke_width=0).move_to(tarjeta.get_top() + DOWN * 0.625)
        contenido_header = VGroup(
            Estilo.texto("➗", font_size=32),
            Estilo.texto("Elementos de una División", font_size=28, color=WHITE, weight=BOLD)
        ).arrange(RIGHT, buff=0.25).move_to(header.get_center())
        self.add(tarjeta, header, contenido_header)

        # =====================================================================
        # FASE 1: LOS ELEMENTOS Y SUS NOMBRES
        # =====================================================================
        num_12 = Estilo.texto("12", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        signo_div = Estilo.texto("÷", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        num_4 = Estilo.texto("4", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        signo_igual = Estilo.texto("=", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        num_3 = Estilo.texto("3", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        
        ecuacion = VGroup(num_12, signo_div, num_4, signo_igual, num_3).arrange(RIGHT, buff=0.4).move_to(UP * 1.2)
        
        with self.voiceover(text="Primero, conozcamos los elementos de una división. Tomemos como ejemplo doce dividido entre cuatro, que es igual a tres."):
            self.play(Write(ecuacion), run_time=2.0)
            self.wait(0.5)

        # Flechas y nombres
        flecha_div = Arrow(start=num_12.get_center() + DOWN * 1.2, end=num_12.get_center() + DOWN * 0.4, buff=0, color=Estilo.COLOR_POSITIVO, stroke_width=4)
        txt_div = Estilo.texto("Dividendo", font_size=24, color=Estilo.COLOR_POSITIVO).next_to(flecha_div, DOWN, buff=0.1)
        
        flecha_divisor = Arrow(start=num_4.get_center() + DOWN * 1.2, end=num_4.get_center() + DOWN * 0.4, buff=0, color=Estilo.COLOR_NEGATIVO, stroke_width=4)
        txt_divisor = Estilo.texto("Divisor", font_size=24, color=Estilo.COLOR_NEGATIVO).next_to(flecha_divisor, DOWN, buff=0.1)

        flecha_cociente = Arrow(start=num_3.get_center() + DOWN * 1.2, end=num_3.get_center() + DOWN * 0.4, buff=0, color="#F59E0B", stroke_width=4)
        txt_cociente = Estilo.texto("Cociente", font_size=24, color="#F59E0B").next_to(flecha_cociente, DOWN, buff=0.1)
        
        txt_resto = Estilo.texto("Resto = 0", font_size=24, color=Estilo.GRIS_TEXTO).next_to(ecuacion, RIGHT, buff=0.8)

        # Narración dividida para ajustar timing
        with self.voiceover(text="El Dividendo es la cantidad total a repartir."):
            self.play(GrowArrow(flecha_div), FadeIn(txt_div), run_time=1.0)
        with self.voiceover(text="El Divisor indica en cuántas partes lo repartimos."):
            self.play(GrowArrow(flecha_divisor), FadeIn(txt_divisor), run_time=1.0)
        with self.voiceover(text="El Cociente es el resultado."):
            self.play(GrowArrow(flecha_cociente), FadeIn(txt_cociente), run_time=1.0)
        with self.voiceover(text="Y el Resto es lo que sobra, que en los enteros es cero."):
            self.play(FadeIn(txt_resto), run_time=1.0)
            self.wait(1)

        # =====================================================================
        # FASE 2: LAS FORMAS DE DENOTAR LA DIVISIÓN
        # =====================================================================
        grupo_fase1 = VGroup(flecha_div, txt_div, flecha_divisor, txt_divisor, flecha_cociente, txt_cociente, txt_resto)
        
        titulo_signos = Estilo.texto("Formas de denotar la división", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).next_to(ecuacion, DOWN, buff=1.0)
        
        with self.voiceover(text="Ahora, ¿cómo podemos escribir la división? Tenemos tres formas principales."):
            self.play(FadeOut(grupo_fase1), FadeIn(titulo_signos), run_time=1)
            self.wait(0.5)

        # Forma 1: ÷
        with self.voiceover(text="La primera es usando el signo óbelo, que es este símbolo de dividir."):
            self.play(Indicate(signo_div, color=YELLOW), run_time=1.5)
            
        # Forma 2: / (Barra inclinada)
        barra_inclinada = Estilo.texto("/", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD).move_to(signo_div.get_center())
        with self.voiceover(text="La segunda es usando una barra inclinada, muy común en computación."):
            self.play(Transform(signo_div, barra_inclinada), run_time=1)
            self.wait(0.5)

        # Forma 3: Línea de fracción
        frac_12 = Estilo.texto("12", font_size=40, color=Estilo.AZUL_OSCURO, weight=BOLD)
        frac_4 = Estilo.texto("4", font_size=40, color=Estilo.AZUL_OSCURO, weight=BOLD)
        linea_frac = Line(LEFT * 0.4, RIGHT * 0.4, color=Estilo.AZUL_OSCURO, stroke_width=4)
        
        # Posicionamos la fracción de forma independiente
        fraccion = VGroup(frac_12, linea_frac, frac_4).arrange(DOWN, buff=0.1).move_to(signo_div.get_center())

        with self.voiceover(text="Y la tercera, y más importante en matemáticas avanzadas, es la línea de fracción. Doce sobre cuatro."):
            self.play(
                Transform(signo_div, fraccion),
                FadeOut(num_12),
                FadeOut(num_4),
                run_time=1.5
            )
            self.wait(1)
            
        # Restauramos la ecuación original
        signo_div_final = Estilo.texto("÷", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        num_12_final = Estilo.texto("12", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        num_4_final = Estilo.texto("4", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        
        # Reconstruimos la VGroup primero
        ecuacion_restaurada = VGroup(num_12_final, signo_div_final, num_4_final, signo_igual, num_3).arrange(RIGHT, buff=0.4).move_to(UP * 1.2)
        
        with self.voiceover(text="Pero sin importar cómo la escribamos, el resultado siempre será el mismo: tres."):
            self.play(
                Transform(signo_div, signo_div_final),
                FadeIn(num_12_final),
                FadeIn(num_4_final),
                FadeOut(titulo_signos),
                run_time=1.5
            )
            self.wait(0.5)
            
        # Re-alinear ecuación para siguiente fase
        ecuacion_final = ecuacion_restaurada.copy().move_to(UP * 1.8)
        self.play(Transform(ecuacion_restaurada, ecuacion_final), run_time=1)

        # =====================================================================
        # FASE 3: LA RELACIÓN INVERSA (EFECTO ESPEJO)
        # =====================================================================
        with self.voiceover(text="Y aquí está el secreto mejor guardado: la división es la operación inversa a la multiplicación."):
            # Texto intermedio
            txt_inversa = Estilo.texto("La división es la Operación Inversa a la Multiplicación", font_size=28, color=Estilo.AZUL_TEXTO).move_to(ORIGIN)
            self.play(Write(txt_inversa), run_time=1.5)
            self.wait(3) # Aumentado el tiempo de espera
            self.play(FadeOut(txt_inversa), run_time=0.5)

        # Creamos la ecuación de multiplicación abajo
        mult_4 = Estilo.texto("4", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        mult_signo = Estilo.texto("×", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        mult_3 = Estilo.texto("3", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        mult_igual = Estilo.texto("=", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        mult_12 = Estilo.texto("12", font_size=56, color=Estilo.AZUL_OSCURO, weight=BOLD)
        
        # Ajustamos el buff para más espacio entre elementos
        ecuacion_mult = VGroup(mult_4, mult_signo, mult_3, mult_igual, mult_12).arrange(RIGHT, buff=0.6).move_to(DOWN * 1.8)
        
        # Flecha que conecta ambas (Ajustada para mayor curvatura y posición)
        flecha_espejo = CurvedArrow(
            start_point=num_3.get_bottom() + DOWN * 0.1,
            end_point=mult_3.get_top() + UP * 0.1,
            angle=PI/2, # Cambiado ángulo para mejor curvatura
            color="#F59E0B",
            stroke_width=4
        )
        
        # Posición del texto "Porque" ajustada
        txt_espejo = Estilo.texto("Porque", font_size=20, color=Estilo.GRIS_TEXTO).next_to(flecha_espejo, RIGHT, buff=0.2)

        with self.voiceover(text="Si doce dividido entre cuatro es tres, es porque cuatro multiplicado por tres es doce. ¡Son operaciones inversas!"):
            self.play(Create(flecha_espejo), FadeIn(txt_espejo), run_time=1.5)
            self.play(Write(ecuacion_mult), run_time=1.5)
            self.wait(2)
            
        # Destello final
        with self.voiceover(text="Recuerda siempre esta relación. Te ayudará a comprobar tus divisiones."):
            self.play(Circumscribe(ecuacion_mult, color=YELLOW, run_time=1.5))
            self.wait(1)
