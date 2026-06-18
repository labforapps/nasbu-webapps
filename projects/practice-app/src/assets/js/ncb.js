/**
 * NASBU Chatbot Widget — Standalone embeddable script
 * Versión: 1.0.0
 *
 * Uso básico (pegar antes de </body>):
 *
 *   <script>
 *     window.NASBUChatbotConfig = {
 *       webhookUrl: 'https://aiborinquen.app.n8n.cloud/webhook/nasbu-chatbot',
 *       // Opcionales:
 *       title:          'Asistente NASBU',
 *       subtitle:       'En línea',
 *       greeting:       '¡Hola! Soy el asistente virtual de NASBU. ¿En qué puedo ayudarte hoy?',
 *       primaryColor:   '#2563eb',   // azul por defecto
 *       position:       'right',     // 'right' | 'left'
 *       zIndex:         9999,
 *     };
 *   </script>
 *   <script src="nasbu-chatbot-widget.js"></script>
 */

(function () {
    'use strict';
  
    /* ─────────────────────────────────────────────────────────────
       1.  CONFIGURACIÓN
    ──────────────────────────────────────────────────────────────── */
    var cfg = Object.assign(
      {
        webhookUrl:   'https://aiborinquen.app.n8n.cloud/webhook/nasbu-chatbot',
        title:        'Asistente NASBU',
        subtitle:     'En línea',
        greeting:     '¡Hola! Soy el asistente virtual de NASBU. ¿En qué puedo ayudarte hoy?',
        primaryColor: '#2563eb',
        position:     'right',
        zIndex:       9999,
      },
      window.NASBUChatbotConfig || {}
    );
  
    /* ─────────────────────────────────────────────────────────────
       2.  ESTILOS (inyectados una sola vez)
    ──────────────────────────────────────────────────────────────── */
    var STYLE_ID = 'nasbu-chatbot-styles';
    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = [
        /* Reset dentro del widget */
        '#nasbu-chatbot-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit;}',
        '#nasbu-chatbot-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;}',
  
        /* Botón flotante */
        '#nasbu-chatbot-btn{position:fixed;bottom:24px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.3);transition:transform .2s,opacity .2s;outline:none;}',
        '#nasbu-chatbot-btn:hover{transform:scale(1.1);}',
        '#nasbu-chatbot-btn svg{width:28px;height:28px;color:#fff;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
  
        /* Ventana del chat */
        '#nasbu-chatbot-window{position:fixed;bottom:92px;width:384px;height:600px;background:#fff;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;border:1px solid #e5e7eb;transition:opacity .2s,transform .2s;}',
        '#nasbu-chatbot-window.nasbu-hidden{opacity:0;pointer-events:none;transform:translateY(12px);}',
  
        /* Header */
        '#nasbu-chatbot-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;color:#fff;flex-shrink:0;}',
        '#nasbu-chatbot-header-info{display:flex;align-items:center;gap:12px;}',
        '#nasbu-chatbot-header-icon{background:rgba(255,255,255,.25);border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
        '#nasbu-chatbot-header-icon svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
        '#nasbu-chatbot-title{font-weight:600;font-size:15px;}',
        '#nasbu-chatbot-subtitle{font-size:11px;opacity:.8;margin-top:1px;}',
        '#nasbu-chatbot-close{background:transparent;border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;transition:background .15s;outline:none;}',
        '#nasbu-chatbot-close:hover{background:rgba(255,255,255,.2);}',
        '#nasbu-chatbot-close svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
  
        /* Mensajes */
        '#nasbu-chatbot-messages{flex:1;overflow-y:auto;padding:16px;background:#f9fafb;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;}',
        '#nasbu-chatbot-messages::-webkit-scrollbar{width:4px;}',
        '#nasbu-chatbot-messages::-webkit-scrollbar-track{background:transparent;}',
        '#nasbu-chatbot-messages::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px;}',
  
        '.nasbu-msg-row{display:flex;}',
        '.nasbu-msg-row.nasbu-user{justify-content:flex-end;}',
        '.nasbu-msg-row.nasbu-bot{justify-content:flex-start;}',
  
        '.nasbu-bubble{max-width:80%;padding:12px 16px;border-radius:12px;word-break:break-word;}',
        '.nasbu-user .nasbu-bubble{color:#fff;border-bottom-right-radius:3px;}',
        '.nasbu-bot .nasbu-bubble{background:#fff;color:#1f2937;border-bottom-left-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.08);}',
  
        '.nasbu-bubble-text{font-size:13px;line-height:1.55;}',
        '.nasbu-bubble-text p{margin-bottom:6px;}',
        '.nasbu-bubble-text p:last-child{margin-bottom:0;}',
        '.nasbu-bubble-text ul,.nasbu-bubble-text ol{padding-left:18px;margin-bottom:6px;}',
        '.nasbu-bubble-text li{margin-bottom:3px;}',
        '.nasbu-bubble-text strong{font-weight:600;}',
        '.nasbu-bubble-text em{font-style:italic;}',
  
        '.nasbu-ts{font-size:10px;margin-top:4px;opacity:.7;}',
        '.nasbu-user .nasbu-ts{text-align:right;}',
  
        /* Loader */
        '#nasbu-chatbot-loader{display:flex;gap:5px;padding:12px;}',
        '.nasbu-dot{width:8px;height:8px;border-radius:50%;background:#9ca3af;animation:nasbu-bounce 1s infinite ease-in-out;}',
        '.nasbu-dot:nth-child(2){animation-delay:.15s;}',
        '.nasbu-dot:nth-child(3){animation-delay:.3s;}',
        '@keyframes nasbu-bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}',
  
        /* Input */
        '#nasbu-chatbot-form{padding:12px 16px;border-top:1px solid #e5e7eb;background:#fff;display:flex;gap:8px;align-items:center;flex-shrink:0;}',
        '#nasbu-chatbot-input{flex:1;padding:9px 16px;border:1px solid #d1d5db;border-radius:24px;outline:none;font-size:13px;transition:border-color .15s,box-shadow .15s;background:#fff;color:#111827;}',
        '#nasbu-chatbot-input::placeholder{color:#9ca3af;}',
        '#nasbu-chatbot-input:focus{border-color:var(--nasbu-primary);box-shadow:0 0 0 3px rgba(37,99,235,.15);}',
        '#nasbu-chatbot-input:disabled{background:#f3f4f6;cursor:not-allowed;}',
        '#nasbu-chatbot-send{border:none;cursor:pointer;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s;outline:none;}',
        '#nasbu-chatbot-send:disabled{background:#d1d5db!important;cursor:not-allowed;}',
        '#nasbu-chatbot-send svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
      ].join('');
      document.head.appendChild(style);
    }
  
    /* ─────────────────────────────────────────────────────────────
       3.  SVG ICONOS (inline, sin dependencias)
    ──────────────────────────────────────────────────────────────── */
    function svgMessageCircle() {
      return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    }
    function svgX() {
      return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }
    function svgSend() {
      return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    }
  
    /* ─────────────────────────────────────────────────────────────
       4.  MARKDOWN BÁSICO → HTML
           Soporta: **bold**, *italic*, listas, saltos de línea
    ──────────────────────────────────────────────────────────────── */
    function markdownToHtml(text) {
      if (!text) return '';
  
      var lines = text.split('\n');
      var html = '';
      var inUl = false;
      var inOl = false;
  
      function closeList() {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
      }
  
      function inlineFormat(str) {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.+?)__/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/_(.+?)_/g, '<em>$1</em>');
      }
  
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
  
        // Unordered list
        var ulMatch = line.match(/^[\-\*\+] (.+)/);
        if (ulMatch) {
          if (inOl) { html += '</ol>'; inOl = false; }
          if (!inUl) { html += '<ul>'; inUl = true; }
          html += '<li>' + inlineFormat(ulMatch[1]) + '</li>';
          continue;
        }
  
        // Ordered list
        var olMatch = line.match(/^\d+\. (.+)/);
        if (olMatch) {
          if (inUl) { html += '</ul>'; inUl = false; }
          if (!inOl) { html += '<ol>'; inOl = true; }
          html += '<li>' + inlineFormat(olMatch[1]) + '</li>';
          continue;
        }
  
        closeList();
  
        // Blank line
        if (line.trim() === '') {
          continue;
        }
  
        html += '<p>' + inlineFormat(line) + '</p>';
      }
  
      closeList();
      return html;
    }
  
    /* ─────────────────────────────────────────────────────────────
       5.  ESTADO
    ──────────────────────────────────────────────────────────────── */
    var state = {
      isOpen:    false,
      isLoading: false,
      messages: [
        {
          id:        'init',
          text:      cfg.greeting,
          sender:    'bot',
          timestamp: new Date(),
        },
      ],
    };
  
    /* ─────────────────────────────────────────────────────────────
       6.  CONSTRUCCIÓN DEL DOM
    ──────────────────────────────────────────────────────────────── */
    var side = cfg.position === 'left' ? 'left' : 'right';
  
    var root = document.createElement('div');
    root.id = 'nasbu-chatbot-root';
    root.style.cssText = '--nasbu-primary:' + cfg.primaryColor + ';';
  
    // — Botón flotante —
    var btn = document.createElement('button');
    btn.id = 'nasbu-chatbot-btn';
    btn.setAttribute('aria-label', 'Abrir chat');
    btn.style.cssText = side + ':24px;background:' + cfg.primaryColor + ';z-index:' + cfg.zIndex + ';';
    btn.innerHTML = svgMessageCircle();
  
    // — Ventana —
    var win = document.createElement('div');
    win.id = 'nasbu-chatbot-window';
    win.classList.add('nasbu-hidden');
    win.style.cssText = side + ':24px;z-index:' + (cfg.zIndex + 1) + ';';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat ' + cfg.title);
  
    // Header
    var header = document.createElement('div');
    header.id = 'nasbu-chatbot-header';
    header.style.background = 'linear-gradient(to right,' + cfg.primaryColor + ',' + shadeColor(cfg.primaryColor, -10) + ')';
    header.innerHTML =
      '<div id="nasbu-chatbot-header-info">' +
        '<div id="nasbu-chatbot-header-icon">' + svgMessageCircle() + '</div>' +
        '<div>' +
          '<div id="nasbu-chatbot-title">' + escHtml(cfg.title) + '</div>' +
          '<div id="nasbu-chatbot-subtitle">' + escHtml(cfg.subtitle) + '</div>' +
        '</div>' +
      '</div>' +
      '<button id="nasbu-chatbot-close" aria-label="Cerrar chat">' + svgX() + '</button>';
  
    // Área de mensajes
    var msgArea = document.createElement('div');
    msgArea.id = 'nasbu-chatbot-messages';
  
    // Formulario de entrada
    var form = document.createElement('form');
    form.id = 'nasbu-chatbot-form';
    form.setAttribute('autocomplete', 'off');
  
    var input = document.createElement('input');
    input.id = 'nasbu-chatbot-input';
    input.type = 'text';
    input.placeholder = 'Escribe tu mensaje…';
    input.setAttribute('aria-label', 'Mensaje');
    // Foco al estilo CSS variable
    input.addEventListener('focus', function () {
      this.style.setProperty('border-color', cfg.primaryColor);
    });
    input.addEventListener('blur', function () {
      this.style.removeProperty('border-color');
    });
  
    var sendBtn = document.createElement('button');
    sendBtn.id = 'nasbu-chatbot-send';
    sendBtn.type = 'submit';
    sendBtn.setAttribute('aria-label', 'Enviar');
    sendBtn.style.background = cfg.primaryColor;
    sendBtn.innerHTML = svgSend();
  
    form.appendChild(input);
    form.appendChild(sendBtn);
  
    win.appendChild(header);
    win.appendChild(msgArea);
    win.appendChild(form);
  
    root.appendChild(btn);
    root.appendChild(win);
    document.body.appendChild(root);
  
    /* ─────────────────────────────────────────────────────────────
       7.  RENDER DE MENSAJES
    ──────────────────────────────────────────────────────────────── */
    function renderMessages() {
      msgArea.innerHTML = '';
      state.messages.forEach(function (msg) {
        var row = document.createElement('div');
        row.className = 'nasbu-msg-row nasbu-' + msg.sender;
  
        var bubble = document.createElement('div');
        bubble.className = 'nasbu-bubble';
        if (msg.sender === 'user') {
          bubble.style.background = cfg.primaryColor;
        }
  
        var textEl = document.createElement('div');
        textEl.className = 'nasbu-bubble-text';
        textEl.innerHTML = markdownToHtml(msg.text);
  
        var ts = document.createElement('div');
        ts.className = 'nasbu-ts';
        ts.style.color = msg.sender === 'user' ? 'rgba(255,255,255,.7)' : '#6b7280';
        ts.textContent = msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
        bubble.appendChild(textEl);
        bubble.appendChild(ts);
        row.appendChild(bubble);
        msgArea.appendChild(row);
      });
  
      // Loader de escritura
      if (state.isLoading) {
        var loaderRow = document.createElement('div');
        loaderRow.className = 'nasbu-msg-row nasbu-bot';
        loaderRow.innerHTML =
          '<div class="nasbu-bubble" style="background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);border-bottom-left-radius:3px;">' +
            '<div id="nasbu-chatbot-loader">' +
              '<div class="nasbu-dot"></div>' +
              '<div class="nasbu-dot"></div>' +
              '<div class="nasbu-dot"></div>' +
            '</div>' +
          '</div>';
        msgArea.appendChild(loaderRow);
      }
  
      msgArea.scrollTop = msgArea.scrollHeight;
    }
  
    /* ─────────────────────────────────────────────────────────────
       8.  TOGGLE VENTANA
    ──────────────────────────────────────────────────────────────── */
    function openChat() {
      state.isOpen = true;
      win.classList.remove('nasbu-hidden');
      btn.style.display = 'none';
      input.focus();
    }
  
    function closeChat() {
      state.isOpen = false;
      win.classList.add('nasbu-hidden');
      btn.style.display = 'flex';
    }
  
    btn.addEventListener('click', openChat);
    header.querySelector('#nasbu-chatbot-close').addEventListener('click', closeChat);
  
    /* ─────────────────────────────────────────────────────────────
       9.  ENVÍO DE MENSAJES
    ──────────────────────────────────────────────────────────────── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text || state.isLoading) return;
  
      state.messages.push({
        id:        Date.now().toString(),
        text:      text,
        sender:    'user',
        timestamp: new Date(),
      });
      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;
      state.isLoading = true;
      renderMessages();
  
      if (cfg.webhookUrl) {
        fetch(cfg.webhookUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ message: text, timestamp: new Date().toISOString() }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function (data) {
            var botText = data.response || data.message || 'Gracias por tu mensaje.';
            if (typeof botText === 'string') {
              try { botText = JSON.parse(botText); } catch (_) {}
              botText = String(botText).replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
            }
            pushBot(botText);
          })
          .catch(function () {
            pushBot('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.');
          });
      } else {
        // Demo: respuesta sin webhook
        setTimeout(function () {
          pushBot('Esta es una respuesta de demostración. Configura **webhookUrl** en `NASBUChatbotConfig` para conectar tu chatbot.');
        }, 900);
      }
    });
  
    function pushBot(text) {
      state.isLoading = false;
      state.messages.push({
        id:        Date.now().toString(),
        text:      text,
        sender:    'bot',
        timestamp: new Date(),
      });
      input.disabled = false;
      sendBtn.disabled = false;
      renderMessages();
      input.focus();
    }
  
    /* ─────────────────────────────────────────────────────────────
       10. RENDER INICIAL
    ──────────────────────────────────────────────────────────────── */
    renderMessages();
  
    /* ─────────────────────────────────────────────────────────────
       HELPERS
    ──────────────────────────────────────────────────────────────── */
    function escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  
    /** Oscurece un color hex en pct puntos (negativo = más oscuro). */
    function shadeColor(hex, pct) {
      var n = parseInt(hex.replace('#', ''), 16);
      var r = Math.min(255, Math.max(0, (n >> 16) + pct));
      var g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + pct));
      var b = Math.min(255, Math.max(0, (n & 0xff) + pct));
      return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }
  
    /* API pública (opcional) */
    window.NASBUChatbot = {
      open:  openChat,
      close: closeChat,
      version: '1.0.0',
    };
  })();
  