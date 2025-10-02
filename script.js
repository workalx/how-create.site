// Slide Navigation System
class SlideManager {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 5;
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
    if (this.currentSlide === 5 && document.getElementById('html-editor')) {
      setTimeout(() => new CodeEditor(), 100);
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SlideManager();
});
