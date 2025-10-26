# 📁 Pasta Media — Bebida Selada® v4.9V Cinematic Master Edition

Esta pasta contém **placeholders** para todos os elementos de mídia (vídeos, imagens, áudios e animações Lottie) utilizados no site.

## 🎬 Vídeos

- **video-hero.mp4** — Vídeo de fundo da seção Hero, loop suave com movimento de fumaça dourada
- **video-representantes.mp4** — Vídeo de fundo da seção Representantes Digitais com movimento horizontal

**Especificações técnicas:**
- Formato: MP4 (H.264)
- Resolução: 1920x1080 (Full HD)
- Taxa de bits: 5-8 Mbps
- FPS: 30fps
- Duração: 10-20 segundos em loop
- Otimizado para web com compressão eficiente

## 🖼️ Imagens

- **img-consumidor.jpg** — Imagem de consumidor verificando bebida (overlay dourado suave)
- **img-estabelecimento.jpg** — Imagem de estabelecimento certificado com selo visível
- **img-cidade.jpg** — Imagem de gestor e comerciante (aperto de mão institucional)
- **img-faq.jpg** — Selo Bebida Selada® sobre fundo escuro premium

**Especificações técnicas:**
- Formato: JPEG otimizado
- Resolução: 1920x1080 ou superior
- Qualidade: 85-90%
- Tamanho: < 300KB por imagem
- Lazy loading habilitado

## 🔊 Áudios

### Ambiente e Background
- **audio-hero.mp3** — Som ambiente leve para o Hero (loop)
- **audio-bar.mp3** — Som ambiente sutil de estabelecimento (loop)
- **audio-connect.mp3** — Pulso digital baixo volume para conexões (loop)
- **audio-pulse.mp3** — Ritmo sonar sincronizado com contadores (loop)

### Interações
- **audio-scan.mp3** — Bip digital suave para scanner
- **audio-hover.mp3** — Click digital leve para hover nos planos
- **audio-camera.mp3** — Click de câmera fotográfica
- **audio-notify.mp3** — Ping discreto de notificação
- **audio-ping.mp3** — Som leve para WhatsApp CTA

### Modal de Auditoria
- **audio-progress.mp3** — Som de processamento durante auditoria (loop)
- **audio-confirm.mp3** — Som metálico sutil de confirmação

**Especificações técnicas:**
- Formato: MP3
- Taxa de bits: 128 kbps
- Sample rate: 44.1 kHz
- Duração: 0.5-3 segundos (exceto loops)
- Volume inicial: muted, ativação via JavaScript
- Todos os sons começam silenciados para compliance com políticas de autoplay

## 🎨 Animações Lottie

- **map-network.json** — Animação do mapa do Brasil com conexões douradas da rede
- **impacto.json** — Animação de números crescendo (contadores de impacto)

**Especificações técnicas:**
- Formato: JSON Lottie
- Tamanho: < 100KB por animação
- FPS: 30-60fps
- Otimizado para performance web
- Player: @lottiefiles/lottie-player (carregado via CDN)

## 📝 Ícones SVG (já implementados inline)

Os ícones dos planos (shield, circle check, star) foram implementados diretamente no HTML como SVG inline com gradientes dourados personalizados.

## 🎯 Implementação

Todos os elementos de mídia estão referenciados no código com:
- Lazy loading para imagens (`loading="lazy"`)
- Autoplay com muted para vídeos
- Audio com controle via JavaScript (IntersectionObserver)
- Fallbacks visuais durante carregamento

## 🚀 Performance

- Todas as mídias devem ser otimizadas antes do deploy
- Recomenda-se usar CDN para distribuição
- Considerar formatos modernos (WebP para imagens, WebM para vídeos)
- Implementar cache estratégico no Service Worker

---

**Bebida Selada® v4.9V — Cinematic Master Edition**  
*Confiança que se vê*


