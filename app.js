const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];
const fmtDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtHuman = iso => {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
};

const state = {
  today: new Date(),
  cursor: new Date(),
  selectedDateISO: null,
  selectedMood: null,
  praise: ''
};

// 헤더 날짜
function setHeader(){
  $('#headerDate').textContent = fmtHuman(state.today);
}

// 캘린더 렌더링
function renderCalendar(){
  const y = state.cursor.getFullYear();
  const m = state.cursor.getMonth();
  $('#calTitle').textContent = `${y}년 ${m+1}월`;

  const first = new Date(y,m,1);
  const last = new Date(y,m+1,0);
  const grid = $('#calGrid');
  grid.innerHTML = '';

  for(let i=0;i<first.getDay();i++){
    const div=document.createElement('div');
    div.className='cell empty';
    grid.appendChild(div);
  }

  for(let d=1;d<=last.getDate();d++){
    const iso = fmtDate(new Date(y,m,d));
    const div = document.createElement('div');
    div.className='cell';
    div.textContent=d;
    if(iso===fmtDate(state.today)) div.classList.add('today');
    if(iso===state.selectedDateISO) div.classList.add('selected');
    div.addEventListener('click', ()=>{
      state.selectedDateISO = iso;
      goMood();
    });
    grid.appendChild(div);
  }
}

// 화면 전환
function show(tab){
  $$('.view').forEach(v=>v.classList.remove('active'));
  $('#view-'+tab).classList.add('active');
  $$('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
}

// 감정 화면
function goMood(){
  show('mood');
  $('#selectedDateText').textContent = fmtHuman(state.selectedDateISO);

  // 날짜 바뀌면 감정, 칭찬 초기화
  state.selectedMood = null;
  state.praise = '';
  $$('#view-mood input[name="mood"]').forEach(r=>r.checked=false);
  $('#praise').value='';
  $('#praiseCount').textContent='0';
}

// 초기화
function init(){
  setHeader();
  state.selectedDateISO = fmtDate(state.today);
  renderCalendar();

  // 버튼 이벤트
  $('#prevMonth').addEventListener('click', ()=>{
    state.cursor.setMonth(state.cursor.getMonth()-1);
    renderCalendar();
  });
  $('#nextMonth').addEventListener('click', ()=>{
    state.cursor.setMonth(state.cursor.getMonth()+1);
    renderCalendar();
  });

  $('#praise').addEventListener('input', e=>{
    $('#praiseCount').textContent = e.target.value.length;
  });
  $('#goWrite').addEventListener('click', ()=>{
    if(!state.selectedDateISO) return alert('날짜를 선택하세요');
    show('write');
    $('#writeDate').textContent = fmtHuman(state.selectedDateISO);
  });

  $$('.tab').forEach(t=>t.addEventListener('click', ()=>show(t.dataset.tab)));
}
document.addEventListener('DOMContentLoaded', init);
