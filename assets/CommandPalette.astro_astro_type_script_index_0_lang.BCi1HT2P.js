class c{constructor(){this.isOpen=!1,this.selectedIndex=0,this.filteredCommands=[],this.stats={visits:parseInt(localStorage.getItem("site-visits")||"0"),timeSpent:parseInt(localStorage.getItem("time-spent")||"0"),commandsUsed:parseInt(localStorage.getItem("commands-used")||"0"),easterEggsFound:parseInt(localStorage.getItem("easter-eggs")||"0")},this.commands=[{id:"home",title:"Go to Home",description:"Navigate to the homepage",category:"Navigation",icon:"🏠",shortcut:"gh",action:()=>window.location.href="/"},{id:"blog",title:"Go to Blog",description:"Browse all blog posts",category:"Navigation",icon:"📝",shortcut:"gb",action:()=>window.location.href="/blog"},{id:"about",title:"About Page",description:"Learn more about me",category:"Navigation",icon:"👤",shortcut:"ga",action:()=>window.location.href="/about"},{id:"theme-toggle",title:"Toggle Theme",description:"Switch between light and dark mode",category:"Appearance",icon:"🌙",shortcut:"td",action:()=>{const e=document.getElementById("theme-toggle");e&&e.click()}},{id:"theme-light",title:"Light Mode",description:"Switch to light theme",category:"Appearance",icon:"☀️",action:()=>{document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light")}},{id:"theme-dark",title:"Dark Mode",description:"Switch to dark theme",category:"Appearance",icon:"🌙",action:()=>{document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")}},{id:"konami",title:"Konami Code",description:"Activate the legendary cheat code",category:"Easter Eggs",icon:"🎮",action:()=>this.triggerKonami()},{id:"celebrate",title:"Celebrate",description:"Add some confetti to your day",category:"Easter Eggs",icon:"🎉",action:()=>this.createCelebration()},{id:"sparkles",title:"Sparkle Effect",description:"Make everything sparkle ✨",category:"Easter Eggs",icon:"✨",action:()=>this.addSparkles()},{id:"rainbow",title:"Rainbow Mode",description:"Add rainbow colors everywhere",category:"Easter Eggs",icon:"🌈",action:()=>this.activateRainbow()},{id:"scroll-top",title:"Scroll to Top",description:"Jump to the top of the page",category:"Utilities",icon:"⬆️",shortcut:"st",action:()=>window.scrollTo({top:0,behavior:"smooth"})},{id:"scroll-bottom",title:"Scroll to Bottom",description:"Jump to the bottom of the page",category:"Utilities",icon:"⬇️",shortcut:"sb",action:()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})},{id:"copy-url",title:"Copy URL",description:"Copy current page URL to clipboard",category:"Utilities",icon:"🔗",shortcut:"cu",action:()=>{navigator.clipboard.writeText(window.location.href),this.showToast("URL copied to clipboard! 📋")}},{id:"print",title:"Print Page",description:"Print the current page",category:"Utilities",icon:"🖨️",action:()=>window.print()},{id:"stats",title:"Site Statistics",description:"View your browsing stats",category:"Developer",icon:"📊",action:()=>this.showStats()},{id:"console",title:"Open Console",description:"Open browser developer console",category:"Developer",icon:"🛠️",action:()=>{console.log("Welcome to the developer console! 👨‍💻"),this.showToast("Check the console! 🛠️")}},{id:"clear-storage",title:"Clear Local Storage",description:"Clear all stored data",category:"Developer",icon:"🗑️",action:()=>{confirm("Are you sure you want to clear all local storage?")&&(localStorage.clear(),this.showToast("Local storage cleared! 🧹"))}},{id:"search",title:"Search Site",description:"Search through all content",category:"Search",icon:"🔍",shortcut:"/",action:()=>{const e=document.querySelector('input[type="search"]');e?e.focus():this.showToast("Search not available on this page")}},{id:"random-post",title:"Random Blog Post",description:"Go to a random blog post",category:"Navigation",icon:"🎲",action:()=>this.goToRandomPost()}],this.init()}init(){this.createPalette(),this.setupEventListeners(),this.updateStats()}createPalette(){if(this.palette=document.getElementById("command-palette"),this.input=document.getElementById("command-input"),this.commandsList=document.getElementById("commands-list"),!this.palette){console.warn("Command palette not found in DOM");return}this.renderCommands()}setupEventListeners(){document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key==="k"&&(t.preventDefault(),this.toggle()),t.key==="Escape"&&this.isOpen&&this.close(),this.isOpen&&(t.key==="ArrowDown"&&(t.preventDefault(),this.selectNext()),t.key==="ArrowUp"&&(t.preventDefault(),this.selectPrevious()),t.key==="Enter"&&(t.preventDefault(),this.executeSelected()))});let e="";document.addEventListener("keypress",t=>{this.isOpen||t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA"||(e+=t.key,e.endsWith("//")&&(this.open(),e=""),setTimeout(()=>{e=""},2e3))}),this.input&&this.input.addEventListener("input",t=>{this.handleSearch(t.target.value)}),this.palette&&this.palette.addEventListener("click",t=>{t.target===this.palette&&this.close()})}handleSearch(e){if(!e.trim())this.filteredCommands=this.commands;else{const t=e.toLowerCase();this.filteredCommands=this.commands.filter(o=>o.title.toLowerCase().includes(t)||o.description.toLowerCase().includes(t)||o.category.toLowerCase().includes(t)||o.shortcut&&o.shortcut.toLowerCase().includes(t))}this.selectedIndex=0,this.renderCommands()}renderCommands(){if(!this.commandsList)return;const e=this.filteredCommands.length?this.filteredCommands:this.commands,t=this.groupCommandsByCategory(e);let o="";Object.entries(t).forEach(([s,a])=>{o+=`<div class="command-category">${s}</div>`,a.forEach((i,h)=>{const n=e.indexOf(i),d=n===this.selectedIndex;o+=`
            <div class="command-item flex items-center gap-3 px-4 py-3 cursor-pointer ${d?"selected":""}" data-index="${n}">
              <span class="command-icon text-lg">${i.icon}</span>
              <div class="flex-1">
                <div class="font-medium text-gray-800 dark:text-gray-200">${i.title}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${i.description}</div>
              </div>
              ${i.shortcut?`<div class="kbd">${i.shortcut}</div>`:""}
            </div>
          `})}),this.commandsList.innerHTML=o,this.commandsList.querySelectorAll(".command-item").forEach(s=>{s.addEventListener("click",()=>{const a=parseInt(s.dataset.index);this.selectedIndex=a,this.executeSelected()})})}groupCommandsByCategory(e){return e.reduce((t,o)=>{const s=o.category||"Other";return t[s]||(t[s]=[]),t[s].push(o),t},{})}selectNext(){const e=this.filteredCommands.length?this.filteredCommands:this.commands;this.selectedIndex=(this.selectedIndex+1)%e.length,this.renderCommands()}selectPrevious(){const e=this.filteredCommands.length?this.filteredCommands:this.commands;this.selectedIndex=this.selectedIndex===0?e.length-1:this.selectedIndex-1,this.renderCommands()}executeSelected(){const t=(this.filteredCommands.length?this.filteredCommands:this.commands)[this.selectedIndex];t&&t.action&&(t.action(),this.incrementStat("commandsUsed"),this.close())}open(){this.palette&&(this.isOpen=!0,this.palette.classList.remove("hidden"),this.palette.classList.add("show"),this.input&&(this.input.focus(),this.input.value=""),this.filteredCommands=this.commands,this.selectedIndex=0,this.renderCommands())}close(){this.palette&&(this.isOpen=!1,this.palette.classList.add("hidden"),this.palette.classList.remove("show"))}toggle(){this.isOpen?this.close():this.open()}triggerKonami(){document.body.style.animation="rainbow-bg 3s infinite",this.showToast("🎮 Konami Code Activated! 🌈"),this.incrementStat("easterEggsFound"),setTimeout(()=>{document.body.style.animation=""},1e4)}createCelebration(){for(let e=0;e<50;e++)setTimeout(()=>{const t=["🎉","🎊","✨","🎈","🌟"][Math.floor(Math.random()*5)],o=document.createElement("div");o.textContent=t,o.style.cssText=`
            position: fixed;
            left: ${Math.random()*100}%;
            top: ${Math.random()*100}%;
            font-size: 24px;
            pointer-events: none;
            z-index: 9999;
            animation: celebrate 3s ease-out forwards;
          `,document.body.appendChild(o),setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},3e3)},e*50);this.showToast("🎉 Celebration time! 🎊"),this.incrementStat("easterEggsFound")}addSparkles(){for(let e=0;e<20;e++)setTimeout(()=>{const t=document.createElement("div");t.textContent="✨",t.style.cssText=`
            position: fixed;
            left: ${Math.random()*100}%;
            top: ${Math.random()*100}%;
            font-size: 16px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkle 2s ease-out forwards;
          `,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},2e3)},e*100);this.showToast("✨ Sparkles everywhere! ✨"),this.incrementStat("easterEggsFound")}activateRainbow(){const e=document.createElement("style");e.innerHTML=`
        @keyframes rainbow-bg {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .rainbow-active {
          animation: rainbow-bg 3s linear infinite;
        }
      `,document.head.appendChild(e),document.body.classList.add("rainbow-active"),this.showToast("🌈 Rainbow mode activated! 🌈"),this.incrementStat("easterEggsFound"),setTimeout(()=>{document.body.classList.remove("rainbow-active"),e.parentNode&&e.parentNode.removeChild(e)},1e4)}goToRandomPost(){const e=["/blog","/blog/example-post"],t=e[Math.floor(Math.random()*e.length)];window.location.href=t}showStats(){const e=`
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">📊 Your Site Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Visits:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">${this.stats.visits}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Commands Used:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">${this.stats.commandsUsed}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Easter Eggs Found:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">${this.stats.easterEggsFound}</span>
              </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      `,t=document.createElement("div");t.innerHTML=e,document.body.appendChild(t)}updateStats(){this.incrementStat("visits");const e=Date.now();window.addEventListener("beforeunload",()=>{const t=Math.floor((Date.now()-e)/1e3);this.incrementStat("timeSpent",t)})}incrementStat(e,t=1){this.stats[e]+=t,localStorage.setItem(e==="visits"?"site-visits":e==="timeSpent"?"time-spent":e==="commandsUsed"?"commands-used":"easter-eggs",this.stats[e].toString())}showToast(e,t=3e3){const o=document.createElement("div");o.textContent=e,o.style.cssText=`
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      `,document.body.appendChild(o),setTimeout(()=>{o.style.transform="translateX(0)"},100),setTimeout(()=>{o.style.transform="translateX(100%)",setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},300)},t)}}const l=`
    @keyframes celebrate {
      0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
      100% { opacity: 0; transform: translateY(-100px) scale(0.5) rotate(360deg); }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }
  `,r=document.createElement("style");r.textContent=l;document.head.appendChild(r);document.addEventListener("DOMContentLoaded",()=>{new c});
