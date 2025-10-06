// Slide Navigation System
class SlideManager {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 7;
    this.slides = document.querySelectorAll('.slide');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.slideCounter = document.getElementById('slide-counter');
    this.notesAreas = document.querySelectorAll('#shared-notes');
    
    this.initEventListeners();
    this.updateSlideDisplay();
    this.loadSharedNotes();
    this.syncNotesAreas();
  }
  
  initEventListeners() {
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Save shared notes automatically for all textarea elements
    this.notesAreas.forEach((area) => {
      area.addEventListener('input', (e) => {
        this.saveSharedNotes(e.target.value);
        this.syncNotesAreas(e.target.value);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && !this.prevBtn.disabled) {
        this.previousSlide();
      } else if (e.key === 'ArrowRight' && !this.nextBtn.disabled) {
        this.nextSlide();
      }
    });
  }
  
  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.currentSlide++;
      this.updateSlideDisplay();
    }
  }
  
  previousSlide() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
      this.updateSlideDisplay();
    }
  }
  
  updateSlideDisplay() {
    // Hide all slides
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
    if (currentSlideElement) {
      currentSlideElement.classList.add('active');
    }
    
    // Update navigation buttons
    this.prevBtn.disabled = this.currentSlide === 1;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    
    // Update counter
    this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    
    // Initialize code editor on practice slide
    if (this.currentSlide === 7 && document.getElementById('html-editor')) {
      setTimeout(() => new CodeEditor(), 100);
    }
    
    // Initialize HTML tags practice on slide 5
    if (this.currentSlide === 5 && document.getElementById('html-tags-editor')) {
      setTimeout(() => initHTMLTagsPractice(), 100);
    }
    
    // Initialize CSS styles practice on slide 6
    if (this.currentSlide === 6 && document.getElementById('css-styles-editor')) {
      setTimeout(() => initCSSStylesPractice(), 100);
    }
  }
  
  saveSharedNotes(content) {
    localStorage.setItem('shared_notes', content);
  }
  
  loadSharedNotes() {
    const savedNotes = localStorage.getItem('shared_notes');
    if (savedNotes) {
      this.syncNotesAreas(savedNotes);
    }
  }
  
  syncNotesAreas(content) {
    this.notesAreas.forEach((area) => {
      if (content !== undefined) {
        area.value = content;
      }
    });
  }
}

// Interactive Code Editor
class CodeEditor {
  constructor() {
    this.htmlEditor = document.getElementById('html-editor');
    this.cssEditor = document.getElementById('css-editor');
    this.jsEditor = document.getElementById('js-editor');
    this.preview = document.getElementById('preview');
    this.runBtn = document.getElementById('run-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.editors = document.querySelectorAll('.editor');
    
    // Check if elements exist before initializing
    if (!this.htmlEditor || !this.cssEditor || !this.jsEditor) {
      return;
    }
    
    this.initEventListeners();
    this.runCode();
  }
  
  initEventListeners() {
    // Tab switching
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
    
    // Action buttons
    this.runBtn?.addEventListener('click', () => this.runCode());
    this.resetBtn?.addEventListener('click', () => this.resetCode());
    
    // Auto-run on code change (with delay)
    [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
      let timeout;
      editor.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.runCode(), 1000);
      });
    });
  }
  
  switchTab(tabName) {
    // Remove active classes
    this.tabBtns.forEach(btn => btn.classList.remove('active'));
    this.editors.forEach(editor => editor.classList.remove('active'));
    
    // Add active classes
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}-editor`)?.classList.add('active');
  }
  
  runCode() {
    const html = this.htmlEditor.value;
    const css = this.cssEditor.value;
    const js = this.jsEditor.value;
    
    // Create full HTML document
    const fullCode = `
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Попередній перегляд</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch(e) {
            console.error('Помилка в JavaScript:', e);
            document.body.innerHTML += '<div style="color: red; padding: 10px; background: #ffe6e6; margin: 10px; border-radius: 5px;">Помилка в JavaScript: ' + e.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;
    
    // Update iframe
    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.preview.src = url;
    
    // Clean up URL after loading
    this.preview.onload = () => {
      URL.revokeObjectURL(url);
    };
  }
  
  resetCode() {
    // Reset to initial values
    this.htmlEditor.value = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Мій сайт</title>
</head>
<body>
  <h1>Привіт, світ!</h1>
  <p>Це мій перший сайт!</p>
</body>
</html>`;
    
    this.cssEditor.value = `body {
  background: black;
  color: lime;
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}`;
    
    this.jsEditor.value = `document.body.addEventListener("click", () => {
  alert("Ти натиснув на сайт!");
});`;
    
    this.runCode();
  }
}

// HTML Tags Practice Check Functions
function checkTask1() {
  const editor = document.getElementById('html-tags-editor');
  const resultDiv = document.getElementById('task1-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasH1 = code.includes('<h1>') && code.includes('</h1>');
  const hasH2 = code.includes('<h2>') && code.includes('</h2>');
  const hasH3 = code.includes('<h3>') && code.includes('</h3>');
  
  if (hasH1 && hasH2 && hasH3) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Відмінно! Ти правильно використав заголовки h1, h2 та h3!';
  } else {
    const missing = [];
    if (!hasH1) missing.push('h1');
    if (!hasH2) missing.push('h2');
    if (!hasH3) missing.push('h3');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати заголовки: ${missing.join(', ')}. Використай теги &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;`;
  }
}

function checkTask2() {
  const editor = document.getElementById('html-tags-editor');
  const resultDiv = document.getElementById('task2-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasUl = code.includes('<ul>') && code.includes('</ul>');
  const hasOl = code.includes('<ol>') && code.includes('</ol>');
  const hasLi = code.includes('<li>') && code.includes('</li>');
  
  if (hasUl && hasOl && hasLi) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Чудово! Ти створив і нумерований, і ненумерований списки!';
  } else {
    const missing = [];
    if (!hasUl) missing.push('&lt;ul&gt; (ненумерований список)');
    if (!hasOl) missing.push('&lt;ol&gt; (нумерований список)');
    if (!hasLi) missing.push('&lt;li&gt; (елементи списку)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function checkTask3() {
  const editor = document.getElementById('html-tags-editor');
  const resultDiv = document.getElementById('task3-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasLink = code.includes('<a') && code.includes('href=') && code.includes('</a>');
  const hasHttp = code.includes('http://') || code.includes('https://');
  
  if (hasLink && hasHttp) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Супер! Ти правильно створив посилання на зовнішній сайт!';
  } else if (hasLink && !hasHttp) {
    resultDiv.className = 'task-result info';
    resultDiv.innerHTML = '⚠️ Посилання створено, але додай http:// або https:// до адреси';
  } else {
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = '❌ Потрібно створити посилання з тегом &lt;a href="адреса"&gt;текст&lt;/a&gt;';
  }
}

function checkTask4() {
  const editor = document.getElementById('html-tags-editor');
  const resultDiv = document.getElementById('task4-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasStrong = code.includes('<strong>') && code.includes('</strong>');
  const hasEm = code.includes('<em>') && code.includes('</em>');
  const hasBr = code.includes('<br>') || code.includes('<br/>') || code.includes('<br />');
  
  if (hasStrong && hasEm && hasBr) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Фантастично! Ти використав всі теги форматування!';
  } else {
    const missing = [];
    if (!hasStrong) missing.push('&lt;strong&gt; (жирний текст)');
    if (!hasEm) missing.push('&lt;em&gt; (курсив)');
    if (!hasBr) missing.push('&lt;br&gt; (перенос рядка)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function updateHTMLPreview() {
  const editor = document.getElementById('html-tags-editor');
  const preview = document.getElementById('html-tags-preview');
  
  if (editor && preview) {
    const html = editor.value;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    preview.src = url;
    
    preview.onload = () => {
      URL.revokeObjectURL(url);
    };
  }
}

// Clear all task results
function clearTaskResults() {
  for (let i = 1; i <= 4; i++) {
    const resultDiv = document.getElementById(`task${i}-result`);
    if (resultDiv) {
      resultDiv.className = 'task-result';
      resultDiv.innerHTML = '';
    }
  }
}

// Initialize HTML Tags Practice
function initHTMLTagsPractice() {
  const editor = document.getElementById('html-tags-editor');
  if (editor) {
    // Auto-update preview on input
    let timeout;
    editor.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateHTMLPreview, 1000);
      
      // Save HTML content for use in CSS slide
      saveHTMLContent();
      
      // Clear task results when user changes code
      clearTaskResults();
    });
    
    // Initial preview
    updateHTMLPreview();
  }
}

// CSS Styles Practice Functions
function checkCSSTask1() {
  const editor = document.getElementById('css-styles-editor');
  const resultDiv = document.getElementById('css-task1-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasColor = code.includes('color:') || code.includes('color :');
  const hasBackground = code.includes('background-color:') || code.includes('background:');
  
  if (hasColor && hasBackground) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Відмінно! Ти правильно використав кольори та фон!';
  } else {
    const missing = [];
    if (!hasColor) missing.push('color (колір тексту)');
    if (!hasBackground) missing.push('background-color або background (колір фону)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function checkCSSTask2() {
  const editor = document.getElementById('css-styles-editor');
  const resultDiv = document.getElementById('css-task2-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasWidth = code.includes('width:') || code.includes('width :');
  const hasHeight = code.includes('height:') || code.includes('height :');
  const hasMargin = code.includes('margin:') || code.includes('margin :');
  const hasPadding = code.includes('padding:') || code.includes('padding :');
  
  if (hasWidth && hasHeight && hasMargin && hasPadding) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Чудово! Ти встановив всі розміри та відступи!';
  } else {
    const missing = [];
    if (!hasWidth) missing.push('width (ширина)');
    if (!hasHeight) missing.push('height (висота)');
    if (!hasMargin) missing.push('margin (зовнішні відступи)');
    if (!hasPadding) missing.push('padding (внутрішні відступи)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function checkCSSTask3() {
  const editor = document.getElementById('css-styles-editor');
  const resultDiv = document.getElementById('css-task3-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasFontFamily = code.includes('font-family:') || code.includes('font-family :');
  const hasFontSize = code.includes('font-size:') || code.includes('font-size :');
  const hasTextAlign = code.includes('text-align:') || code.includes('text-align :');
  
  if (hasFontFamily && hasFontSize && hasTextAlign) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Супер! Ти правильно налаштував шрифти та вирівнювання!';
  } else {
    const missing = [];
    if (!hasFontFamily) missing.push('font-family (тип шрифту)');
    if (!hasFontSize) missing.push('font-size (розмір шрифту)');
    if (!hasTextAlign) missing.push('text-align (вирівнювання тексту)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function checkCSSTask4() {
  const editor = document.getElementById('css-styles-editor');
  const resultDiv = document.getElementById('css-task4-result');
  
  if (!editor || !resultDiv) return;
  
  const code = editor.value.toLowerCase();
  const hasBorder = code.includes('border:') || code.includes('border :');
  const hasBorderRadius = code.includes('border-radius:') || code.includes('border-radius :');
  const hasBoxShadow = code.includes('box-shadow:') || code.includes('box-shadow :');
  
  if (hasBorder && hasBorderRadius && hasBoxShadow) {
    resultDiv.className = 'task-result success';
    resultDiv.innerHTML = '🎉 Фантастично! Ти додав границі, заокруглення та тіні!';
  } else {
    const missing = [];
    if (!hasBorder) missing.push('border (границя)');
    if (!hasBorderRadius) missing.push('border-radius (заокруглені кути)');
    if (!hasBoxShadow) missing.push('box-shadow (тінь)');
    
    resultDiv.className = 'task-result error';
    resultDiv.innerHTML = `❌ Потрібно додати: ${missing.join(', ')}`;
  }
}

function updateCSSPreview() {
  const cssEditor = document.getElementById('css-styles-editor');
  const htmlEditor = document.getElementById('html-tags-editor');
  const htmlEditorCSS = document.getElementById('html-tags-editor-css');
  const preview = document.getElementById('css-styles-preview');
  
  if (cssEditor && preview) {
    const css = cssEditor.value;
    let htmlContent = '';
    
    // Використовуємо HTML контент з localStorage або з HTML редактора
    const savedHTML = localStorage.getItem('user_html_content');
    let html = '';
    
    if (htmlEditor && htmlEditor.value.trim()) {
      html = htmlEditor.value;
    } else if (savedHTML) {
      html = savedHTML;
    }
    
    // Оновлюємо HTML редактор на CSS слайді
    if (htmlEditorCSS && html) {
      htmlEditorCSS.value = html;
    }
    
    if (html && html.trim()) {
      // Вставляємо CSS стилі в head секцію
      if (html.includes('<head>') && html.includes('</head>')) {
        htmlContent = html.replace('</head>', `<style>${css}</style></head>`);
      } else {
        // Якщо немає head секції, додаємо її
        htmlContent = html.replace('<body>', `<head><style>${css}</style></head><body>`);
      }
    } else {
      // Fallback HTML якщо немає контенту з HTML редактора
      htmlContent = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>CSS Preview</title>
  <style>${css}</style>
</head>
<body>
  <h1>Заголовок</h1>
  <p>Це параграф тексту для демонстрації CSS стилів.</p>
  <div>Це блок з контентом.</div>
  <p>Ще один параграф для тестування.</p>
</body>
</html>`;
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    preview.src = url;
    
    preview.onload = () => {
      URL.revokeObjectURL(url);
    };
  }
}

// Clear all CSS task results
function clearCSSTaskResults() {
  for (let i = 1; i <= 4; i++) {
    const resultDiv = document.getElementById(`css-task${i}-result`);
    if (resultDiv) {
      resultDiv.className = 'task-result';
      resultDiv.innerHTML = '';
    }
  }
}

// Save HTML content to localStorage
function saveHTMLContent() {
  const htmlEditor = document.getElementById('html-tags-editor');
  if (htmlEditor) {
    localStorage.setItem('user_html_content', htmlEditor.value);
  }
}

// Load HTML content from localStorage
function loadHTMLContent() {
  const savedHTML = localStorage.getItem('user_html_content');
  if (savedHTML) {
    const htmlEditor = document.getElementById('html-tags-editor');
    if (htmlEditor) {
      htmlEditor.value = savedHTML;
    }
  }
}

// Initialize CSS Styles Practice
function initCSSStylesPractice() {
  const cssEditor = document.getElementById('css-styles-editor');
  const htmlEditor = document.getElementById('html-tags-editor');
  const htmlEditorCSS = document.getElementById('html-tags-editor-css');
  
  if (cssEditor) {
    // Завантажуємо HTML контент з попереднього слайду
    loadHTMLContent();
    
    // Auto-update preview on input
    let timeout;
    cssEditor.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateCSSPreview, 1000);
      
      // Clear task results when user changes code
      clearCSSTaskResults();
    });
    
    // Також оновлюємо попередній перегляд при зміні HTML
    if (htmlEditor) {
      htmlEditor.addEventListener('input', () => {
        saveHTMLContent();
        clearTimeout(timeout);
        timeout = setTimeout(updateCSSPreview, 1000);
      });
    }
    
    // Оновлюємо HTML редактор на CSS слайді при зміні
    if (htmlEditorCSS) {
      htmlEditorCSS.addEventListener('input', () => {
        // Оновлюємо збережений HTML контент
        localStorage.setItem('user_html_content', htmlEditorCSS.value);
        clearTimeout(timeout);
        timeout = setTimeout(updateCSSPreview, 1000);
      });
    }
    
    // Initial preview
    updateCSSPreview();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SlideManager();
  
  // Initialize HTML tags practice when slide 5 is active
  setTimeout(() => {
    if (document.querySelector('[data-slide="5"].active')) {
      initHTMLTagsPractice();
    }
  }, 100);
  
  // Initialize CSS styles practice when slide 6 is active
  setTimeout(() => {
    if (document.querySelector('[data-slide="6"].active')) {
      initCSSStylesPractice();
    }
  }, 100);
});
