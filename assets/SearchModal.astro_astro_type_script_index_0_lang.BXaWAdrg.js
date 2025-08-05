var o=Object.defineProperty;var n=(i,e,t)=>e in i?o(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var a=(i,e,t)=>n(i,typeof e!="symbol"?e+"":e,t);class d{constructor(){a(this,"modal");a(this,"input");a(this,"resultsContainer");a(this,"loadingState");a(this,"emptyState");a(this,"noResultsState");a(this,"resultsList");a(this,"selectedIndex",-1);a(this,"searchTimeout",null);a(this,"searchData",[]);this.modal=document.getElementById("search-modal"),this.input=document.querySelector("[data-search-input]"),this.resultsContainer=document.querySelector("[data-search-results]"),this.loadingState=document.querySelector("[data-search-loading]"),this.emptyState=document.querySelector("[data-search-empty]"),this.noResultsState=document.querySelector("[data-search-no-results]"),this.resultsList=document.querySelector("[data-search-results-list]"),this.init(),this.loadSearchData()}init(){document.querySelector("[data-search-close]")?.addEventListener("click",()=>this.close()),document.querySelector("[data-search-backdrop]")?.addEventListener("click",()=>this.close()),this.input.addEventListener("input",e=>this.handleInput(e)),this.input.addEventListener("keydown",e=>this.handleKeydown(e)),document.addEventListener("keydown",e=>this.handleGlobalKeydown(e)),document.querySelectorAll('[id*="search-button"]').forEach(e=>{e.addEventListener("click",()=>this.open())})}async loadSearchData(){try{this.searchData=[{title:"Getting Started with Astro",url:"/blog/getting-started-astro",excerpt:"Learn how to build fast, modern websites with Astro's island architecture.",type:"post",date:"2024-01-15",tags:["astro","javascript","web-development"]},{title:"React vs Vue: A Comparison",url:"/blog/react-vs-vue",excerpt:"Comparing two popular frontend frameworks and their use cases.",type:"post",date:"2024-01-10",tags:["react","vue","comparison"]}]}catch(e){console.error("Failed to load search data:",e)}}open(){this.modal.classList.remove("hidden"),this.input.focus(),document.body.style.overflow="hidden"}close(){this.modal.classList.add("hidden"),this.input.value="",this.selectedIndex=-1,this.showEmptyState(),document.body.style.overflow=""}handleInput(e){const t=e.target.value.trim();this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout(()=>{t.length===0?this.showEmptyState():t.length>=2&&this.performSearch(t)},150)}handleKeydown(e){switch(e.key){case"Escape":e.preventDefault(),this.close();break;case"ArrowDown":e.preventDefault(),this.navigateResults(1);break;case"ArrowUp":e.preventDefault(),this.navigateResults(-1);break;case"Enter":e.preventDefault(),this.selectResult();break}}handleGlobalKeydown(e){(e.metaKey||e.ctrlKey)&&e.key==="k"?(e.preventDefault(),this.open()):e.key==="/"&&!e.target?.matches("input, textarea, [contenteditable]")?(e.preventDefault(),this.open()):e.key==="Escape"&&!this.modal.classList.contains("hidden")&&this.close()}performSearch(e){this.showLoadingState(),setTimeout(()=>{const t=this.searchData.filter(s=>s.title.toLowerCase().includes(e.toLowerCase())||s.excerpt.toLowerCase().includes(e.toLowerCase())||s.tags?.some(r=>r.toLowerCase().includes(e.toLowerCase())));t.length===0?this.showNoResultsState(e):this.showResults(t,e)},100)}showEmptyState(){this.hideAllStates(),this.emptyState.classList.remove("hidden")}showLoadingState(){this.hideAllStates(),this.loadingState.classList.remove("hidden")}showNoResultsState(e){this.hideAllStates(),this.noResultsState.classList.remove("hidden");const t=this.noResultsState.querySelector("[data-search-query]");t&&(t.textContent=`"${e}"`)}showResults(e,t){this.hideAllStates(),this.resultsList.classList.remove("hidden"),this.selectedIndex=-1,this.resultsList.innerHTML=e.map((s,r)=>`
        <div class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0" data-result-index="${r}">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 mt-1">
              ${s.type==="post"?`
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12c0-4.411-3.589-8-8-8s-8 3.589-8 8c0 1.76.57 3.384 1.535 4.708L2 21l4.292-3.465A7.952 7.952 0 0012 20c4.411 0 8-3.589 8-8h-8z" />
                </svg>
              `:`
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              `}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                ${this.highlightQuery(s.title,t)}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                ${this.highlightQuery(s.excerpt,t)}
              </p>
              ${s.date?`
                <div class="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span>${new Date(s.date).toLocaleDateString()}</span>
                  ${s.tags?`
                    <span>•</span>
                    <div class="flex gap-1">
                      ${s.tags.slice(0,2).map(l=>`
                        <span class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">${l}</span>
                      `).join("")}
                    </div>
                  `:""}
                </div>
              `:""}
            </div>
            <div class="flex-shrink-0">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      `).join(""),this.resultsList.querySelectorAll("[data-result-index]").forEach((s,r)=>{s.addEventListener("click",()=>{window.location.href=e[r].url})})}hideAllStates(){this.emptyState.classList.add("hidden"),this.loadingState.classList.add("hidden"),this.noResultsState.classList.add("hidden"),this.resultsList.classList.add("hidden")}navigateResults(e){const t=this.resultsList.querySelectorAll("[data-result-index]");if(t.length===0)return;this.selectedIndex>=0&&t[this.selectedIndex].classList.remove("bg-primary-50","dark:bg-primary-900/20"),this.selectedIndex+=e,this.selectedIndex<0?this.selectedIndex=t.length-1:this.selectedIndex>=t.length&&(this.selectedIndex=0);const s=t[this.selectedIndex];s.classList.add("bg-primary-50","dark:bg-primary-900/20"),s.scrollIntoView({block:"nearest"})}selectResult(){if(this.selectedIndex>=0){const e=this.resultsList.querySelector(`[data-result-index="${this.selectedIndex}"]`);e&&e.click()}}highlightQuery(e,t){if(!t)return e;const s=new RegExp(`(${t})`,"gi");return e.replace(s,'<mark class="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">$1</mark>')}}document.addEventListener("DOMContentLoaded",()=>{new d});
