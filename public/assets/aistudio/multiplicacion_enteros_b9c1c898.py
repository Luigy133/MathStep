from contextlib import contextmanager
from manim import *

try:
    from manim_voiceover import VoiceoverScene
    from manim_voiceover.services.gtts import GTTSService
    VOICEOVER_ACTIVO = True
except ImportError:
    VoiceoverScene = Scene
    VOICEOVER_ACTIVO = False

class Estilo:
    FONDO = "#EFF6FF"            
    AZUL_HEADER = "#3B82F6"
    AZUL_TEXTO = "#1D4ED8"
    AZUL_OSCURO = "#1E3A8A"
    COLOR_POSITIVO = "#2563EB"     # Azul
    COLOR_NEGATIVO = "#DC2626"     # Rojo
    GRIS_TEXTO = "#4B5563"
    FUENTE_FAMILIA = "Arial"

    @staticmethod
    def texto(contenido: str, font_size: float = 24, color=None, weight=NORMAL, **kwargs) -> Text:
        col = color if color is not None else Estilo.AZUL_OSCURO
        escala = font_size / 64.0
        return Text(
            contenido,
            font=Estilo.FUENTE_FAMILIA,
            font_size=64,
            color=col,
            weight=weight,
            **kwargs
        ).scale(escala)

class BaseMultiplicacion(VoiceoverScene):
    def configurar_escena(self):
        self.camera.background_color = Estilo.FONDO
        if VOICEOVER_ACTIVO and hasattr(self, "set_speech_service"):
            self.set_speech_service(GTTSService(lang="es", tld="com"))

    @contextmanager
    def hablar(self, texto: str):
        if VOICEOVER_ACTIVO and hasattr(self, "voiceover") and texto:
            with self.voiceover(text=texto):
                yield
        else:
            yield

    def crear_tarjeta_y_header(self, titulo: str, icono: str = "✖️") -> VGroup:
        tarjeta = RoundedRectangle(
            width=13.0, height=7.2, corner_radius=0.4,
            fill_color=WHITE, fill_opacity=1.0,
            stroke_color="#DBEAFE", stroke_width=2
        ).move_to(ORIGIN)

        header = RoundedRectangle(
            width=13.0, height=1.25, corner_radius=0.4,
            fill_color=Estilo.AZUL_HEADER, fill_opacity=1.0, stroke_width=0
        ).move_to(tarjeta.get_top() + DOWN * 0.625)

        contenido_header = VGroup(
            Estilo.texto(icono, font_size=32),
            Estilo.texto(titulo, font_size=28, color=WHITE, weight=BOLD)
        ).arrange(RIGHT, buff=0.25).move_to(header.get_center())

        return VGroup(tarjeta, header, contenido_header)

    def crear_ecuacion(self, partes: list, font_size: float = 30, color=None, weight=BOLD) -> VGroup:
        col = color if color is not None else Estilo.AZUL_OSCURO
        elementos = [Estilo.texto(parte, font_size=font_size, color=col, weight=weight) for parte in partes]
        return VGroup(*elementos).arrange(RIGHT, buff=0.15)

# =============================================================================
# ESCENA 1: PORTADA
# =============================================================================
class PortadaMultiplicacion(BaseMultiplicacion):
    def construct(self):
        import os
        self.configurar_escena()

        def buscar_imagen(*terminos):
            rutas = [
                os.getcwd(),
                os.path.join(os.getcwd(), "media", "images", "aventura_enteros(1)"),
                os.path.join(os.getcwd(), "media", "images"),
                os.path.join(os.getcwd(), "media"),
                os.path.join(os.getcwd(), "images"),
            ]
            exts = (".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".webp")
            for d in rutas:
                if not os.path.isdir(d): continue
                try:
                    for nom in os.listdir(d):
                        nl = nom.lower()
                        for t in terminos:
                            if t.lower() in nl and nl.endswith(exts):
                                r = os.path.join(d, nom)
                                if os.path.isfile(r):
                                    return r
                except Exception: pass
            return None

        # Fondo degradado
        fondo = Rectangle(width=16.0, height=10.0, stroke_width=0)
        fondo.set_fill(color=["#38BDF8", "#0284C7", "#1E3A8A"], opacity=1.0)
        self.play(FadeIn(fondo), run_time=0.6)

        archivo_logo = buscar_imagen("logo", "mathstep")
        archivo_slogan = buscar_imagen("slogan", "eslogan")

        if archivo_logo:
            logo_img = ImageMobject(archivo_logo)
            if logo_img.width > logo_img.height * 2.2:
                logo_img.scale_to_fit_width(6.2)
            else:
                logo_img.scale_to_fit_height(1.4)

            if archivo_slogan:
                slogan_img = ImageMobject(archivo_slogan).scale_to_fit_height(0.6)
                # USAMOS Group AQUÍ EN LUGAR DE VGroup
                logo_mob = Group(logo_img, slogan_img).arrange(DOWN, buff=0.15).move_to(UP * 2.5)
            else:
                slogan_txt = Estilo.texto("Matemáticas Interactivas Paso a Paso", font_size=20, color="#BAE6FD", weight=BOLD)
                # USAMOS Group AQUÍ EN LUGAR DE VGroup
                logo_mob = Group(logo_img, slogan_txt).arrange(DOWN, buff=0.15).move_to(UP * 2.5)
        else:
            # Si no encuentra el logo, crea uno con texto (VMobject puro, aquí sí va VGroup)
            nombre_logo = Estilo.texto("MathStep", font_size=38, color=WHITE, weight=BOLD)
            slogan_logo = Estilo.texto("Matemáticas Interactivas Paso a Paso", font_size=20, color="#BAE6FD", weight=BOLD)
            grp = VGroup(nombre_logo, slogan_logo).arrange(DOWN, buff=0.16)
            tarjeta = RoundedRectangle(width=max(6.2, grp.width + 0.9), height=grp.height + 0.55, corner_radius=0.25, fill_color="#0F172A", fill_opacity=0.35, stroke_color=WHITE, stroke_width=2).move_to(grp.get_center())
            logo_mob = VGroup(tarjeta, grp).move_to(UP * 2.5)

        self.play(FadeIn(logo_mob, shift=DOWN * 0.2), run_time=0.6)

        # Título y Subtítulo
        titulo = Estilo.texto("Multiplicación de Enteros", font_size=48, color=WHITE, weight=BOLD).move_to(UP * 0.5)
        subtitulo = Estilo.texto("La Ley de los Signos", font_size=26, color="#FEF08A", weight=BOLD).next_to(titulo, DOWN, buff=0.35)

        # Buscar el lápiz
        archivo_lapiz = buscar_imagen("lapiz", "pencil", "personaje", "mascota")
        if archivo_lapiz:
            lapiz_mob = ImageMobject(archivo_lapiz).scale_to_fit_height(2.6).move_to(RIGHT * 4.6 + DOWN * 1.6)
        else:
            lapiz_mob = Estilo.texto("✏️", font_size=120).move_to(RIGHT * 4.6 + DOWN * 1.6)

        # Narración y animación
        voz = "Aprende a multiplicar números enteros dominando la ley de los signos."
        with self.hablar(voz):
            self.play(Write(titulo), run_time=1.3)
            self.play(FadeIn(subtitulo, shift=UP * 0.2), run_time=0.8)
            self.play(GrowFromCenter(lapiz_mob), run_time=0.8)
            self.play(lapiz_mob.animate.rotate(0.12), run_time=0.3)
            self.play(lapiz_mob.animate.rotate(-0.12), run_time=0.3)
            self.wait(2.2)

# =============================================================================
# ESCENA 2: EL REPASO (LA RECTA NUMÉRICA)
# =============================================================================
class Escena2RepasoRecta(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()

        # 1. Tarjeta y Header
        base = self.crear_tarjeta_y_header("La Recta Numérica", "📏")
        self.play(FadeIn(base[0]), run_time=0.4)
        self.play(FadeIn(base[1]), Write(base[2]), run_time=0.9)

        # 2. Crear la recta numérica
        recta = NumberLine(
            x_range=[-20, 21, 5],
            length=11.2, include_numbers=False,
            stroke_width=2.5, color=Estilo.AZUL_OSCURO, tick_size=0.09
        ).move_to(UP * 0.2)

        # Etiquetas base (múltiplos de 5)
        valores_clave = [-20, -15, -10, -5, 0, 5, 10, 15, 20]
        etiquetas_dict = {}
        grupo_etiquetas_base = VGroup()
        for val in valores_clave:
            txt = Estilo.texto(str(val), font_size=18, color=Estilo.AZUL_OSCURO)
            txt.next_to(recta.n2p(val), DOWN, buff=0.25)
            etiquetas_dict[val] = txt
            grupo_etiquetas_base.add(txt)

        self.play(Create(recta), FadeIn(grupo_etiquetas_base), run_time=1.6)
        self.wait(0.6)

        # Función de apoyo para iluminar
        def iluminar_numero(val: int, color_luz: str):
            pos = recta.n2p(val)
            punto = Dot(pos, color=color_luz, radius=0.15)
            halo = Circle(radius=0.28, color=color_luz, stroke_width=3).move_to(pos)
            txt_brillante = Estilo.texto(str(val), font_size=20, color=color_luz, weight=BOLD).next_to(pos, DOWN, buff=0.22)
            return VGroup(punto, halo, txt_brillante)

        # 3. Positivos en Azul
        voz_positivos = "Los números enteros incluyen los positivos, que están a la derecha del cero."
        
        rotulo_pos = RoundedRectangle(
            width=3.2, height=0.6, corner_radius=0.15,
            fill_color="#DBEAFE", fill_opacity=1.0,
            stroke_color=Estilo.COLOR_POSITIVO, stroke_width=2
        ).move_to(RIGHT * 3.6 + DOWN * 1.8)
        txt_pos = Estilo.texto("Positivos (+)", font_size=15, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(rotulo_pos.get_center())
        caja_pos = VGroup(rotulo_pos, txt_pos)

        positivos_intermedios = VGroup()
        for v in range(1, 21):
            if v % 5 != 0:
                pos = recta.n2p(v)
                t_intermedio = Estilo.texto(str(v), font_size=12, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(pos, DOWN, buff=0.25)
                positivos_intermedios.add(t_intermedio)

        with self.hablar(voz_positivos):
            self.play(FadeIn(caja_pos), FadeIn(positivos_intermedios, lag_ratio=0.05), run_time=0.8)
            for v in [5, 10, 15, 20]:
                obj_luz = iluminar_numero(v, Estilo.COLOR_POSITIVO)
                self.play(FadeIn(obj_luz[0]), Create(obj_luz[1]), Transform(etiquetas_dict[v], obj_luz[2]), run_time=0.55)
            self.wait(1.0)

        # 4. Negativos en Rojo
        voz_negativos = "Los negativos se ubican a la izquierda del cero."
        
        rotulo_neg = RoundedRectangle(
            width=3.2, height=0.6, corner_radius=0.15,
            fill_color="#FEE2E2", fill_opacity=1.0,
            stroke_color=Estilo.COLOR_NEGATIVO, stroke_width=2
        ).move_to(LEFT * 3.6 + DOWN * 1.8)
        txt_neg = Estilo.texto("Negativos (-)", font_size=15, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(rotulo_neg.get_center())
        caja_neg = VGroup(rotulo_neg, txt_neg)

        negativos_intermedios = VGroup()
        for v in range(-1, -21, -1):
            if v % 5 != 0:
                pos = recta.n2p(v)
                t_intermedio = Estilo.texto(str(v), font_size=11, color=Estilo.COLOR_NEGATIVO, weight=BOLD).next_to(pos, DOWN, buff=0.25)
                negativos_intermedios.add(t_intermedio)

        with self.hablar(voz_negativos):
            self.play(FadeIn(caja_neg), FadeIn(negativos_intermedios, lag_ratio=0.05), run_time=0.8)
            for v in [-5, -10, -15, -20]:
                obj_luz = iluminar_numero(v, Estilo.COLOR_NEGATIVO)
                self.play(FadeIn(obj_luz[0]), Create(obj_luz[1]), Transform(etiquetas_dict[v], obj_luz[2]), run_time=0.55)
            self.wait(1.0)

        # 5. El Cero en Amarillo
        voz_cero = "Y en el centro, el cero. Recuerda esto, porque hoy usaremos esta misma recta para entender la multiplicación."
        
        rotulo_cero = RoundedRectangle(
            width=2.4, height=0.6, corner_radius=0.15,
            fill_color="#FEF3C7", fill_opacity=1.0,
            stroke_color="#F59E0B", stroke_width=2
        ).move_to(DOWN * 1.8)
        txt_cero = Estilo.texto("Cero (0)", font_size=15, color="#B45309", weight=BOLD).move_to(rotulo_cero.get_center())
        caja_cero = VGroup(rotulo_cero, txt_cero)

        luz_cero = iluminar_numero(0, "#F59E0B")

        with self.hablar(voz_cero):
            self.play(FadeIn(caja_cero), FadeIn(luz_cero[0]), Create(luz_cero[1]), Transform(etiquetas_dict[0], luz_cero[2]), run_time=1.2)
            self.wait(1.5)

# =============================================================================
# ESCENA 3: ¿QUÉ ES MULTIPLICAR?
# =============================================================================
class Escena3QueEsMultiplicar(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("¿Qué es multiplicar?", "🤔")
        self.add(base)
        
        titulo = Estilo.texto("Multiplicar es una suma abreviada", font_size=32, weight=BOLD)
        titulo.move_to(UP * 1.8)
        self.add(titulo)

        # ---------------------------------------------------------
        # PARTE 1: Ejemplo con 5 x 3
        # ---------------------------------------------------------
        observa1 = Estilo.texto("Observa:", font_size=28, color=Estilo.GRIS_TEXTO)
        suma1 = self.crear_ecuacion(["3", "+", "3", "+", "3", "+", "3", "+", "3", "=", "15"], font_size=36, color=Estilo.AZUL_OSCURO)
        grupo1 = VGroup(observa1, suma1).arrange(DOWN, buff=0.4).move_to(UP * 0.8)

        es_decir1 = self.crear_ecuacion(["Es decir:", "5", "veces", "3", "=", "15"], font_size=28, color=Estilo.GRIS_TEXTO)
        es_decir1.next_to(grupo1, DOWN, buff=0.6)

        por_lo_tanto1 = self.crear_ecuacion(["Por lo tanto:", "5", "×", "3", "=", "15"], font_size=36, color=Estilo.COLOR_POSITIVO)
        por_lo_tanto1.next_to(es_decir1, DOWN, buff=0.6)

        with self.hablar("Si tienes una adición donde todos los sumandos son iguales, el resultado puede obtenerse de manera más rápida a través de una operación llamada multiplicación."):
            self.play(Write(observa1), Write(suma1), run_time=2)
            self.play(Write(es_decir1), run_time=1.5)
            self.play(Write(por_lo_tanto1), run_time=1.5)
            self.wait(2)

        # Limpiar para el segundo ejemplo
        self.play(FadeOut(grupo1), FadeOut(es_decir1), FadeOut(por_lo_tanto1), run_time=0.5)

        # ---------------------------------------------------------
        # PARTE 2: Ejemplo con (-4) x 2
        # ---------------------------------------------------------
        observa2 = Estilo.texto("Observa:", font_size=28, color=Estilo.GRIS_TEXTO)
        suma2 = self.crear_ecuacion(["(-4)", "+", "(-4)", "=", "-8"], font_size=36, color=Estilo.COLOR_NEGATIVO)
        grupo2 = VGroup(observa2, suma2).arrange(DOWN, buff=0.4).move_to(UP * 0.8)

        es_decir2 = self.crear_ecuacion(["Es decir:", "2", "veces", "(-4)", "=", "-8"], font_size=28, color=Estilo.GRIS_TEXTO)
        es_decir2.next_to(grupo2, DOWN, buff=0.6)

        por_lo_tanto2 = self.crear_ecuacion(["Por lo tanto:", "2", "×", "(-4)", "=", "-8"], font_size=36, color=Estilo.COLOR_NEGATIVO)
        por_lo_tanto2.next_to(es_decir2, DOWN, buff=0.6)

        with self.hablar("Veamos otro ejemplo: Observa: menos cuatro más menos cuatro, es menos ocho. Es decir, dos veces menos cuatro es menos ocho. Por lo tanto, dos por menos cuatro es igual a menos ocho."):
            self.play(Write(observa2), Write(suma2), run_time=2)
            self.play(Write(es_decir2), run_time=1.5)
            self.play(Write(por_lo_tanto2), run_time=1.5)
            self.wait(2)

        # Limpiar para la formalización
        self.play(FadeOut(grupo2), FadeOut(es_decir2), FadeOut(por_lo_tanto2), run_time=0.5)

        # ---------------------------------------------------------
        # PARTE 3: Factores y Producto (Resaltado visual)
        # ---------------------------------------------------------
        operacion_final = self.crear_ecuacion(["5", "×", "3", "=", "15"], font_size=56, color=Estilo.AZUL_OSCURO)
        operacion_final.move_to(UP * 0.5)

        # Mostramos la operación completa
        self.play(Write(operacion_final), run_time=1)
        self.wait(1)

        # Calculamos las posiciones exactas de los números
        pos_5 = operacion_final[0].get_center()
        pos_3 = operacion_final[2].get_center()
        pos_15 = operacion_final[4].get_center()

        # Creamos los círculos de resaltado
        circulo_5 = Circle(radius=0.5, color=Estilo.COLOR_POSITIVO, stroke_width=4).move_to(pos_5)
        circulo_3 = Circle(radius=0.5, color=Estilo.COLOR_POSITIVO, stroke_width=4).move_to(pos_3)
        circulo_15 = Circle(radius=0.6, color=Estilo.COLOR_POSITIVO, stroke_width=4).move_to(pos_15)

        # Creamos las etiquetas (sin flechas)
        etiqueta_factores = Estilo.texto("Factores", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        etiqueta_factores.next_to(operacion_final, DOWN, buff=1.2).shift(LEFT * 1.2)

        etiqueta_producto = Estilo.texto("Producto", font_size=32, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        etiqueta_producto.next_to(operacion_final, DOWN, buff=1.2).shift(RIGHT * 2.5)

        # NARRACIÓN Y ANIMACIÓN SINCRONIZADA
        with self.hablar("A los números que se multiplican se les llama factores."):
            # Resaltamos el 5 y el 3 al mismo tiempo
            self.play(Create(circulo_5), Create(circulo_3), run_time=1.5)
            self.play(Write(etiqueta_factores), run_time=1.0)
            self.wait(1)

        with self.hablar("Y al resultado se le llama producto."):
            # Resaltamos el 15
            self.play(Create(circulo_15), run_time=1.5)
            self.play(Write(etiqueta_producto), run_time=1.0)
            self.wait(2)


# =============================================================================
# ESCENA 4: INTRODUCCIÓN A LA LEY DE LOS SIGNOS
# =============================================================================
class Escena4LeySignosIntro(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("La Ley de los Signos", "⚖️")
        self.add(base)

        bloque1 = VGroup(
            Estilo.texto("1. Signos Iguales", font_size=36, color=Estilo.COLOR_POSITIVO, weight=BOLD),
            self.crear_ecuacion(["(+)", "×", "(+)", "=", "(+)"], font_size=30, color=Estilo.GRIS_TEXTO),
            self.crear_ecuacion(["(-)", "×", "(-)", "=", "(+)"], font_size=30, color=Estilo.GRIS_TEXTO)
        ).arrange(DOWN, buff=0.3).move_to(LEFT * 3 + UP * 0.5)

        bloque2 = VGroup(
            Estilo.texto("2. Signos Diferentes", font_size=36, color=Estilo.COLOR_NEGATIVO, weight=BOLD),
            self.crear_ecuacion(["(+)", "×", "(-)", "=", "(-)"], font_size=30, color=Estilo.GRIS_TEXTO),
            self.crear_ecuacion(["(-)", "×", "(+)", "=", "(-)"], font_size=30, color=Estilo.GRIS_TEXTO)
        ).arrange(DOWN, buff=0.3).move_to(RIGHT * 3 + UP * 0.5)

        with self.hablar("Para multiplicar números enteros, no necesitas aprenderte una lista interminable de casos. Solo necesitas recordar dos reglas."):
            self.play(Write(bloque1[0]), Write(bloque2[0]), run_time=1.5)
            self.wait(1)

        with self.hablar("Primera: si los signos son iguales, el resultado es positivo."):
            self.play(FadeIn(bloque1[1]), FadeIn(bloque1[2]), run_time=1.5)
            self.wait(1)

        with self.hablar("Segunda: si los signos son diferentes, el resultado es negativo."):
            self.play(FadeIn(bloque2[1]), FadeIn(bloque2[2]), run_time=1.5)
            self.wait(2)


# =============================================================================
# ESCENA 5: REGLA 1 - SIGNOS IGUALES (PASO A PASO)
# =============================================================================
class Escena5SignosIguales(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Regla 1: Signos Iguales", "➕")
        self.add(base)
        
        # --- EJEMPLO 1 ---
        ej1_titulo = Estilo.texto("Ejemplo 1: (+) × (+)", font_size=28, color=Estilo.COLOR_POSITIVO, weight=BOLD)
        ej1_titulo.move_to(UP * 2.0) 
        
        ej1_operacion = self.crear_ecuacion(["(+4)", "×", "(+3)", "=", "?"], font_size=44, color=Estilo.AZUL_OSCURO)
        ej1_operacion.move_to(UP * 1.0)

        with self.hablar("Empecemos con el primer ejemplo: positivo por positivo. Cuatro por tres."):
            self.play(Write(ej1_titulo), run_time=1)
            self.play(Write(ej1_operacion), run_time=1.5)
            self.wait(0.5)

        ej1_paso1_txt = Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + LEFT * 3)
        ej1_signo_res = self.crear_ecuacion(["(+)", "×", "(+)", "=", "(+)"], font_size=26, color=Estilo.COLOR_POSITIVO).next_to(ej1_paso1_txt, DOWN, buff=0.2)
        
        ej1_paso2_txt = Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + RIGHT * 2.5)
        ej1_num_res = self.crear_ecuacion(["4", "×", "3", "=", "12"], font_size=26, color=Estilo.AZUL_OSCURO).next_to(ej1_paso2_txt, DOWN, buff=0.2)

        with self.hablar("Paso uno: multiplicamos los signos. Más por más es más."):
            self.play(FadeIn(ej1_paso1_txt), Write(ej1_signo_res), run_time=1.2)
        
        with self.hablar("Paso dos: multiplicamos los números. Cuatro por tres es doce."):
            self.play(FadeIn(ej1_paso2_txt), Write(ej1_num_res), run_time=1.2)
            self.wait(0.5)

        ej1_paso3_txt = Estilo.texto("Paso 3: Juntamos signo y número", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.6)
        ej1_resultado_combinado = Estilo.texto("+12", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(ej1_paso3_txt, DOWN, buff=0.3)

        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es más doce."):
            self.play(FadeIn(ej1_paso3_txt), run_time=0.8)
            self.play(Write(ej1_resultado_combinado), run_time=1.0)
            self.wait(1)

        ej1_operacion_final = self.crear_ecuacion(["4", "×", "3", "=", "12"], font_size=44, color=Estilo.COLOR_POSITIVO).move_to(UP * 1.0)

        with self.hablar("Recuerda: a los números positivos no es necesario colocarles el signo más. Así que la operación queda como: cuatro por tres igual a doce."):
            self.play(Transform(ej1_operacion, ej1_operacion_final), run_time=1.5)
            self.wait(1)

        with self.hablar("El truco para recordar este caso es: el amigo de mi amigo es mi amigo."):
            self.wait(2) 

        self.play(FadeOut(ej1_titulo), FadeOut(ej1_paso1_txt), FadeOut(ej1_signo_res), FadeOut(ej1_paso2_txt), FadeOut(ej1_num_res), FadeOut(ej1_paso3_txt), FadeOut(ej1_resultado_combinado), FadeOut(ej1_operacion), run_time=0.5)

        # --- EJEMPLO 2 ---
        ej2_titulo = Estilo.texto("Ejemplo 2: (-) × (-)", font_size=28, color=Estilo.COLOR_POSITIVO, weight=BOLD).move_to(UP * 2.0)
        ej2_operacion = self.crear_ecuacion(["(-5)", "×", "(-4)", "=", "?"], font_size=44, color=Estilo.AZUL_OSCURO).move_to(UP * 1.0)

        with self.hablar("Ahora veamos: negativo por negativo. Menos cinco por menos cuatro."):
            self.play(Write(ej2_titulo), run_time=1)
            self.play(Write(ej2_operacion), run_time=1.5)
            self.wait(0.5)

        paso1_texto = Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + LEFT * 3)
        signo_res = self.crear_ecuacion(["(-)", "×", "(-)", "=", "(+)"], font_size=26, color=Estilo.COLOR_POSITIVO).next_to(paso1_texto, DOWN, buff=0.2)

        paso2_texto = Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + RIGHT * 2.5)
        num_res = self.crear_ecuacion(["5", "×", "4", "=", "20"], font_size=26, color=Estilo.AZUL_OSCURO).next_to(paso2_texto, DOWN, buff=0.2)

        paso3_texto = Estilo.texto("Paso 3: Juntamos signo y número", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.6)
        resultado_combinado = Estilo.texto("+20", font_size=44, color=Estilo.COLOR_POSITIVO, weight=BOLD).next_to(paso3_texto, DOWN, buff=0.3)

        with self.hablar("Paso uno: multiplicamos los signos. Menos por menos es más."):
            self.play(FadeIn(paso1_texto), Write(signo_res), run_time=1.2)
        
        with self.hablar("Paso dos: multiplicamos los números. Cinco por cuatro es veinte."):
            self.play(FadeIn(paso2_texto), Write(num_res), run_time=1.2)
            self.wait(0.5)

        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es más veinte."):
            self.play(FadeIn(paso3_texto), run_time=0.8)
            self.play(Write(resultado_combinado), run_time=1.0)
            self.wait(1)

        ej2_operacion_final = self.crear_ecuacion(["(-5)", "×", "(-4)", "=", "20"], font_size=44, color=Estilo.COLOR_POSITIVO).move_to(UP * 1.0)

        with self.hablar("Y no olvides que no es necesario colocar el signo más."):
            self.play(Transform(ej2_operacion, ej2_operacion_final), run_time=1.5)
            self.wait(1)
            
        with self.hablar("El truco para recordar: el enemigo de mi enemigo también es mi amigo."):
            self.wait(2)


# =============================================================================
# ESCENA 6: REGLA 2 - SIGNOS DIFERENTES (Ejemplo 3: + * -)
# =============================================================================
class Escena6SignosDiferentes1(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Regla 2: Signos Diferentes", "➖")
        self.add(base)
        
        ej3_titulo = Estilo.texto("Ejemplo 3: (+) × (-)", font_size=28, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(UP * 2.0) 
        ej3_operacion = self.crear_ecuacion(["(+7)", "×", "(-5)", "=", "?"], font_size=44, color=Estilo.AZUL_OSCURO).move_to(UP * 1.0)

        with self.hablar("Pasemos a los signos diferentes. Ejemplo tres: positivo por negativo. Siete por menos cinco."):
            self.play(Write(ej3_titulo), run_time=1)
            self.play(Write(ej3_operacion), run_time=1.5)
            self.wait(0.5)

        ej3_paso1_txt = Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + LEFT * 3)
        ej3_signo_res = self.crear_ecuacion(["(+)", "×", "(-)", "=", "(-)"], font_size=26, color=Estilo.COLOR_NEGATIVO).next_to(ej3_paso1_txt, DOWN, buff=0.2)
        
        ej3_paso2_txt = Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + RIGHT * 2.5)
        ej3_num_res = self.crear_ecuacion(["7", "×", "5", "=", "35"], font_size=26, color=Estilo.AZUL_OSCURO).next_to(ej3_paso2_txt, DOWN, buff=0.2)

        with self.hablar("Paso uno: multiplicamos los signos. Más por menos es menos."):
            self.play(FadeIn(ej3_paso1_txt), Write(ej3_signo_res), run_time=1.2)
        
        with self.hablar("Paso dos: multiplicamos los números. Siete por cinco es treinta y cinco."):
            self.play(FadeIn(ej3_paso2_txt), Write(ej3_num_res), run_time=1.2)
            self.wait(0.5)

        ej3_paso3_txt = Estilo.texto("Paso 3: Juntamos signo y número", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.6)
        ej3_resultado_combinado = Estilo.texto("-35", font_size=44, color=Estilo.COLOR_NEGATIVO, weight=BOLD).next_to(ej3_paso3_txt, DOWN, buff=0.3)

        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es menos treinta y cinco."):
            self.play(FadeIn(ej3_paso3_txt), run_time=0.8)
            self.play(Write(ej3_resultado_combinado), run_time=1.0)
            self.wait(1)

        ej3_operacion_final = self.crear_ecuacion(["7", "×", "(-5)", "=", "-35"], font_size=44, color=Estilo.COLOR_NEGATIVO).move_to(UP * 1.0)

        with self.hablar("La operación queda como: siete por menos cinco, igual a menos treinta y cinco."):
            self.play(Transform(ej3_operacion, ej3_operacion_final), run_time=1.5)
            self.wait(1)

        with self.hablar("El truco para recordar este caso es: el amigo de mi enemigo es mi enemigo."):
            self.wait(2) 


# =============================================================================
# ESCENA 7: REGLA 2 - SIGNOS DIFERENTES (Ejemplo 4: - * +)
# =============================================================================
class Escena7SignosDiferentes2(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        base = self.crear_tarjeta_y_header("Regla 2: Signos Diferentes", "➖")
        self.add(base)
        
        ej4_titulo = Estilo.texto("Ejemplo 4: (-) × (+)", font_size=28, color=Estilo.COLOR_NEGATIVO, weight=BOLD).move_to(UP * 2.0) 
        ej4_operacion = self.crear_ecuacion(["(-8)", "×", "(+4)", "=", "?"], font_size=44, color=Estilo.AZUL_OSCURO).move_to(UP * 1.0)

        with self.hablar("Ahora el caso contrario. Ejemplo cuatro: negativo por positivo. Menos ocho por cuatro."):
            self.play(Write(ej4_titulo), run_time=1)
            self.play(Write(ej4_operacion), run_time=1.5)
            self.wait(0.5)

        ej4_paso1_txt = Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + LEFT * 3)
        ej4_signo_res = self.crear_ecuacion(["(-)", "×", "(+)", "=", "(-)"], font_size=26, color=Estilo.COLOR_NEGATIVO).next_to(ej4_paso1_txt, DOWN, buff=0.2)
        
        ej4_paso2_txt = Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 0.2 + RIGHT * 2.5)
        ej4_num_res = self.crear_ecuacion(["8", "×", "4", "=", "32"], font_size=26, color=Estilo.AZUL_OSCURO).next_to(ej4_paso2_txt, DOWN, buff=0.2)

        with self.hablar("Paso uno: multiplicamos los signos. Menos por más es menos."):
            self.play(FadeIn(ej4_paso1_txt), Write(ej4_signo_res), run_time=1.2)
        
        with self.hablar("Paso dos: multiplicamos los números. Ocho por cuatro es treinta y dos."):
            self.play(FadeIn(ej4_paso2_txt), Write(ej4_num_res), run_time=1.2)
            self.wait(0.5)

        ej4_paso3_txt = Estilo.texto("Paso 3: Juntamos signo y número", font_size=24, color=Estilo.GRIS_TEXTO).move_to(DOWN * 1.6)
        ej4_resultado_combinado = Estilo.texto("-32", font_size=44, color=Estilo.COLOR_NEGATIVO, weight=BOLD).next_to(ej4_paso3_txt, DOWN, buff=0.3)

        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es menos treinta y dos."):
            self.play(FadeIn(ej4_paso3_txt), run_time=0.8)
            self.play(Write(ej4_resultado_combinado), run_time=1.0)
            self.wait(1)

        ej4_operacion_final = self.crear_ecuacion(["(-8)", "×", "4", "=", "-32"], font_size=44, color=Estilo.COLOR_NEGATIVO).move_to(UP * 1.0)

        with self.hablar("La operación queda como: menos ocho por cuatro, igual a menos treinta y dos."):
            self.play(Transform(ej4_operacion, ej4_operacion_final), run_time=1.5)
            self.wait(1)

        with self.hablar("El truco para recordar este caso es: el enemigo de mi amigo es mi enemigo."):
            self.wait(2)


# =============================================================================
# ESCENA 8: MÁS DE DOS FACTORES (Paso a paso uno por uno)
# =============================================================================
class Escena8MasFactores(BaseMultiplicacion):
    def construct(self):
        self.configurar_escena()
        
        # 1. Header y Ejercicio Inicial
        base = self.crear_tarjeta_y_header("El caso de 3 o más factores", "🔢")
        self.add(base)
        
        ejercicio_inicial = self.crear_ecuacion(["(-2)", "×", "3", "×", "(-4)", "=", "?"], font_size=40)
        ejercicio_inicial.move_to(UP * 1.5)
        self.play(Write(ejercicio_inicial))

        with self.hablar("Vamos a multiplicar menos dos por tres por menos cuatro. Tomemos los dos primeros factores: menos dos por tres, y apliquemos el método de los tres pasos."):
            self.wait(1)

        # --- FASE 1: (-2) x 3 ---
        parcial1 = self.crear_ecuacion(["(-2)", "×", "3", "="], font_size=36)
        parcial1.move_to(LEFT * 3 + DOWN * 0.5)
        self.play(Write(parcial1))

        # Creamos los pasos pero NO los mostramos aún
        p1 = VGroup(Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO), 
                    self.crear_ecuacion(["(-)", "×", "(+)", "=", "(-)"], font_size=30, color=Estilo.COLOR_NEGATIVO)).arrange(DOWN)
        p2 = VGroup(Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO), 
                    self.crear_ecuacion(["2", "×", "3", "=", "6"], font_size=30, color=Estilo.AZUL_OSCURO)).arrange(DOWN)
        p3 = VGroup(Estilo.texto("Paso 3: Resultado", font_size=24, color=Estilo.GRIS_TEXTO), 
                    self.crear_ecuacion(["-", "6"], font_size=30, color=Estilo.COLOR_NEGATIVO)).arrange(DOWN)
        
        pasos_der = VGroup(p1, p2, p3).arrange(DOWN, buff=0.4).move_to(RIGHT * 3 + DOWN * 1.0)
        
        # AQUÍ ESTÁ LA MAGIA: Tres self.play separados
        with self.hablar("Paso uno: multiplicamos los signos. Menos por más es menos."):
            self.play(Write(p1))
            self.wait(0.5)
            
        with self.hablar("Paso dos: multiplicamos los números. Dos por tres es seis."):
            self.play(Write(p2))
            self.wait(0.5)
            
        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es menos seis."):
            self.play(Write(p3))
            self.wait(1)

        # Final fase 1
        resultado1 = Estilo.texto("-6", font_size=36, color=Estilo.COLOR_NEGATIVO)
        resultado1.next_to(parcial1, RIGHT)
        self.play(Write(resultado1))
        
        # Actualizar ejercicio principal
        nuevo_ejercicio = self.crear_ecuacion(["(-2)", "×", "3", "×", "(-4)", "=", "(-6)", "×", "(-4)", "=", "?"], font_size=30)
        nuevo_ejercicio.move_to(UP * 1.5)
        self.play(Transform(ejercicio_inicial, nuevo_ejercicio))
        self.wait(1)

        # --- FASE 2: (-6) x (-4) ---
        self.play(FadeOut(parcial1), FadeOut(resultado1), FadeOut(pasos_der))
        
        parcial2 = self.crear_ecuacion(["(-6)", "×", "(-4)", "="], font_size=36)
        parcial2.move_to(LEFT * 3 + DOWN * 0.5)
        self.play(Write(parcial2))
        
        # Creamos los pasos de la fase 2
        p1_2 = VGroup(Estilo.texto("Paso 1: Signos", font_size=24, color=Estilo.GRIS_TEXTO), 
                      self.crear_ecuacion(["(-)", "×", "(-)", "=", "(+)"], font_size=30, color=Estilo.COLOR_POSITIVO)).arrange(DOWN)
        p2_2 = VGroup(Estilo.texto("Paso 2: Números", font_size=24, color=Estilo.GRIS_TEXTO), 
                      self.crear_ecuacion(["6", "×", "4", "=", "24"], font_size=30, color=Estilo.AZUL_OSCURO)).arrange(DOWN)
        p3_2 = VGroup(Estilo.texto("Paso 3: Resultado", font_size=24, color=Estilo.GRIS_TEXTO), 
                      self.crear_ecuacion(["+", "24"], font_size=30, color=Estilo.COLOR_POSITIVO)).arrange(DOWN)
        
        pasos_der2 = VGroup(p1_2, p2_2, p3_2).arrange(DOWN, buff=0.4).move_to(RIGHT * 3 + DOWN * 1.0)
        
        # AQUÍ TAMBIÉN: Tres self.play separados para la fase 2
        with self.hablar("Ahora multiplicamos menos seis por menos cuatro. Paso uno: menos por menos es más."):
            self.play(Write(p1_2))
            self.wait(0.5)
            
        with self.hablar("Paso dos: seis por cuatro es veinticuatro."):
            self.play(Write(p2_2))
            self.wait(0.5)
            
        with self.hablar("Paso tres: juntamos el signo y el número. El resultado es más veinticuatro."):
            self.play(Write(p3_2))
            self.wait(1)
            
        resultado2 = Estilo.texto("24", font_size=36, color=Estilo.COLOR_POSITIVO)
        resultado2.next_to(parcial2, RIGHT)
        self.play(Write(resultado2))
        
        final = self.crear_ecuacion(["(-2)", "×", "3", "×", "(-4)", "=", "24"], font_size=40, color=Estilo.COLOR_POSITIVO)
        final.move_to(ORIGIN) 

        with self.hablar("El producto final de menos dos por tres por menos cuatro es veinticuatro."):
            # 1. Primero, quitamos el ejercicio anterior para dejar espacio
            self.play(FadeOut(ejercicio_inicial), FadeOut(parcial2), FadeOut(resultado2), FadeOut(pasos_der2), run_time=0.5)
            
            # 2. Hacemos aparecer la ecuación final creciendo desde el centro
            self.play(GrowFromCenter(final), run_time=1)
            
            # 3. LA MAGIA: Hacemos que gire 360 grados (2 * PI radianes)
            self.play(Rotate(final, angle=2 * PI, run_time=1.5, rate_func=smooth))
            
            # 4. Efecto de destello (opcional)
            self.play(Circumscribe(final, color=YELLOW, run_time=1))
            
            # 5. Pausa final para que el estudiante asimile
            self.wait(2)

# =============================================================================
# ESCENA 9: CIERRE (Con Iconos Vectoriales y Marca Oficial)
# =============================================================================
class Escena9Cierre(BaseMultiplicacion):
    def construct(self):
        import os
        self.configurar_escena()

        def buscar_imagen(*terminos):
            rutas = [
                os.getcwd(),
                os.path.join(os.getcwd(), "media", "images", "aventura_enteros(1)"),
                os.path.join(os.getcwd(), "media", "images"),
                os.path.join(os.getcwd(), "media"),
                os.path.join(os.getcwd(), "images"),
            ]
            exts = (".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".webp")
            for d in rutas:
                if not os.path.isdir(d): continue
                try:
                    for nom in os.listdir(d):
                        nl = nom.lower()
                        for t in terminos:
                            if t.lower() in nl and nl.endswith(exts):
                                r = os.path.join(d, nom)
                                if os.path.isfile(r): return r
                except Exception: pass
            return None

        # 1. Fondo degradado
        fondo = Rectangle(width=16.0, height=10.0, stroke_width=0)
        fondo.set_fill(color=["#38BDF8", "#0284C7", "#1E3A8A"], opacity=1.0)
        self.play(FadeIn(fondo), run_time=0.6)

        # 2. Logo Arriba
        archivo_logo = buscar_imagen("logo", "mathstep")
        if archivo_logo:
            logo_img = ImageMobject(archivo_logo).scale_to_fit_height(1.2)
            logo_mob = logo_img.move_to(UP * 3.0)
        else:
            nombre_logo = Estilo.texto("MathStep", font_size=36, color=WHITE, weight=BOLD).move_to(UP * 3.0)
            logo_mob = VGroup(nombre_logo)

        self.play(FadeIn(logo_mob), run_time=0.8)

        # 3. Tarjeta Central
        tarjeta = RoundedRectangle(
            width=8.5, height=3.2, corner_radius=0.3,
            fill_color=WHITE, fill_opacity=0.95, stroke_color="#BAE6FD", stroke_width=2.5
        ).move_to(UP * 0.5)

        titulo = Estilo.texto("¡Ahora te toca practicar!", font_size=34, color=Estilo.AZUL_OSCURO, weight=BOLD)
        subtitulo = Estilo.texto("Resuelve los ejercicios en la app.", font_size=18, color=Estilo.GRIS_TEXTO)
        
        grupo_texto = VGroup(titulo, subtitulo).arrange(DOWN, buff=0.3).move_to(tarjeta.get_center())
        self.play(FadeIn(tarjeta), Write(titulo), FadeIn(subtitulo), run_time=1.5)

        # 4. Barra de Redes Sociales con Iconos Vectoriales
        barra_redes = RoundedRectangle(
            width=9.0, height=0.8, corner_radius=0.2,
            fill_color="#0F172A", fill_opacity=0.6, stroke_color="#94A3B8", stroke_width=1.5
        ).move_to(DOWN * 2.5)

        # Icono YouTube (Placa roja + triángulo)
        placa_yt = RoundedRectangle(width=0.35, height=0.24, corner_radius=0.06, fill_color="#FF0000", fill_opacity=1.0, stroke_width=0)
        tri_yt = Polygon([-0.04, 0.05, 0], [-0.04, -0.05, 0], [0.05, 0, 0], fill_color=WHITE, fill_opacity=1.0, stroke_width=0)
        ico_yt = VGroup(placa_yt, tri_yt)
        item_yt = VGroup(ico_yt, Estilo.texto("YouTube: @MathStep", font_size=14, color="#FCA5A5", weight=BOLD)).arrange(RIGHT, buff=0.1)

        # Icono Instagram (Cámara)
        cuadro_ig = RoundedRectangle(width=0.26, height=0.26, corner_radius=0.07, fill_opacity=0, stroke_color="#E1306C", stroke_width=2)
        lente_ig = Circle(radius=0.06, stroke_color="#E1306C", stroke_width=2)
        punto_ig = Dot(point=[0.07, 0.07, 0], color="#E1306C", radius=0.02)
        ico_ig = VGroup(cuadro_ig, lente_ig, punto_ig)
        item_ig = VGroup(ico_ig, Estilo.texto("Instagram: @MathStep", font_size=14, color="#F9A8D4", weight=BOLD)).arrange(RIGHT, buff=0.1)

        # Icono X (Badge negro + X)
        placa_x = RoundedRectangle(width=0.26, height=0.26, corner_radius=0.06, fill_color=BLACK, fill_opacity=1.0, stroke_color="#475569", stroke_width=1)
        letra_x = Estilo.texto("X", font_size=12, color=WHITE, weight=BOLD).move_to(placa_x.get_center())
        ico_x = VGroup(placa_x, letra_x)
        item_x = VGroup(ico_x, Estilo.texto("X: @MathStep", font_size=14, color="#BAE6FD", weight=BOLD)).arrange(RIGHT, buff=0.1)

        items_redes = VGroup(item_yt, item_ig, item_x).arrange(RIGHT, buff=0.6).move_to(barra_redes.get_center())
        grupo_redes = VGroup(barra_redes, items_redes)

        self.play(FadeIn(grupo_redes, shift=UP * 0.2), run_time=1.2)

        # 5. El Lápiz (Movido a la derecha, pero sin salirse)
        archivo_lapiz = buscar_imagen("lapiz", "pencil", "personaje", "mascota")
        if archivo_lapiz:
            # Lo traemos un poco hacia el centro: RIGHT * 4.8 en lugar de 5.0
            lapiz = ImageMobject(archivo_lapiz).scale_to_fit_height(2.5).move_to(RIGHT * 4.8 + DOWN * 1.2)
        else:
            lapiz = Estilo.texto("🏆", font_size=100).move_to(RIGHT * 4.8 + DOWN * 1.2)

        self.play(GrowFromCenter(lapiz), run_time=1.2)
        
        # Animación de celebración
        self.play(lapiz.animate.rotate(0.1), run_time=0.4)
        self.play(lapiz.animate.rotate(-0.1), run_time=0.4)

        with self.hablar("Ahora es tu turno. Ve a la sección de práctica y demuestra que dominas la ley de los signos."):
            self.wait(2)