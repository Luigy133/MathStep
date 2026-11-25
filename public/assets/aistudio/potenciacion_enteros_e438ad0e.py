import os
from manim import *
from plantillas.plantilla_base import BaseMathStep, Estilo
from utils.edge_tts_wrapper import EdgeTTSService

# =============================================================================
# ESCENA 1: PORTADA
# =============================================================================
class PortadaPotenciacion(BaseMathStep):
    def construct(self):
        self.configurar_escena()

        def buscar_imagen(nombre_exacto):
            rutas = [
                os.path.join(os.getcwd(), "assets", "images"),
                os.path.join(os.getcwd(), "media", "images"),
                os.getcwd(),
            ]
            exts = (".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".webp")
            for d in rutas:
                if not os.path.isdir(d): continue
                ruta_completa = os.path.join(d, nombre_exacto)
                if os.path.isfile(ruta_completa):
                    return ruta_completa
            return None

        # Fondo degradado
        fondo = self.crear_fondo_degradado()
        self.play(FadeIn(fondo), run_time=0.6)

        # Logo MathStep (buscamos logo.png)
        archivo_logo = buscar_imagen("logo.png")
        if archivo_logo:
            logo_img = ImageMobject(archivo_logo).scale_to_fit_height(1.4)
            logo_mob = logo_img.move_to(UP * 2.5)
        else:
            logo_mob = Estilo.texto("MathStep", font_size=38, color=WHITE, weight=BOLD).move_to(UP * 2.5)

        self.play(FadeIn(logo_mob, shift=DOWN * 0.2), run_time=0.6)

        # Título y Subtítulo
        titulo = Estilo.texto("Potenciación de Enteros", font_size=48, color=WHITE, weight=BOLD).move_to(UP * 0.5)
        subtitulo = Estilo.texto("El poder de los exponentes", font_size=26, color="#FEF08A", weight=BOLD).next_to(titulo, DOWN, buff=0.35)

        # Buscar el lápiz de potenciación
        archivo_lapiz = buscar_imagen("lapiz_potencia.png") # Asegúrate de tener esta imagen
        if archivo_lapiz:
            lapiz_mob = ImageMobject(archivo_lapiz).scale_to_fit_height(2.6).move_to(RIGHT * 4.6 + DOWN * 1.6)
        else:
            lapiz_mob = Estilo.texto("⚡", font_size=120).move_to(RIGHT * 4.6 + DOWN * 1.6)

        # Narración y animación
        voz = "Hola, bienvenido a MathStep. Hoy aprenderemos a resolver potencias con números enteros y entenderemos cómo funcionan los signos con los exponentes."
        with self.hablar(voz):
            self.play(Write(titulo), run_time=1.3)
            self.play(FadeIn(subtitulo, shift=UP * 0.2), run_time=0.8)
            self.play(GrowFromCenter(lapiz_mob), run_time=0.8)
            self.play(lapiz_mob.animate.rotate(0.1), run_time=0.3)
            self.play(lapiz_mob.animate.rotate(-0.1), run_time=0.3)
            self.wait(2.5)

# =============================================================================
# ESCENA 2: ¿QUÉ ES UNA POTENCIA? (Tres Fases)
# =============================================================================
class Escena2QueEsPotencia(BaseMathStep):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("¿Qué es una Potencia?", "🔢")
        self.add(base)

        # =====================================================================
        # FASE 1: ELEMENTOS DE UNA POTENCIA
        # =====================================================================
        titulo1 = Estilo.texto("Elementos de una Potencia", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 1.8)
        self.play(Write(titulo1), run_time=1.0)

        # --- CONSTRUCCIÓN DE LA ECUACIÓN (Agrupando el exponente con la base) ---
        base_num = Estilo.texto("2", font_size=64, color=Estilo.AZUL_OSCURO, weight=BOLD)
        # El exponente se coloca justo encima y a la derecha de la base
        exponente = Estilo.texto("3", font_size=40, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(base_num, UR, buff=0.05)
        
        # Agrupamos base y exponente para que se muevan juntos
        base_y_exp = VGroup(base_num, exponente)
        
        igual = Estilo.texto("=", font_size=64, color=Estilo.AZUL_OSCURO, weight=BOLD)
        resultado = Estilo.texto("8", font_size=64, color=Estilo.AZUL_OSCURO, weight=BOLD)
        
        # Centramos toda la operación en el origen (0,0)
        ecuacion = VGroup(base_y_exp, igual, resultado).arrange(RIGHT, buff=0.6).move_to(ORIGIN)
        
        with self.hablar("Una potencia es una multiplicación abreviada. En la expresión dos al cubo, el dos es la base."):
            self.play(Write(ecuacion), run_time=1.5)
            
            # Flecha para la Base (apunta desde abajo)
            flecha_base = Arrow(start=base_num.get_center() + DOWN * 1.2, end=base_num.get_center() + DOWN * 0.4, buff=0, color=Estilo.COLOR_POSITIVO, stroke_width=4)
            txt_base = Estilo.texto("Base", font_size=24, color=Estilo.COLOR_POSITIVO).next_to(flecha_base, DOWN, buff=0.1)
            self.play(GrowArrow(flecha_base), FadeIn(txt_base), run_time=1.0)
            self.wait(0.5)

        with self.hablar("El tres es el exponente, que indica las veces que se multiplica la base."):
            # Flecha para el Exponente (apunta desde la derecha, para no chocar con el título)
            flecha_exp = Arrow(start=exponente.get_center() + LEFT * 1.5, end=exponente.get_center() + LEFT * 0.3, buff=0, color=Estilo.COLOR_NEGATIVO, stroke_width=4)
            txt_exp = Estilo.texto("Exponente", font_size=24, color=Estilo.COLOR_NEGATIVO).next_to(flecha_exp, LEFT, buff=0.1)
            self.play(GrowArrow(flecha_exp), FadeIn(txt_exp), run_time=1.0)
            self.wait(0.5)

        with self.hablar("Y el ocho es la potencia, el resultado de la operación."):
            # Flecha para el Resultado (apunta desde abajo)
            flecha_res = Arrow(start=resultado.get_center() + DOWN * 1.2, end=resultado.get_center() + DOWN * 0.4, buff=0, color="#F59E0B", stroke_width=4)
            txt_res = Estilo.texto("Potencia", font_size=24, color="#F59E0B").next_to(flecha_res, DOWN, buff=0.1)
            self.play(GrowArrow(flecha_res), FadeIn(txt_res), run_time=1.0)
            self.wait(1.0)

        # Limpieza Fase 1
        self.play(
            FadeOut(titulo1), FadeOut(ecuacion), 
            FadeOut(flecha_base), FadeOut(txt_base), 
            FadeOut(flecha_exp), FadeOut(txt_exp), 
            FadeOut(flecha_res), FadeOut(txt_res), 
            run_time=0.8
        )

        # =====================================================================
        # FASE 2: CÓMO NOMBRAR LAS POTENCIAS
        # =====================================================================
        titulo2 = Estilo.texto("Cómo nombrar las potencias", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 1.8)
        self.play(Write(titulo2), run_time=1.0)

        # Ejemplos de lectura (centrados verticalmente)
        ej1 = Estilo.texto("2²  =  dos elevado al cuadrado", font_size=32, color=Estilo.AZUL_OSCURO).move_to(UP * 0.8)
        ej2 = Estilo.texto("2³  =  dos elevado al cubo", font_size=32, color=Estilo.AZUL_OSCURO).move_to(UP * 0.0)
        ej3 = Estilo.texto("2⁴  =  dos elevado a la cuarta", font_size=32, color=Estilo.AZUL_OSCURO).move_to(DOWN * 0.8)

        with self.hablar("Veamos cómo se nombran las siguientes potencias. Dos al cuadrado, también se dice dos elevado a la dos."):
            self.play(Write(ej1), run_time=1.0)
            self.wait(0.5)
            
        with self.hablar("Dos al cubo, o dos elevado a la tres."):
            self.play(Write(ej2), run_time=1.0)
            self.wait(0.5)
            
        with self.hablar("Y dos elevado a la cuatro."):
            self.play(Write(ej3), run_time=1.0)
            self.wait(1.0)

        # Limpieza Fase 2
        self.play(FadeOut(titulo2), FadeOut(ej1), FadeOut(ej2), FadeOut(ej3), run_time=0.8)

        # =====================================================================
        # FASE 3: MULTIPLICACIÓN REPETIDA Y PARÉNTESIS
        # =====================================================================
        titulo3 = Estilo.texto("La potenciación es una multiplicación repetida", font_size=26, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 1.8)
        self.play(Write(titulo3), run_time=1.0)

        # Desarrollo de 2³
        ecuacion_mult = Estilo.texto("2³ = 2 × 2 × 2 = 8", font_size=40, color=Estilo.AZUL_OSCURO, weight=BOLD).move_to(UP * 0.8)
        
        with self.hablar("Una potencia es una forma abreviada de escribir una multiplicación en la que un mismo número, la base, se multiplica por sí mismo tantas veces como indique el exponente."):
            self.play(Write(ecuacion_mult), run_time=1.5)
            self.wait(0.5)

        with self.hablar("Por lo tanto, dos al cubo es igual a dos por dos por dos, que es igual a ocho."):
            self.wait(1.0)

        # Advertencia de paréntesis
        advertencia = Estilo.texto("Si la base es negativa, siempre debe ir entre paréntesis", font_size=22, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(DOWN * 1.0)
        ejemplo_neg = Estilo.texto("(-2)³", font_size=40, color=Estilo.COLOR_NEGATIVO, weight=BOLD).next_to(advertencia, DOWN, buff=0.3)

        with self.hablar("Recuerda: si la base es negativa, siempre debe ir entre paréntesis."):
            self.play(FadeIn(advertencia, shift=UP * 0.2), run_time=1.0)
            self.play(Write(ejemplo_neg), run_time=1.0)
            self.wait(2.0)

        self.wait(3.0) # Pausa para Kdenlive

# =============================================================================
# ESCENA 3: REGLA DE LOS SIGNOS (TABLA)
# =============================================================================
class Escena3ReglaSignos(BaseMathStep):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Regla de los Signos", "⚖️")
        self.add(base)

        titulo = Estilo.texto("Regla de los Signos en la Potenciación", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP *1.9)
        self.play(Write(titulo), run_time=1.0)

        # Función para crear una fila
        def crear_fila(texto_esquema, texto_ejemplo, color_fondo, color_texto_res):
            # Fondo de la fila
            rect = RoundedRectangle(width=11.5, height=0.8, corner_radius=0.1, fill_color=color_fondo, fill_opacity=1.0, stroke_width=0)
            
            # Texto izquierda
            txt_izq = Estilo.texto(texto_esquema, font_size=20, color=Estilo.AZUL_OSCURO, weight=BOLD).move_to(rect.get_left() + RIGHT * 2.8)
            
            # Texto derecha
            txt_der = Estilo.texto(texto_ejemplo, font_size=20, color=color_texto_res, weight=BOLD).move_to(rect.get_center() + RIGHT * 2.5)
            
            return VGroup(rect, txt_izq, txt_der)

        # Fila 1
        fila1 = crear_fila("Base (+), Exponente Par", "(+2)⁴ = (2)⁴ = 2 × 2 × 2 × 2 = 16", "#D1FAE5", Estilo.COLOR_POSITIVO).move_to(UP * 1.3)
        with self.hablar("Si la base es positiva y el exponente es par, el resultado es positivo: dos a la cuarta es dieciséis."):
            self.play(FadeIn(fila1, shift=UP * 0.2), run_time=1.0)
            self.wait(1)

        # Fila 2
        fila2 = crear_fila("Base (+), Exponente Impar", "(+5)³ = (5)³ = 5 × 5 × 5 = 125", "#D1FAE5", Estilo.COLOR_POSITIVO).move_to(UP * 0.3)
        with self.hablar("Si la base es positiva y el exponente es impar, el resultado también es positivo: cinco al cubo es ciento veinticinco."):
            self.play(FadeIn(fila2, shift=UP * 0.2), run_time=1.0)
            self.wait(1)

        # Fila 3
        fila3 = crear_fila("Base (-), Exponente Par", "(-4)² = (-4) × (-4) = (+16) = 16", "#D1FAE5", Estilo.COLOR_POSITIVO).move_to(DOWN * 0.7)
        with self.hablar("Si la base es negativa y el exponente es par, el resultado es positivo: menos cuatro al cuadrado es dieciséis."):
            self.play(FadeIn(fila3, shift=UP * 0.2), run_time=1.0)
            self.wait(1)

        # Fila 4
        fila4 = crear_fila("Base (-), Exponente Impar", "(-3)³ = (-3) × (-3) × (-3) = -27", "#FEE2E2", Estilo.COLOR_NEGATIVO).move_to(DOWN * 1.7)
        with self.hablar("Pero si la base es negativa y el exponente es impar, el resultado es negativo: menos tres al cubo es menos veintisiete."):
            self.play(FadeIn(fila4, shift=UP * 0.2), run_time=1.0)
            self.wait(1)

        # Tip Final (Corregido)
        tip_rect = RoundedRectangle(width=11.5, height=0.9, corner_radius=0.15, fill_color="#FEF3C7", fill_opacity=1.0, stroke_color="#F59E0B", stroke_width=2).move_to(DOWN * 2.8)
        
        # Icono de bombilla con la fuente correcta para emojis
        bombilla = Text("💡", font="Segoe UI Emoji", font_size=28, color=WHITE)
        
        # Texto del tip
        tip_txt = Estilo.texto("TIP: La única forma de que una potencia sea negativa es si la Base es (-) y el Exponente es Impar.", font_size=16, color="#B45309", weight=BOLD)
        
        # Agrupamos bombilla y texto, y los centramos dentro del recuadro
        grupo_tip = VGroup(bombilla, tip_txt).arrange(RIGHT, buff=0.2).move_to(tip_rect.get_center())

        with self.hablar("Observa: la única forma de que una potencia sea negativa es si la base es negativa y el exponente es impar. En todos los demás casos, la potencia será positiva."):
            self.play(FadeIn(tip_rect, shift=UP * 0.2), run_time=0.8)
            self.play(FadeIn(bombilla, scale=1.2), Write(tip_txt), run_time=1.2)
            self.wait(3.0) # Pausa para Kdenlive

# =============================================================================
# ESCENA 4: EJEMPLOS DE LA REGLA DE LOS SIGNOS (Los 4 Casos)
# =============================================================================
class Escena4EjemplosSignos(BaseMathStep):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Regla de los Signos: Ejemplos", "⚖️")
        self.add(base)

        # Función auxiliar para crear un número con exponente visual
        def crear_potencia(base_str, exp_str, color, font_size=44):
            base_txt = Estilo.texto(base_str, font_size=font_size, color=color, weight=BOLD)
            exp_txt = Estilo.texto(exp_str, font_size=int(font_size*0.6), color=color, weight=BOLD).next_to(base_txt, UR, buff=0.05)
            return VGroup(base_txt, exp_txt)

        # --- EJEMPLO 1: Base Positiva, Exponente Par ---
        titulo1 = Estilo.texto("Ejemplo 1 - Base (+), Exponente Par", font_size=24, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(UP * 2.0)
        
        # Operación visual con exponente
        pot1 = crear_potencia("(2)", "4", Estilo.AZUL_OSCURO)
        igual1 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        incognita1 = Estilo.texto("?", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        operacion1 = VGroup(pot1, igual1, incognita1).arrange(RIGHT, buff=0.4).move_to(UP * 1.0)

        with self.hablar("Ahora vamos a revisar la ley de los signos para la potenciación, caso por caso. Veamos el siguiente ejemplo: dos elevado a la cuatro."):
            self.play(Write(titulo1), run_time=1.0)
            self.play(Write(operacion1), run_time=1.5)
            self.wait(1.0)

        # Regla dinámica
        regla1_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2)
        signo1 = Estilo.texto("+", font_size=40, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla1_txt, RIGHT, buff=0.3)
        
        with self.hablar("Aplicamos la regla: como la base es positiva y el exponente es par, el resultado de la potencia es positivo."):
            self.play(FadeIn(regla1_txt), run_time=1.0)
            self.play(Write(signo1), run_time=0.8)
            self.wait(1.0)

        # Multiplicación repetida
        mult1_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.2)
        mult1_val = Estilo.texto("2 × 2 × 2 × 2 = 16", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult1_txt, DOWN, buff=0.1)
        
        with self.hablar("Multiplicamos dos por dos por dos por dos, que nos da dieciséis."):
            self.play(FadeIn(mult1_txt), Write(mult1_val), run_time=1.5)
            self.wait(1.0)

        # Resultado final
        res1 = Estilo.texto("16", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(incognita1.get_center())
        with self.hablar("Por lo tanto, dos a la cuarta es igual a dieciséis."):
            self.play(Transform(incognita1, res1), run_time=1.0)
            self.wait(2.0)

        # Limpieza
        self.play(FadeOut(titulo1), FadeOut(operacion1), FadeOut(regla1_txt), FadeOut(signo1), FadeOut(mult1_txt), FadeOut(mult1_val), run_time=0.8)

        # --- EJEMPLO 2: Base Negativa, Exponente Par ---
        titulo2 = Estilo.texto("Ejemplo 2 - Base (-), Exponente Par", font_size=24, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(UP * 2.0)
        
        pot2 = crear_potencia("(-5)", "2", Estilo.AZUL_OSCURO)
        igual2 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        incognita2 = Estilo.texto("?", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        operacion2 = VGroup(pot2, igual2, incognita2).arrange(RIGHT, buff=0.4).move_to(UP * 1.0)

        with self.hablar("Observa el ejemplo: menos cinco al cuadrado."):
            self.play(Write(titulo2), run_time=1.0)
            self.play(Write(operacion2), run_time=1.5)
            self.wait(1.0)

        regla2_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2)
        signo2 = Estilo.texto("+", font_size=40, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla2_txt, RIGHT, buff=0.3)

        with self.hablar("Aplicamos la regla: si la base es negativa y el exponente es par, el resultado de la potencia es positivo."):
            self.play(FadeIn(regla2_txt), run_time=1.0)
            self.play(Write(signo2), run_time=0.8)
            self.wait(1.0)

        mult2_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.2)
        mult2_val = Estilo.texto("5 × 5 = 25", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult2_txt, DOWN, buff=0.1)

        with self.hablar("Como cinco por cinco es veinticinco..."):
            self.play(FadeIn(mult2_txt), Write(mult2_val), run_time=1.5)
            self.wait(1.0)

        res2 = Estilo.texto("25", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(incognita2.get_center())
        with self.hablar("...el resultado será menos cinco al cuadrado, igual a veinticinco."):
            self.play(Transform(incognita2, res2), run_time=1.0)
            self.wait(2.0)

        # Limpieza
        self.play(FadeOut(titulo2), FadeOut(operacion2), FadeOut(regla2_txt), FadeOut(signo2), FadeOut(mult2_txt), FadeOut(mult2_val), run_time=0.8)

        # --- EJEMPLO 3: Base Positiva, Exponente Impar ---
        titulo3 = Estilo.texto("Ejemplo 3 - Base (+), Exponente Impar", font_size=24, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(UP * 2.0)
        
        pot3 = crear_potencia("(3)", "3", Estilo.AZUL_OSCURO)
        igual3 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        incognita3 = Estilo.texto("?", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        operacion3 = VGroup(pot3, igual3, incognita3).arrange(RIGHT, buff=0.4).move_to(UP * 1.0)

        with self.hablar("Veamos otro caso: tres elevado al cubo."):
            self.play(Write(titulo3), run_time=1.0)
            self.play(Write(operacion3), run_time=1.5)
            self.wait(1.0)

        regla3_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2)
        signo3 = Estilo.texto("+", font_size=40, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla3_txt, RIGHT, buff=0.3)

        with self.hablar("Aplicamos la regla: como la base es positiva y el exponente es impar, el resultado de la potencia es positivo."):
            self.play(FadeIn(regla3_txt), run_time=1.0)
            self.play(Write(signo3), run_time=0.8)
            self.wait(1.0)

        mult3_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.2)
        mult3_val = Estilo.texto("3 × 3 × 3 = 27", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult3_txt, DOWN, buff=0.1)

        with self.hablar("Tres por tres por tres es veintisiete."):
            self.play(FadeIn(mult3_txt), Write(mult3_val), run_time=1.5)
            self.wait(1.0)

        res3 = Estilo.texto("27", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(incognita3.get_center())
        with self.hablar("Por lo tanto, tres al cubo es igual a veintisiete."):
            self.play(Transform(incognita3, res3), run_time=1.0)
            self.wait(2.0)

        # Limpieza
        self.play(FadeOut(titulo3), FadeOut(operacion3), FadeOut(regla3_txt), FadeOut(signo3), FadeOut(mult3_txt), FadeOut(mult3_val), run_time=0.8)

        # --- EJEMPLO 4: Base Negativa, Exponente Impar ---
        titulo4 = Estilo.texto("Ejemplo 4 - Base (-), Exponente Impar", font_size=24, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(UP * 2.0)
        
        pot4 = crear_potencia("(-4)", "3", Estilo.AZUL_OSCURO)
        igual4 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        incognita4 = Estilo.texto("?", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        operacion4 = VGroup(pot4, igual4, incognita4).arrange(RIGHT, buff=0.4).move_to(UP * 1.0)

        with self.hablar("Y para terminar, el caso donde el resultado es negativo: menos cuatro al cubo."):
            self.play(Write(titulo4), run_time=1.0)
            self.play(Write(operacion4), run_time=1.5)
            self.wait(1.0)

        regla4_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2)
        signo4 = Estilo.texto("-", font_size=40, color=Estilo.COLOR_NEGATIVO, weight=BOLD).next_to(regla4_txt, RIGHT, buff=0.3)

        with self.hablar("Aplicamos la regla: si la base es negativa y el exponente es impar, el resultado de la potencia es negativo."):
            self.play(FadeIn(regla4_txt), run_time=1.0)
            self.play(Write(signo4), run_time=0.8)
            self.wait(1.0)

        mult4_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.2)
        mult4_val = Estilo.texto("4 × 4 × 4 = 64", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult4_txt, DOWN, buff=0.1)

        with self.hablar("Cuatro por cuatro por cuatro es sesenta y cuatro..."):
            self.play(FadeIn(mult4_txt), Write(mult4_val), run_time=1.5)
            self.wait(1.0)

        res4 = Estilo.texto("-64", font_size=44, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(incognita4.get_center())
        with self.hablar("...pero como el signo es negativo, el resultado es menos sesenta y cuatro."):
            self.play(Transform(incognita4, res4), run_time=1.0)
            self.wait(2.0)

        self.wait(2.0) # Pausa para Kdenlivemanim -ql potenciacion_enteros.py Escena4EjemplosSignos 

# =============================================================================
# ESCENA 5: PROPIEDADES DE LAS POTENCIAS (5 Fases)
# =============================================================================
class Escena5Propiedades(BaseMathStep):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Propiedades de las Potencias", "📐")
        self.add(base)

        # Función auxiliar para crear potencias con exponente visual
        def crear_potencia(base_str, exp_str, color, font_size=44):
            base_txt = Estilo.texto(base_str, font_size=font_size, color=color, weight=BOLD)
            exp_txt = Estilo.texto(exp_str, font_size=int(font_size*0.6), color=color, weight=BOLD).next_to(base_txt, UR, buff=0.05)
            return VGroup(base_txt, exp_txt)

        # =====================================================================
        # FASE 1: POTENCIA CON EXPONENTE 0
        # =====================================================================
        titulo1 = Estilo.texto("Potencia con exponente 0", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        pot1 = crear_potencia("X", "0", Estilo.AZUL_OSCURO)
        igual1 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        res1 = Estilo.texto("1", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        formula1 = VGroup(pot1, igual1, res1).arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(UP * 1.0)

        ej1 = Estilo.texto("Ejemplo: 5^0 = 1", font_size=32, color=Estilo.AZUL_OSCURO, weight=BOLD).move_to(DOWN * 0.5)
        # Usamos el método visual para el ejemplo también
        ej1_visual = VGroup(
            crear_potencia("5", "0", Estilo.AZUL_OSCURO, 32),
            Estilo.texto("=", font_size=32, color=Estilo.AZUL_OSCURO, weight=BOLD),
            Estilo.texto("1", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        ).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Cualquier número elevado a cero es igual a uno."):
            self.play(Write(titulo1), run_time=1.0)
            self.play(Write(formula1), run_time=1.5)
            self.play(FadeIn(ej1_visual, shift=UP * 0.2), run_time=1.0)
            self.wait(2.0)

        self.play(FadeOut(titulo1), FadeOut(formula1), FadeOut(ej1_visual), run_time=0.8)

        # =====================================================================
        # FASE 2: POTENCIA CON EXPONENTE 1
        # =====================================================================
        titulo2 = Estilo.texto("Potencia con exponente 1", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        pot2 = crear_potencia("X", "1", Estilo.AZUL_OSCURO)
        igual2 = Estilo.texto("=", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        res2 = Estilo.texto("X", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        formula2 = VGroup(pot2, igual2, res2).arrange(RIGHT, buff=0.4, aligned_edge=DOWN).move_to(UP * 1.0)

        ej2_visual = VGroup(
            crear_potencia("9", "1", Estilo.AZUL_OSCURO, 32),
            Estilo.texto("=", font_size=32, color=Estilo.AZUL_OSCURO, weight=BOLD),
            Estilo.texto("9", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        ).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Cualquier número elevado a la unidad, es decir a uno, da como resultado ese mismo número."):
            self.play(Write(titulo2), run_time=1.0)
            self.play(Write(formula2), run_time=1.5)
            self.play(FadeIn(ej2_visual, shift=UP * 0.2), run_time=1.0)
            self.wait(2.0)

        self.play(FadeOut(titulo2), FadeOut(formula2), FadeOut(ej2_visual), run_time=0.8)

        # =====================================================================
        # FASE 3: PRODUCTO DE POTENCIAS CON LA MISMA BASE
        # =====================================================================
        titulo3 = Estilo.texto("Producto de Potencias con la misma base", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        p1 = crear_potencia("X", "n", Estilo.AZUL_OSCURO, 36)
        signo_mult = Estilo.texto("×", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        p2 = crear_potencia("X", "m", Estilo.AZUL_OSCURO, 36)
        igual3 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        p3 = crear_potencia("X", "n+m", Estilo.COLOR_POSITIVO, 36)
        formula3 = VGroup(p1, signo_mult, p2, igual3, p3).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.2)

        with self.hablar("El producto de dos potencias que tienen la misma base da como resultado otra potencia que tiene la misma base, y su exponente es la suma de los exponentes de ambas potencias."):
            self.play(Write(titulo3), run_time=1.0)
            self.play(Write(formula3), run_time=2.0)
            self.wait(1.0)

        ej3_titulo = Estilo.texto("Ejemplo:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(UP * 0.2)
        
        ep1 = crear_potencia("3", "2", Estilo.AZUL_OSCURO, 36)
        e_mult = Estilo.texto("×", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ep2 = crear_potencia("3", "3", Estilo.AZUL_OSCURO, 36)
        e_igual = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ep3 = crear_potencia("3", "2+3", Estilo.AZUL_OSCURO, 36)
        e_igual2 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ep4 = crear_potencia("3", "5", Estilo.AZUL_OSCURO, 36)
        e_igual3 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ep5 = Estilo.texto("243", font_size=36, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        
        operacion3 = VGroup(ep1, e_mult, ep2, e_igual, ep3, e_igual2, ep4, e_igual3, ep5).arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Veamos el siguiente ejemplo: tres al cuadrado por tres al cubo. Como las bases son iguales, podemos multiplicarlas. El resultado será otra potencia cuya base es la misma, tres, y su exponente será la suma de dos más tres, que es igual a cinco."):
            self.play(Write(ej3_titulo), run_time=0.5)
            self.play(Write(operacion3), FadeOut(ep5), run_time=2.5)
            self.wait(1.0)

        regla3_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.5)
        signo3 = Estilo.texto("+", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla3_txt, RIGHT, buff=0.2)
        
        with self.hablar("Ahora aplicamos la regla de los signos para las potencias: base positiva, exponente impar, el resultado es positivo."):
            self.play(FadeIn(regla3_txt), Write(signo3), run_time=1.5)
            self.wait(0.5)

        mult3_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 2.1)
        mult3_val = Estilo.texto("3 × 3 × 3 × 3 × 3 = 243", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult3_txt, DOWN, buff=0.1)

        with self.hablar("Multiplicamos tres cinco veces y el resultado es doscientos cuarenta y tres."):
            self.play(FadeIn(mult3_txt), Write(mult3_val), FadeIn(ep5), run_time=1.5)
            self.wait(2.0)

        self.play(FadeOut(titulo3), FadeOut(formula3), FadeOut(ej3_titulo), FadeOut(operacion3), FadeOut(regla3_txt), FadeOut(signo3), FadeOut(mult3_txt), FadeOut(mult3_val), run_time=0.8)

        # =====================================================================
        # FASE 4: DIVISIÓN DE POTENCIAS CON LA MISMA BASE
        # =====================================================================
        titulo4 = Estilo.texto("División de Potencias con la misma base", font_size=24, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        d1 = crear_potencia("X", "a", Estilo.AZUL_OSCURO, 36)
        signo_div = Estilo.texto("÷", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        d2 = crear_potencia("X", "b", Estilo.AZUL_OSCURO, 36)
        igual4 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        d3 = crear_potencia("X", "a-b", Estilo.COLOR_POSITIVO, 36)
        formula4 = VGroup(d1, signo_div, d2, igual4, d3).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.2)

        with self.hablar("La división de dos potencias con la misma base da como resultado otra potencia que tiene la misma base, y su exponente es la resta de los exponentes."):
            self.play(Write(titulo4), run_time=1.0)
            self.play(Write(formula4), run_time=2.0)
            self.wait(1.0)

        ej4_titulo = Estilo.texto("Ejemplo:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(UP * 0.2)
        
        ed1 = crear_potencia("2", "6", Estilo.AZUL_OSCURO, 36)
        e_div = Estilo.texto("÷", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ed2 = crear_potencia("2", "4", Estilo.AZUL_OSCURO, 36)
        e_igual4 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ed3 = crear_potencia("2", "6-4", Estilo.AZUL_OSCURO, 36)
        e_igual5 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ed4 = crear_potencia("2", "2", Estilo.AZUL_OSCURO, 36)
        e_igual6 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        ed5 = Estilo.texto("4", font_size=36, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        
        operacion4 = VGroup(ed1, e_div, ed2, e_igual4, ed3, e_igual5, ed4, e_igual6, ed5).arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Veamos el siguiente ejemplo: dos a la sexta dividido entre dos a la cuarta. Como las bases son iguales, podemos dividirlas. El resultado será otra potencia cuya base es la misma, dos, y su exponente será la resta de seis menos cuatro, que es igual a dos."):
            self.play(Write(ej4_titulo), run_time=0.5)
            self.play(Write(operacion4), run_time=2.5)
            self.wait(1.0)

        regla4_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.5)
        signo4 = Estilo.texto("+", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla4_txt, RIGHT, buff=0.2)
        
        with self.hablar("Aplicamos la regla: base positiva, exponente par, el resultado es positivo."):
            self.play(FadeIn(regla4_txt), Write(signo4), run_time=1.5)
            self.wait(0.5)

        mult4_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 2.1)
        mult4_val = Estilo.texto("2 × 2 = 4", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult4_txt, DOWN, buff=0.1)

        with self.hablar("Multiplicamos dos por dos, y el resultado es cuatro."):
            self.play(FadeIn(mult4_txt), Write(mult4_val), run_time=1.5)
            self.wait(2.0)

        self.play(FadeOut(titulo4), FadeOut(formula4), FadeOut(ej4_titulo), FadeOut(operacion4), FadeOut(regla4_txt), FadeOut(signo4), FadeOut(mult4_txt), FadeOut(mult4_val), run_time=0.8)

        # =====================================================================
        # FASE 5: POTENCIA DE UNA POTENCIA
        # =====================================================================
        titulo5 = Estilo.texto("Potencia de una Potencia", font_size=28, color=Estilo.AZUL_TEXTO, weight=BOLD).move_to(UP * 2.0)
        
        # Fórmula general (X^n)^m = X^(n*m)
        p_izq = Estilo.texto("(", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        base5 = crear_potencia("X", "n", Estilo.AZUL_OSCURO, 36)
        p_der = Estilo.texto(")", font_size=44, color=Estilo.AZUL_OSCURO, weight=BOLD)
        exp5 = Estilo.texto("m", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(p_der, UR, buff=0.05)
        grupo_base = VGroup(p_izq, base5, p_der, exp5).arrange(RIGHT, buff=0.0, aligned_edge=DOWN)
        
        igual5 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        res5 = crear_potencia("X", "n×m", Estilo.COLOR_POSITIVO, 36)
        
        formula5 = VGroup(grupo_base, igual5, res5).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 1.2)

        with self.hablar("Una potencia elevada a otra potencia es igual a otra potencia que tiene la misma base, y el exponente es el producto de los exponentes."):
            self.play(Write(titulo5), run_time=1.0)
            self.play(Write(formula5), run_time=2.0)
            self.wait(1.0)

        # Ejemplo: (2^2)^3 = 2^(2*3) = 2^6 = 64
        ej5_titulo = Estilo.texto("Ejemplo:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(UP * 0.2)
        
        p_izq_ej = Estilo.texto("(", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        e_base = crear_potencia("2", "2", Estilo.AZUL_OSCURO, 36)
        p_der_ej = Estilo.texto(")", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        e_exp = Estilo.texto("3", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(p_der_ej, UR, buff=0.05)
        e_grupo = VGroup(p_izq_ej, e_base, p_der_ej, e_exp).arrange(RIGHT, buff=0.0, aligned_edge=DOWN)
        
        e_igual7 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        e_res1 = crear_potencia("2", "2×3", Estilo.AZUL_OSCURO, 36)
        e_igual8 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        e_res2 = crear_potencia("2", "6", Estilo.AZUL_OSCURO, 36)
        e_igual9 = Estilo.texto("=", font_size=36, color=Estilo.AZUL_OSCURO, weight=BOLD)
        e_res3 = Estilo.texto("64", font_size=36, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        
        operacion5 = VGroup(e_grupo, e_igual7, e_res1, e_igual8, e_res2, e_igual9, e_res3).arrange(RIGHT, buff=0.15, aligned_edge=DOWN).move_to(DOWN * 0.5)

        with self.hablar("Veamos un ejemplo: dos al cuadrado, elevado al cubo. Multiplicamos los exponentes: dos por tres es seis, es decir, dos a la sexta. Y dos a la sexta es sesenta y cuatro."):
            self.play(Write(ej5_titulo), run_time=0.5)
            self.play(Write(operacion5), run_time=2.5)
            self.wait(1.0)

        # Aplicamos la regla
        regla5_txt = Estilo.texto("Aplicamos la Regla:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.5)
        signo5 = Estilo.texto("+", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(regla5_txt, RIGHT, buff=0.2)
        
        with self.hablar("Aplicamos la regla: base positiva, exponente par, el resultado es positivo."):
            self.play(FadeIn(regla5_txt), Write(signo5), run_time=1.5)
            self.wait(0.5)

        # Multiplicación repetida
        mult5_txt = Estilo.texto("Multiplicación repetida:", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 2.1)
        mult5_val = Estilo.texto("2 × 2 × 2 × 2 × 2 × 2 = 64", font_size=24, color=Estilo.AZUL_OSCURO, weight=BOLD).next_to(mult5_txt, DOWN, buff=0.1)

        with self.hablar("Multiplicamos dos seis veces, y el resultado es sesenta y cuatro."):
            self.play(FadeIn(mult5_txt), Write(mult5_val), run_time=1.5)
            self.wait(3.0) # Pausa para Kdenlive