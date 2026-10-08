import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
// Replaces the Round 1 check (002/003 limited to team.handoff): every demo pack now declares a policy per
// tool, every outbound or commitment tool requires human approval, and forbidden actions never appear as tools.
const OUTBOUND=/^(message\.send|mail\.send|reminder\.send|calendar\.(book|hold)|visit\.schedule|interview\.schedule|refund\.request|post\.(schedule|publish))/;
const FORBIDDEN=/^(mail\.send|post\.publish|payment\.|offer\.submit|candidate\.rank)/;
const slugs=readdirSync('packs').filter(s=>!s.startsWith('_')&&s!=='clinic-appointment-confirmation');
for(const slug of slugs)test(`${slug}: tool policies keep humans in charge of outbound actions`,()=>{
 const root=`packs/${slug}`;const pack=JSON.parse(readFileSync(`${root}/pack.json`));assert.equal(pack.status,'demo');
 assert.ok(pack.tools.some(t=>t.id==='team.handoff'),'handoff available');
 for(const t of pack.tools){assert.ok(['auto','approval'].includes(t.policy),`${t.id} policy`);assert.ok(!FORBIDDEN.test(t.id),`${t.id} must not be a tool`);if(OUTBOUND.test(t.id))assert.equal(t.policy,'approval',`${t.id} needs approval`);}
 for(const path of pack.demo.scenarios){const s=JSON.parse(readFileSync(`${root}/${path}`));
  const approvalTools=s.events.filter(e=>e.step==='human'&&e.tool&&pack.tools.find(t=>t.id===e.tool)?.policy==='approval');
  if(approvalTools.length||s.expect.handoff)assert.equal(s.humanReview,'required',`${path} shows a human gate`);}
});
