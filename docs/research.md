# Evidencia que respalda el diseño

Resumen de la investigación (oct 2026). **[F]** evidencia fuerte (meta-análisis/replicada) · **[M]** moderada/mixta · **[D]** débil.

## Gamificación

- Sailer & Homner 2020 (meta-análisis): cognitivo g=0.49, motivacional g=0.36, conductual g=0.25; la ficción de juego modera positivamente. **[F]** doi:10.1007/s10648-019-09498-w
- Bai, Hew & Huang 2020: g=0.504 sobre rendimiento; lo más valorado es el feedback inmediato y ver el progreso. **[F]** doi:10.1016/j.edurev.2020.100322
- Hanus & Fox 2015: leaderboard + badges bajaron motivación intrínseca y nota. **[M]** doi:10.1016/j.compedu.2014.08.019
- Deci, Koestner & Ryan 1999: recompensas esperadas y contingentes reducen la motivación intrínseca; el feedback informativo la aumenta. **[F]** doi:10.1037/0033-2909.125.6.627
- Rodrigues et al. 2022: el efecto novedad cae hacia la semana 4 y se recupera parcialmente. **[M]** doi:10.1186/s41239-021-00314-6

## Técnicas de aprendizaje

- Dunlosky et al. 2013: alta utilidad para práctica de recuperación y práctica distribuida. **[F]** doi:10.1177/1529100612453266
- Efecto testeo g≈0.50–0.61, mayor con feedback (Rowland 2014; Adesope et al. 2017). **[F]**
- Intercalado g=0.42, sobre todo para discriminar categorías parecidas (Brunmair & Richter 2019). **[F]** doi:10.1037/bul0000209
- Ejemplos resueltos con fading; expertise reversal (Kalyuga 2003). **[F]**
- Problemas de Parsons: mismo aprendizaje que escribir código, en menos tiempo (Ericson et al. 2017). **[M]** doi:10.1145/3141880.3141895
- Feedback d=0.48, mejor si es informativo (Wisniewski et al. 2020). **[F]** doi:10.3389/fpsyg.2019.03087
- Mastery learning ES≈0.52 (Kulik et al. 1990). **[F]**
- Novatos en HTML: errores de anidado/cierre persistentes, 35 % de los errores (Park, Dorn & Forte 2015). **[M]** doi:10.1145/2700514

## Música de fondo

- Kämpfe et al. 2011 (meta-análisis): efecto global nulo; negativo pequeño en lectura/memoria, positivo en emoción. **[F]** doi:10.1177/0305735610376261
- Souza & Barbosa 2023 (meta-análisis): música con letra perjudica la memoria y la lectura (d≈−0.3); la instrumental, no de forma creíble. **[F]** doi:10.5334/joc.273
- Thompson et al. 2012: la música rápida y fuerte reduce la comprensión lectora. **[M]** doi:10.1177/0305735611400173
- Hipótesis arousal–ánimo (Husain et al. 2002): beneficio indirecto vía ánimo. **[M]**

## Decisiones derivadas

| Evidencia | Decisión en ShipNLearn |
| --- | --- |
| Recuperación + feedback | Cada nivel es construir; checklist con `explain` |
| Fading / Parsons | Modos `tiles` → `fill` → `code` por mundo |
| Mastery | Siguiente nivel exige ⭐; reintentos sin castigo |
| Ficción | Archipiélago, NPCs, islas que evolucionan |
| Sobrejustificación | Estrellas/XP como información; sin badges por todo |
| Leaderboards dañinos | Sin leaderboards en v1 |
| Espaciado + intercalado | Mareas a +1/+3/+7 días mezclando conceptos |
| Música y lectura | Instrumental; enérgica en mapa, atenuada en el editor |

Sin evidencia publicada sobre Flexbox Froggy y similares **[D]**: medir el propio producto (retención, test de transferencia).
