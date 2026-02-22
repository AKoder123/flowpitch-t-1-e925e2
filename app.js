'use strict';

// Load content.json and render slides
(async function(){
  try{
    const res = await fetch('content.json');
    const data = await res.json();
    const slides = data.slides || [];
    const slideEl = document.getElementById('slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const idxEl = document.getElementById('slideIndex');
    const progressBar = document.getElementById('progressBar');
    const toggleNotes = document.getElementById('toggleNotes');

    let index = 0;

    function render(){
      const s = slides[index];
      slideEl.innerHTML = '';
      const container = document.createElement('div');
      container.className = 'inner';

      const title = document.createElement(s.type && s.type === 'cover' ? 'h1' : 'h1');
      title.textContent = s.title || '';
      container.appendChild(title);

      if(s.subtitle){
        const sub = document.createElement('h2');
        sub.textContent = s.subtitle;
        container.appendChild(sub);
      }

      const content = document.createElement('div');
      content.className = 'content';

      if(s.body && s.body.length){
        const ul = document.createElement('ul');
        s.body.forEach(function(b){
          const li = document.createElement('li');
          li.textContent = b;
          ul.appendChild(li);
        });
        content.appendChild(ul);
      } else if(s.note){
        const p = document.createElement('p');
        p.textContent = s.note;
        content.appendChild(p);
      }

      container.appendChild(content);

      if(s.timing){
        const t = document.createElement('div');
        t.className = 'time small';
        t.textContent = s.timing;
        container.appendChild(t);
      }

      const note = document.createElement('div');
      note.className = 'note';
      note.id = 'speakerNote';
      note.textContent = s.speaker_line || '';
      container.appendChild(note);

      slideEl.appendChild(container);

      // update footer
      idxEl.textContent = (index+1) + ' / ' + slides.length;
      progressBar.style.width = Math.round(((index+1)/slides.length)*100) + '%';

      // show/hide note button text
      const shown = note.style.display === 'block';
      toggleNotes.textContent = shown ? 'Hide speaker line' : 'Show speaker line';
    }

    function showNoteToggle(){
      const note = document.getElementById('speakerNote');
      if(!note) return;
      if(note.style.display === 'block'){
        note.style.display = 'none';
        toggleNotes.textContent = 'Show speaker line';
      } else {
        note.style.display = 'block';
        toggleNotes.textContent = 'Hide speaker line';
      }
    }

    prevBtn.addEventListener('click', function(){ index = Math.max(0, index-1); render(); });
    nextBtn.addEventListener('click', function(){ index = Math.min(slides.length-1, index+1); render(); });
    toggleNotes.addEventListener('click', showNoteToggle);

    // touch swipe
    let touchStartX = null;
    slideEl.addEventListener('touchstart', function(e){ touchStartX = e.changedTouches[0].screenX; }, {passive:true});
    slideEl.addEventListener('touchend', function(e){
      if(touchStartX === null) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      if(dx > 40){ prevBtn.click(); }
      if(dx < -40){ nextBtn.click(); }
      touchStartX = null;
    }, {passive:true});

    // keyboard focus
    prevBtn.tabIndex = 0; nextBtn.tabIndex = 0; toggleNotes.tabIndex = 0;

    // initial render
    render();

  }catch(err){
    document.getElementById('slide').innerHTML = '<p style="padding:24px;color:#b33;">Failed to load content.json — open console for details.</p>';
    console.error(err);
  }
})();
