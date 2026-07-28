
/* ─── Data from Django ─── */
const stageData = {
  labels: ['New', 'Contacted', 'Demo Scheduled', 'Enrolled', 'Lost'],
  values: [
    Number("{{ new_leads|default:0 }}"),
    Number("{{ contacted_leads|default:0 }}"),
    Number("{{ demo_leads|default:0 }}"),
    Number("{{ enrolled_leads|default:0 }}"),
    Number("{{ lost_leads|default:0 }}")
  ],
  colors: ['#3b82f6','#06b6d4','#f59e0b','#22c55e','#ef4444']
};

const sourceRows = [
  {% for item in source_performance %}
  {
    source: "{{ item.source }}",
    total: {{ item.total }},
    enrolled: {{ item.enrolled }},
    rate: {{ item.rate }}
  }{% if not forloop.last %},{% endif %}
  {% endfor %}
];

const totalLeads = Number("{{ total_leads|default:0 }}");

/* ─── Sparklines ─── */
function drawSparkline(id, data, color){
  const ctx = document.getElementById(id);
  if(!ctx) return;
  new Chart(ctx, {
    type:'line',
    data:{
      labels: data.map((_,i)=>i),
      datasets:[{data, borderColor:color, borderWidth:2,
                 pointRadius:0, fill:false, tension:.4}]
    },
    options:{animation:false, plugins:{legend:{display:false},tooltip:{enabled:false}},
             scales:{x:{display:false},y:{display:false}}}
  });
}
drawSparkline('sparkTotal',  [3,8,12,9,15,18,20,23],          '#3b82f6');
drawSparkline('sparkEnroll', [1,2,3,4,4,5,6,7],               '#22c55e');
drawSparkline('sparkLost',   [0,0,1,1,2,1,2,2],               '#ef4444');
drawSparkline('sparkRate',   [10,15,20,18,25,28,30,30.43],    '#0ea5e9');

/* ─── Bar Chart ─── */
new Chart(document.getElementById('leadStageChart'), {
  type:'bar',
  data:{
    labels: stageData.labels,
    datasets:[{
      label:'Leads',
      data: stageData.values,
      backgroundColor: stageData.colors,
      borderRadius: 8,
      borderSkipped: false
    }]
  },
  options:{
    responsive:true,
    plugins:{ legend:{display:false},
              tooltip:{ callbacks:{ label: ctx => ' '+ctx.parsed.y+' leads' } } },
    scales:{
      y:{ beginAtZero:true, grid:{color:'#f3f4f6'}, ticks:{color:'#9ca3af', stepSize:2} },
      x:{ grid:{display:false}, ticks:{color:'#6b7280', font:{size:12}} }
    }
  }
});

/* ─── Donut Chart ─── */
const donutLabels = stageData.labels;
const donutValues = stageData.values;
const donutColors = stageData.colors;
const totalForPct = donutValues.reduce((a,b)=>a+b,0)||1;

new Chart(document.getElementById('statusChart'), {
  type:'doughnut',
  data:{
    labels: donutLabels,
    datasets:[{data:donutValues, backgroundColor:donutColors,
               borderWidth:2, borderColor:'#fff', hoverOffset:6}]
  },
  options:{
    responsive:false,
    cutout:'65%',
    plugins:{
      legend:{display:false},
      tooltip:{callbacks:{label:ctx=>` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed/totalForPct*100)}%)`}}
    }
  },
  plugins:[{
    id:'centerText',
    beforeDraw(chart){
      const {ctx,chartArea:{left,right,top,bottom}}=chart;
      ctx.save();
      const cx=(left+right)/2, cy=(top+bottom)/2;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.font='bold 22px Arial'; ctx.fillStyle='#111827';
      ctx.fillText(totalLeads, cx, cy-8);
      ctx.font='11px Arial'; ctx.fillStyle='#9ca3af';
      ctx.fillText('Total Leads', cx, cy+12);
      ctx.restore();
    }
  }]
});

/* build legend */
const legendEl = document.getElementById('donutLegend');
donutLabels.forEach((lbl, i)=>{
  const pct = totalLeads ? Math.round(donutValues[i]/totalLeads*100) : 0;
  legendEl.innerHTML += `
    <div class="cr-legend-item">
      <div class="cr-legend-left">
        <div class="cr-legend-dot" style="background:${donutColors[i]}"></div>
        <span>${lbl}</span>
      </div>
      <span class="cr-legend-pct">${donutValues[i]} (${pct}%)</span>
    </div>`;
});

/* ─── Table + Pagination ─── */
const srcIcons = {
  'Walk-in':'fa-person-walking',
  'Referral':'fa-share-nodes',
  'Social Media':'fa-hashtag',
  'Advertisement':'fa-bullhorn',
  'Phone Enquiry':'fa-phone',
  'Website':'fa-globe'
};

let crPage = 1;

function renderTable(){
  const perPage = parseInt(document.getElementById('crShowRows').value)||10;
  const total   = sourceRows.length;
  const totalPages = Math.max(1, Math.ceil(total/perPage));
  crPage = Math.min(crPage, totalPages);

  const slice = sourceRows.slice((crPage-1)*perPage, crPage*perPage);

  const tbody = document.getElementById('crTableBody');
  tbody.innerHTML = slice.map(row=>{
    const icon  = srcIcons[row.source]||'fa-circle';
    let trendHtml;
    if(row.rate >= 50){
      trendHtml=`<span class="cr-trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +${row.rate}%</span>`;
    } else if(row.rate > 0){
      trendHtml=`<span class="cr-trend-down"><i class="fa-solid fa-arrow-trend-down"></i> -${row.rate}%</span>`;
    } else {
      trendHtml=`<span class="cr-trend-neu">— 0%</span>`;
    }
    return `<tr>
      <td><div class="cr-src-cell">
        <div class="cr-src-icon"><i class="fa-solid ${icon}"></i></div>
        ${row.source}
      </div></td>
      <td>${row.total}</td>
      <td>${row.enrolled}</td>
      <td>${row.rate}%</td>
      <td>${trendHtml}</td>
    </tr>`;
  }).join('');

  /* Pagination */
  const pag = document.getElementById('crPagination');
  pag.innerHTML='';

  const prev = document.createElement('button');
  prev.className='cr-page-btn'; prev.innerHTML='&lsaquo;';
  prev.disabled = (crPage===1);
  prev.onclick=()=>{ if(crPage>1){crPage--;renderTable();} };
  pag.appendChild(prev);

  for(let p=1;p<=totalPages;p++){
    const btn=document.createElement('button');
    btn.className='cr-page-btn'+(p===crPage?' active':'');
    btn.textContent=p;
    btn.onclick=(()=>{const pg=p;return()=>{crPage=pg;renderTable();}})();
    pag.appendChild(btn);
  }

  const next=document.createElement('button');
  next.className='cr-page-btn'; next.innerHTML='&rsaquo;';
  next.disabled=(crPage===totalPages);
  next.onclick=()=>{ if(crPage<totalPages){crPage++;renderTable();} };
  pag.appendChild(next);
}

renderTable();

/* ─── Date range dropdown logic ───
   Selecting a preset or a custom range reloads the page with
   ?start=YYYY-MM-DD&end=YYYY-MM-DD so the Django view can filter
   the queryset. On load, we read those same params back out of
   the URL to highlight the active option and label the button. */
(function(){
  const toggle   = document.getElementById('crDateToggle');
  const dropdown = document.getElementById('crDateDropdown');
  const label    = document.getElementById('crDateLabel');
  const startEl  = document.getElementById('crStartDate');
  const endEl    = document.getElementById('crEndDate');
  const applyBtn = document.getElementById('crApplyCustom');

  const fmt = d => d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const iso = d => d.toISOString().slice(0,10);

  function toggleDropdown(e){
    e.stopPropagation();
    dropdown.classList.toggle('open');
  }
  toggle.addEventListener('click', toggleDropdown);
  document.addEventListener('click', (e)=>{
    if(!dropdown.contains(e.target) && e.target!==toggle){
      dropdown.classList.remove('open');
    }
  });

  function rangeFor(key){
    const now = new Date();
    let start, end;
    switch(key){
      case 'this_month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end   = new Date(now.getFullYear(), now.getMonth()+1, 0);
        break;
      case 'last_month':
        start = new Date(now.getFullYear(), now.getMonth()-1, 1);
        end   = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last_3_months':
        start = new Date(now.getFullYear(), now.getMonth()-2, 1);
        end   = new Date(now.getFullYear(), now.getMonth()+1, 0);
        break;
      case 'last_6_months':
        start = new Date(now.getFullYear(), now.getMonth()-5, 1);
        end   = new Date(now.getFullYear(), now.getMonth()+1, 0);
        break;
      case 'this_year':
        start = new Date(now.getFullYear(), 0, 1);
        end   = new Date(now.getFullYear(), 11, 31);
        break;
      case 'all_time':
        start = null;
        end   = null;
        break;
    }
    return {start, end};
  }

  function applyRange(key){
    const {start, end} = rangeFor(key);
    const params = new URLSearchParams(window.location.search);
    if(start && end){
      params.set('start', iso(start));
      params.set('end', iso(end));
    } else {
      params.delete('start');
      params.delete('end');
    }
    params.set('range', key);
    window.location.search = params.toString();
  }

  document.querySelectorAll('.cr-date-opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      applyRange(opt.dataset.range);
    });
  });

  applyBtn.addEventListener('click', ()=>{
    if(!startEl.value || !endEl.value){
      alert('Please select both a start and end date.');
      return;
    }
    if(startEl.value > endEl.value){
      alert('Start date must be before end date.');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set('start', startEl.value);
    params.set('end', endEl.value);
    params.delete('range');
    window.location.search = params.toString();
  });

  /* Restore active state / label from current URL on load */
  const urlParams   = new URLSearchParams(window.location.search);
  const activeRange = urlParams.get('range');
  const startParam  = urlParams.get('start');
  const endParam    = urlParams.get('end');

  if(activeRange){
    const activeOpt = document.querySelector(`.cr-date-opt[data-range="${activeRange}"]`);
    if(activeOpt){
      activeOpt.classList.add('active');
      label.textContent = activeOpt.querySelector('span').textContent;
    }
  } else if(startParam && endParam){
    startEl.value = startParam;
    endEl.value   = endParam;
    label.textContent = fmt(new Date(startParam)) + ' – ' + fmt(new Date(endParam));
  } else {
    /* Default: highlight "This Month" and use server-rendered label if present */
    const defaultOpt = document.querySelector('.cr-date-opt[data-range="this_month"]');
    if(defaultOpt) defaultOpt.classList.add('active');
    {% if not range_label %}
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay  = new Date(now.getFullYear(), now.getMonth()+1, 0);
    label.textContent = fmt(firstDay)+' – '+fmt(lastDay);
    {% endif %}
  }
})();


