import assert from 'node:assert/strict';
import {test} from 'node:test';
import {validateTransfer,mergeProgress,IDS} from '../progress-contract.js';
test('progress import validates known IDs, language and bounded data',()=>{
const payload=encodeURIComponent(JSON.stringify({version:1,completed:[IDS[0],IDS[0]],language:'en'}));
assert.deepEqual(validateTransfer(payload),{completed:[IDS[0]],language:'en'});
for(const value of [{version:2,completed:[],language:null},{version:1,completed:['__proto__'],language:null},{version:1,completed:[],language:'fr'},{version:1,completed:'x',language:null}])assert.throws(()=>validateTransfer(encodeURIComponent(JSON.stringify(value))));
assert.throws(()=>validateTransfer('x'.repeat(4097)));assert.throws(()=>validateTransfer('%broken'));
});
test('import adds handled records without clearing existing checks or carrying unrelated keys',()=>{
assert.deepEqual(mergeProgress({[IDS[0]]:true,[IDS[1]]:false,unrelated:true},[IDS[2]]),{[IDS[0]]:true,[IDS[2]]:true});
});
