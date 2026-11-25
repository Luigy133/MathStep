from manim import *
from plantillas.plantilla_base import BaseMathStep, Estilo

# Helper mejorado para crear potencias alineadas
def crear_potencia(base_str, exp_str, color, font_size=44):
    base_txt = Estilo.texto(base_str, font_size=font_size, color=color, weight=BOLD)
    exp_txt = Estilo.texto(exp_str, font_size=int(font_size*0.6), color=color, weight=BOLD)
    # Posicionamos el exponente relativo a la base de forma manual para evitar solapamientos
    exp_txt.next_to(base_txt, UR, buff=-0.1 * (font_size / 44))
    return VGroup(base_txt, exp_txt)

class Escena5Propiedades(BaseMathStep):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Propiedades de las Potencias", "📐")
        self.add(base)

        # FASE 1: POTENCIA CON EXPONENTE 0
        titulo1 = Estilo.texto("Potencia con exponente 0", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        eq1 = VGroup(crear_potencia("X", "0", Estilo.AZUL_OSCURO), Estilo.texto("=", 44), Estilo.texto("1", 44, color=Estilo.COLOR_POSITIVO))
        eq1.arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(UP * 1.0)
        
        ej1 = VGroup(crear_potencia("5", "0", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), Estilo.texto("1", 32, color=Estilo.COLOR_POSITIVO))
        ej1.arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Cualquier número elevado a cero es igual a uno."):
            self.play(Write(titulo1), Write(eq1), run_time=1.5)
            self.play(Write(ej1), run_time=1.0)
            self.wait(2.0)
        self.play(FadeOut(titulo1), FadeOut(eq1), FadeOut(ej1), run_time=0.8)

        # FASE 2: POTENCIA CON EXPONENTE 1
        titulo2 = Estilo.texto("Potencia con exponente 1", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        eq2 = VGroup(crear_potencia("X", "1", Estilo.AZUL_OSCURO), Estilo.texto("=", 44), Estilo.texto("X", 44, color=Estilo.COLOR_POSITIVO))
        eq2.arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(UP * 1.0)
        
        ej2 = VGroup(crear_potencia("9", "1", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), Estilo.texto("9", 32, color=Estilo.COLOR_POSITIVO))
        ej2.arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Cualquier número elevado a la unidad, da como resultado ese mismo número."):
            self.play(Write(titulo2), Write(eq2), run_time=1.5)
            self.play(Write(ej2), run_time=1.0)
            self.wait(2.0)
        self.play(FadeOut(titulo2), FadeOut(eq2), FadeOut(ej2), run_time=0.8)

        # FASE 3: PRODUCTO DE POTENCIAS
        titulo3 = Estilo.texto("Producto de Potencias con la misma base", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        eq3 = VGroup(crear_potencia("X", "n", Estilo.AZUL_OSCURO), Estilo.texto("×", 44), crear_potencia("X", "m", Estilo.AZUL_OSCURO), Estilo.texto("=", 44), crear_potencia("X", "n+m", Estilo.COLOR_POSITIVO))
        eq3.arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.0)
        
        ej3 = VGroup(crear_potencia("3", "2", Estilo.AZUL_OSCURO, 32), Estilo.texto("×", 32), crear_potencia("3", "3", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), crear_potencia("3", "2+3", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), crear_potencia("3", "5", Estilo.AZUL_OSCURO, 32))
        ej3.arrange(RIGHT, buff=0.2, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Al multiplicar potencias con la misma base, los exponentes se suman."):
            self.play(Write(titulo3), Write(eq3), Write(ej3), run_time=2.5)
            self.wait(2.0)
        self.play(FadeOut(titulo3), FadeOut(eq3), FadeOut(ej3), run_time=0.8)

        # FASE 4: DIVISIÓN DE POTENCIAS
        titulo4 = Estilo.texto("División de Potencias con la misma base", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        eq4 = VGroup(crear_potencia("X", "a", Estilo.AZUL_OSCURO), Estilo.texto("÷", 44), crear_potencia("X", "b", Estilo.AZUL_OSCURO), Estilo.texto("=", 44), crear_potencia("X", "a-b", Estilo.COLOR_POSITIVO))
        eq4.arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.0)

        ej4 = VGroup(crear_potencia("2", "6", Estilo.AZUL_OSCURO, 32), Estilo.texto("÷", 32), crear_potencia("2", "4", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), crear_potencia("2", "6-4", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), crear_potencia("2", "2", Estilo.AZUL_OSCURO, 32))
        ej4.arrange(RIGHT, buff=0.2, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("En la división de potencias con la misma base, los exponentes se restan."):
            self.play(Write(titulo4), Write(eq4), Write(ej4), run_time=2.5)
            self.wait(2.0)
        self.play(FadeOut(titulo4), FadeOut(eq4), FadeOut(ej4), run_time=0.8)

        # FASE 5: POTENCIA DE UNA POTENCIA
        titulo5 = Estilo.texto("Potencia de una Potencia", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        # (X^n)^m = X^(n*m)
        eq5 = VGroup(Estilo.texto("(", 44), crear_potencia("X", "n", Estilo.AZUL_OSCURO), Estilo.texto(")", 44), Estilo.texto("m", 28), Estilo.texto("=", 44), crear_potencia("X", "n×m", Estilo.COLOR_POSITIVO))
        # Ajuste manual para el exponente 'm' fuera del paréntesis
        eq5[3].next_to(eq5[2], UR, buff=-0.1)
        eq5.arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.0)
        
        ej5 = VGroup(Estilo.texto("(", 32), crear_potencia("2", "2", Estilo.AZUL_OSCURO, 32), Estilo.texto(")", 32), Estilo.texto("3", 20), Estilo.texto("=", 32), crear_potencia("2", "2×3", Estilo.AZUL_OSCURO, 32), Estilo.texto("=", 32), crear_potencia("2", "6", Estilo.AZUL_OSCURO, 32))
        ej5[3].next_to(ej5[2], UR, buff=-0.1)
        ej5.arrange(RIGHT, buff=0.2, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Una potencia elevada a otra potencia es igual a la base elevada al producto de los exponentes."):
            self.play(Write(titulo5), Write(eq5), Write(ej5), run_time=2.5)
            self.wait(3.0)
