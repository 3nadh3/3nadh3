// Rebuild the GitHub-safe visual assets without external image services.
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { restyle } from './profile-style.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}assets`, { recursive: true });
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const colors = { bg:'#101318', panel:'#181d25', border:'#303744', text:'#f5f7fb', muted:'#c1cad8', red:'#ff5264' };
const text = (x,y,s,size=22,fill=colors.text,weight=400,extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(s)}</text>`;
const line = (x1,y1,x2,y2,stroke=colors.border) => `<path d="M${x1} ${y1}H${x2}" transform="translate(0 ${y2-y1})" stroke="${stroke}"/>`;
async function asset(name,w,h,title,body) {
 const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="16" fill="${colors.bg}" stroke="${colors.border}"/><g font-family="Arial, Helvetica, sans-serif">${body}</g></svg>`;
 await writeFile(`${root}assets/${name}.svg`,svg);
}

await asset('profile-banner',1280,360,'Trinadh Musunuri — Software Engineer. AI agents, cloud systems, full-stack products. CMU M.S. CS, May 2027.',`
<defs><radialGradient id="glow"><stop stop-color="#612633"/><stop offset="1" stop-color="#101318"/></radialGradient></defs>
<ellipse cx="1100" cy="180" rx="220" ry="177" fill="url(#glow)"/>
<rect x="1" y="45" width="6" height="265" fill="${colors.red}"/>
${text(56,59,'SOFTWARE ENGINEER',17,colors.red,700,'letter-spacing="4"')}
${text(52,136,'TRINADH',62,colors.text,800)}${text(52,209,'MUSUNURI.',62,colors.text,800)}
${text(56,254,'AI agents. Cloud systems. Full-stack products.',25,colors.muted)}
${line(56,281,835,281)}${text(56,316,'M.S. COMPUTER SCIENCE  /  CMU  /  MAY 2027',18,colors.text,600,'letter-spacing="1"')}
<rect x="948" y="70" width="230" height="220" rx="32" fill="#19141c" stroke="#753142"/>
<path d="M1005 143l-30 36 30 36M1120 143l30 36-30 36" fill="none" stroke="${colors.red}" stroke-width="8" stroke-linecap="round"/>
${text(1064,217,'T',108,colors.red,800,'text-anchor="middle"')}
<circle cx="1178" cy="70" r="7" fill="${colors.red}"/>
`);

const sections=[['impact','Production impact','Built, shipped, measured.'],['experience','Experience','Production engineering + applied research.'],['projects','Selected projects','Explore the demos. Read the code.'],['toolkit','Engineering toolkit','The tools behind the work.'],['activity','GitHub activity','Stats, streaks, and contribution history.'],['education','Education & credentials','Always building. Always learning.']];
for(const [id,title,sub] of sections) await asset(`section-${id}`,980,100,title,`<rect x="23" y="25" width="5" height="50" rx="2" fill="${colors.red}"/>${text(47,45,title,30,colors.text,700)}${text(48,73,sub,18,colors.muted)}<circle cx="936" cy="50" r="7" fill="${colors.red}"/>`);

let impact='';
for(const [i,num,title,sub] of [[0,'4','PRODUCTION AI AGENTS','Slack · Teams · Phone'],[1,'10–20 sec','ERROR INVESTIGATION','Down from 10–15 minutes'],[2,'3','DEPLOYMENT ENVIRONMENTS','Dev · Staging · Production']]) {
 const x=24+i*316;
 impact+=`<rect x="${x}" y="22" width="300" height="181" rx="12" fill="${colors.panel}"/>${text(x+20,83,num,44,colors.red,800)}${text(x+20,127,title,15,colors.text,700,'letter-spacing=".5"')}${text(x+20,164,sub,19,colors.muted)}`;
}
await asset('impact',980,226,'4 production AI agents; error investigation reduced to 10–20 seconds from 10–15 minutes; deployed across 3 environments.',impact);

for(const [id,org,role,date,tag] of [
 ['experience-ibm','IBM','Software Engineer Intern · watsonx Orchestrate','MAY–AUGUST 2026  /  AUSTIN, TX','PRODUCTION SYSTEMS'],
 ['experience-cmu','Central Michigan University','Research Assistant · Adversarial ML & hardware security','SEPTEMBER 2025–MAY 2026  /  MOUNT PLEASANT, MI','APPLIED RESEARCH']
]) await asset(id,980,166,`${org} — ${role}. ${date}.`,`<rect x="24" y="26" width="5" height="112" rx="2" fill="${colors.red}"/>${text(48,52,tag,14,colors.red,700,'letter-spacing="2"')}${text(47,92,org,32,colors.text,700)}${text(48,123,role,22,colors.text)}${text(48,149,date,15,colors.muted)}`);

const projects=[
 ['project-cyberguard','CyberGuard XAI','EXPLAINABLE AI','Understand the prediction.',['Phishing detection','LIME + SHAP explanations'],'shield'],
 ['project-skillswap','SkillSwap','FULL-STACK PRODUCT','Learn together. Build together.',['Peer skill exchange','Real-time messaging'],'network'],
 ['project-msumpai','M-Sum-PAI','MULTIMODAL AI','Turn content into clarity.',['Text · audio · video · PDFs','Transcription + summaries'],'wave'],
 ['project-portfolio','Portfolio + Jambo','CONVERSATIONAL AI','Explore the story behind the code.',['A Netflix-inspired portfolio','Contextual chat + follow-ups'],'chat']
];
for(const [id,title,label,sub,details,icon] of projects) {
 let art='';
 if(icon==='shield') art='<path d="M424 100l45 17v32c0 27-22 46-45 56-23-10-45-29-45-56v-32z"/><path d="M403 150l15 15 29-35"/>';
 if(icon==='network') art='<circle cx="425" cy="130" r="15"/><circle cx="383" cy="187" r="12"/><circle cx="469" cy="188" r="12"/><path d="M416 143l-24 33m43-33 25 33m-64 12h61"/>';
 if(icon==='wave') art='<path d="M377 153v13m15-32v51m16-67v85m16-66v49m16-34v18m16-49v80m15-61v47"/>';
 if(icon==='chat') art='<path d="M378 119h88v58h-39l-23 22v-22h-26z"/><path d="M395 140h53m-53 16h35"/>';
 await asset(id,520,280,`${title}. ${label}. ${sub} ${details.join('. ')}`,`<rect x="1" y="1" width="518" height="6" rx="3" fill="${colors.red}"/>${text(25,42,label,15,colors.red,700,'letter-spacing="1.5"')}${text(24,91,title,36,colors.text,800)}${text(25,126,sub,19,colors.muted)}<g stroke="${colors.red}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">${art}</g>${text(25,182,details[0],21,colors.text,600)}${text(25,216,details[1],19,colors.muted)}${text(25,254,'EXPLORE THE PROJECT  ↗',14,colors.red,700,'letter-spacing="1.5"')}`);
}

const skills=[
 ['languages','Languages',['Python · Java · JavaScript · C · SQL']],
 ['web','Web & APIs',['React · Node.js · Express · FastAPI · Vite','REST · WebSockets · JWT']],
 ['ai','AI & agents',['watsonx Orchestrate · MCP · PyTorch · Vertex AI','Hugging Face · DistilBERT · YOLOv2 · LIME · SHAP']],
 ['infra','Observability & infrastructure',['Grafana · Prometheus · Loki · Redis','Docker · CI/CD']],
 ['cloud','Cloud',['AWS: EC2 · S3 · IAM · RDS · Lambda','Google Cloud · IBM Cloud · Netlify · Render']],
 ['data','Databases & tools',['MongoDB · MySQL · PostgreSQL · Git · GitHub','Postman · Bruno · OpenAPI']]
];
for(const [id,title,rows] of skills) await asset(`toolkit-${id}`,980,132,`${title}: ${rows.join('. ')}`,`<rect x="23" y="25" width="5" height="82" rx="2" fill="${colors.red}"/>${text(48,49,title,24,colors.red,700)}${rows.map((row,i)=>text(48,82+i*29,row,23,colors.text)).join('')}`);

await asset('education',980,206,'M.S. Computer Science, Central Michigan University, expected May 2027. B.Tech Information Technology, Sir C R Reddy College of Engineering, 2021–2025.',`${text(30,37,'CENTRAL MICHIGAN UNIVERSITY',16,colors.red,700,'letter-spacing="1"')}${text(30,78,'M.S. Computer Science',34,colors.text,700)}${text(30,112,'Expected May 2027 · College of Science and Engineering',22,colors.muted)}${line(30,134,950,134)}${text(30,167,'B.Tech Information Technology',24,colors.text,700)}${text(30,192,'Sir C R Reddy College of Engineering · 2021–2025',19,colors.muted)}`);
for(const [id,org,name,date] of [
 ['nvidia','NVIDIA','Fundamentals of Deep Learning','NOVEMBER 2025'],
 ['google','GOOGLE CLOUD','Generative AI','NOVEMBER 2024'],
 ['aws','AWS','Cloud Technical Essentials','NOVEMBER 2023']
]) await asset(`credential-${id}`,980,98,`${org} — ${name}. ${date}. View credential.`,`${text(25,30,org,14,colors.red,700,'letter-spacing="1.5"')}${text(25,65,name,28,colors.text,700)}${text(25,86,date,13,colors.muted)}${text(952,62,'↗',34,colors.red,500,'text-anchor="end"')}`);
await asset('contact-banner',980,148,'Have a role or project in mind? Let’s build something useful. Contact Trinadh via email or LinkedIn.',`${text(30,38,'LET’S BUILD SOMETHING',15,colors.red,700,'letter-spacing="2"')}${text(30,84,'Have a role or project in mind?',34,colors.text,700)}${text(30,119,'AI · Cloud · Systems · Full-stack development',22,colors.muted)}${text(942,92,'↗',48,colors.red,500,'text-anchor="end"')}`);

// Match the saved stats cards to the same palette without changing the data.
for(const name of ['github-stats','github-streak','github-summary','contribution-graph']) {
 const source=await readFile(`${root}assets/${name}.svg`,'utf8');
 await writeFile(`${root}assets/${name}.svg`,restyle(source));
}
console.log('Profile visual assets rebuilt');
