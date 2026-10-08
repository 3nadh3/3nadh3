// Apply a shared palette and render provider cards without delayed text fades.
const palette = {
 '#141321':'#101318', '#fe428e':'#ff5264', '#f85d7f':'#ff5264',
 '#a9fef7':'#f5f7fb', '#e4e2e2':'#c1cad8', '#f8d847':'#ff5264',
 '#ae81ff':'#f78592', '#a6a1b8':'#c1cad8', '#2c263b':'#303744'
};

export function restyle(svg) {
 let styled=svg.replace(/#[\da-f]{6}\b/gi,color=>palette[color.toLowerCase()]??color);
 // The rank arc encodes data; retain its final animation value when freezing it.
 const rank=styled.match(/@keyframes rankAnimation\s*\{[\s\S]*?to\s*\{[^}]*stroke-dashoffset:\s*([\d.]+)/)?.[1];
 styled=styled.replace(/opacity:\s*0\s*;/g,'opacity: 1;')
   .replace(/animation(?:-delay)?:\s*[^;"'}]+;?/g,'');
 if(rank)styled=styled.replace(/(\.rank-circle\s*\{)([^}]*)(\})/,(_,open,body,close)=>
   `${open}\n stroke-dashoffset: ${rank};${body.replace(/\s*stroke-dashoffset:\s*[\d.]+;/g,'')}${close}`);
 return styled;
}
