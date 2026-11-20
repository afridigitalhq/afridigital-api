import test from "node:test";
import assert from "node:assert/strict";
import {
  validateUrl,isPublicIp,resolvePublicAddresses,assertSameHost,parseRobotsPolicy,
  inspectContentLength,parseRobots,MAX_RESPONSE_BYTES,MAX_ROBOTS_BYTES,
  MAX_REDIRECTS,TIMEOUT_MS,MIN_REQUEST_INTERVAL_MS
} from "./AfriREAHttpTransport.js";

test("accepts HTTPS and strips URL fragments",()=>assert.equal(validateUrl("https://example.com/a#frag"),"https://example.com/a"));
test("blocks HTTP, credentials and nonstandard ports",()=>{
  assert.throws(()=>validateUrl("http://example.com"),{message:"HTTPS_REQUIRED"});
  assert.throws(()=>validateUrl("https://u:p@example.com"),{message:"URL_AUTHORITY_INVALID"});
  assert.throws(()=>validateUrl("https://example.com:8443"),{message:"NONSTANDARD_PORT_BLOCKED"});
});
test("blocks private, loopback and reserved IP literals",()=>{
  for(const ip of ["127.0.0.1","10.0.0.1","172.16.0.1","192.168.1.1","169.254.1.1","100.64.0.1","192.0.2.1","224.0.0.1","::1","fc00::1","fe80::1","2001:db8::1","2001:0db8::1","2001:0::1","2002:c000:0204::1","3fff::1"]) {
    assert.equal(isPublicIp(ip),false,ip);
    assert.throws(()=>validateUrl(`https://${ip.includes(":")?`[${ip}]`:ip}/`));
  }
});
test("accepts public IPv4 and global IPv6 literals",()=>{
  assert.equal(isPublicIp("93.184.216.34"),true);
  assert.equal(isPublicIp("2606:4700:4700::1111"),true);
  assert.equal(isPublicIp("2001:4860:4860::8888"),true);
});
test("validates every DNS answer and rejects mixed public/private answers",async()=>{
  const good=await resolvePublicAddresses("example.com",async()=>[{address:"93.184.216.34",family:4},{address:"93.184.216.34",family:4}]);
  assert.deepEqual(good,["93.184.216.34"]);
  await assert.rejects(()=>resolvePublicAddresses("example.com",async()=>[{address:"93.184.216.34",family:4},{address:"10.0.0.1",family:4}]),{message:"NONPUBLIC_DNS_ANSWER_BLOCKED"});
});
test("maps DNS lookup failure to stable error",async()=>{
  await assert.rejects(()=>resolvePublicAddresses("bad.example",async()=>{throw new Error("offline")}),{message:"HOST_RESOLUTION_FAILED"});
});
test("blocks cross-host and downgrade redirects",()=>{
  assert.throws(()=>assertSameHost("https://example.com","https://evil.example/"),{message:"CROSS_HOST_REDIRECT_BLOCKED"});
  assert.throws(()=>assertSameHost("https://example.com","http://example.com/"),{message:"HTTPS_REQUIRED"});
});
test("validates content length and response limits",()=>{
  assert.equal(inspectContentLength("123",200),123);
  assert.equal(inspectContentLength(null,200),null);
  assert.throws(()=>inspectContentLength("-1",200),{message:"INVALID_CONTENT_LENGTH"});
  assert.throws(()=>inspectContentLength("201",200),{message:"RESPONSE_SIZE_LIMIT_EXCEEDED"});
});
test("robots parser applies allow/disallow specificity",()=>{
  const rules="User-agent: *\nDisallow: /private\nAllow: /private/public\n";
  assert.equal(parseRobots(rules,"https://example.com/private/a"),false);
  assert.equal(parseRobots(rules,"https://example.com/private/public/a"),true);
  assert.equal(parseRobots(rules,"https://example.com/open"),true);
});
test("robots parser supports wildcard and end anchors",()=>{
  const rules="User-agent: MiniAfriREAResearchBot\nDisallow: /*.pdf$\n";
  assert.equal(parseRobots(rules,"https://example.com/files/report.pdf"),false);
  assert.equal(parseRobots(rules,"https://example.com/files/report.pdf?download=1"),true);
});
test("robots parser defaults to allow when no group matches",()=>{
  assert.equal(parseRobots("User-agent: OtherBot\nDisallow: /","https://example.com/"),true);
});

test("robots parser merges repeated identical user-agent groups",()=>{
  const rules="User-agent: MiniAfriREAResearchBot\nDisallow: /one\n\nUser-agent: MiniAfriREAResearchBot\nDisallow: /two";
  assert.equal(parseRobots(rules,"https://example.com/one"),false);
  assert.equal(parseRobots(rules,"https://example.com/two"),false);
  assert.equal(parseRobots(rules,"https://example.com/three"),true);
});
test("robots parser selects the first matching specific group",()=>{
  const rules="User-agent: MiniAfriREA\nDisallow: /private\n\nUser-agent: MiniAfriREAResearchBot\nAllow: /private";
  assert.equal(parseRobots(rules,"https://example.com/private"),false);
});
test("robots parser lets Allow win equal-specificity conflicts",()=>{
  const rules="User-agent: *\nDisallow: /private\nAllow: /private";
  assert.equal(parseRobots(rules,"https://example.com/private"),true);
});
test("robots parser always permits robots.txt",()=>{
  const rules="User-agent: *\nDisallow: /";
  assert.equal(parseRobots(rules,"https://example.com/robots.txt"),true);
  assert.equal(parseRobots(rules,"https://example.com/private"),false);
});
test("robots parser matches product token without user-agent version",()=>{
  const rules="User-agent: MiniAfriREAResearchBot\nDisallow: /private";
  assert.equal(parseRobots(rules,"https://example.com/private"),false);
});
test("robots parser treats empty Disallow as allow-all",()=>{
  const rules="User-agent: *\nDisallow:";
  assert.equal(parseRobots(rules,"https://example.com/private"),true);
});
test("robots parser prefers an exact full user-agent group",()=>{
  const rules="User-agent: MiniAfriREAResearchBot\nDisallow: /private\n\nUser-agent: MiniAfriREAResearchBot/1.0\nAllow: /private";
  assert.equal(parseRobots(rules,"https://example.com/private","MiniAfriREAResearchBot/1.0"),true);
});
test("robots parser uses actual matched URL length for wildcard specificity",()=>{
  const rules="User-agent: *\nDisallow: /private/*/document\nAllow: /private/section/document";
  assert.equal(parseRobots(rules,"https://example.com/private/section/document"),true);
});

test("robots parser normalizes percent-encoded URL paths",()=>{
  const rules="User-agent: *\nDisallow: /private/secret";
  assert.equal(parseRobots(rules,"https://example.com/private%2Fsecret"),false);
});
test("robots parser normalizes percent-encoded rule patterns",()=>{
  const rules="User-agent: *\nDisallow: /~user";
  assert.equal(parseRobots(rules,"https://example.com/%7Euser"),false);
});
test("robots parser normalizes repeated dollar and wildcard suffixes",()=>{
  const rules="User-agent: *\nDisallow: /private$**";
  assert.equal(parseRobots(rules,"https://example.com/private"),false);
});
test("robots parser ignores rules containing an internal dollar anchor",()=>{
  const rules="User-agent: *\nDisallow: /private$section";
  assert.equal(parseRobots(rules,"https://example.com/private$section"),true);
});
test("robots parser preserves query normalization and matching",()=>{
  const rules="User-agent: *\nDisallow: /search?q=hello%20world";
  assert.equal(parseRobots(rules,"https://example.com/search?q=hello%20world"),false);
});
test("preserves original transport limits",()=>{
  assert.equal(TIMEOUT_MS,8000);
  assert.equal(MAX_RESPONSE_BYTES,2097152);
  assert.equal(MAX_ROBOTS_BYTES,262144);
  assert.equal(MAX_REDIRECTS,3);
  assert.equal(MIN_REQUEST_INTERVAL_MS,2000);
});

import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { requestOnce, safeGet, checkRobots, fetchPage } from "./AfriREAHttpTransport.js";

function fakeHttps({status=200,headers={"content-type":"text/html","content-length":"2"},body="OK",inspect=()=>{}}={}) {
  return (options,callback) => {
    inspect(options);
    const req = new EventEmitter();
    req.end = () => {
      const response = new PassThrough();
      response.statusCode = status;
      response.headers = headers;
      callback(response);
      response.end(Buffer.from(body));
    };
    return req;
  };
}

test("requestOnce enforces real elapsed-time pacing",async()=>{
  const starts=[];
  const request=fakeHttps({inspect:()=>starts.push(Date.now())});
  const url="https://93.184.216.34/";
  await requestOnce(url,{request,minRequestIntervalMs:2200});
  await requestOnce(url,{request,minRequestIntervalMs:2200});
  assert.equal(starts.length,2);
  assert.ok(starts[1]-starts[0]>=2100,"actual interval was "+(starts[1]-starts[0])+"ms");
});

test("requestOnce pins the validated DNS address and preserves TLS verification",async()=>{
  let lookupCalls=0;
  const result=await requestOnce("https://example.com/page",{
    lookup:async(host,options)=>{lookupCalls++;assert.equal(host,"example.com");assert.equal(options.all,true);return [{address:"93.184.216.34",family:4}];},
    pace:async()=>{},
    request:fakeHttps({inspect:options=>{
      assert.equal(options.hostname,"example.com");
      assert.equal(options.servername,"example.com");
      assert.equal(options.rejectUnauthorized,true);
      assert.equal(options.agent,false);
      assert.equal(options.headers.Host,"example.com");
      options.lookup("example.com",{},(error,address,family)=>{
        assert.ifError(error);assert.equal(address,"93.184.216.34");assert.equal(family,4);
      });
    }})
  });
  assert.equal(lookupCalls,1);
  assert.equal(result.status,200);
  assert.equal(result.body.toString(),"OK");
});

test("requestOnce formats IPv6 Host header with brackets",async()=>{
  const result=await requestOnce("https://[2606:4700:4700::1111]/",{
    pace:async()=>{},
    request:fakeHttps({inspect:options=>{
      assert.equal(options.hostname,"2606:4700:4700::1111");
      assert.equal(options.headers.Host,"[2606:4700:4700::1111]");
      assert.equal(options.rejectUnauthorized,true);
    }})
  });
  assert.equal(result.status,200);
});

test("safeGet follows same-host redirects and stops at the final response",async()=>{
  const seen=[];
  const result=await safeGet("https://example.com/start",{requestOnceImpl:async(url)=>{
    seen.push(url);
    if(seen.length===1)return {status:302,location:"/next",url};
    return {status:200,url,body:Buffer.from("page")};
  }});
  assert.deepEqual(seen,["https://example.com/start","https://example.com/next"]);
  assert.equal(result.status,200);
  assert.equal(result.body.toString(),"page");
});

test("safeGet preserves robots pacing across redirects",async()=>{
  const intervals=[];
  const result=await safeGet("https://example.com/start",{
    minRequestIntervalMs:7000,
    requestOnceImpl:async(url,options)=>{
      intervals.push(options.minRequestIntervalMs);
      if(intervals.length===1)return {status:302,location:"/next",url};
      return {status:200,url,body:Buffer.from("page")};
    }
  });
  assert.equal(result.status,200);
  assert.deepEqual(intervals,[7000,7000]);
});

test("safeGet rejects cross-host and HTTPS downgrade redirects",async()=>{
  const downgrade=await safeGet("https://example.com/start",{requestOnceImpl:async url=>({status:302,location:"http://example.com/",url})});
  assert.equal(downgrade.error,"INVALID_REDIRECT_DESTINATION");
  const cross=await safeGet("https://example.com/start",{requestOnceImpl:async url=>({status:302,location:"https://other.example/",url})});
  assert.equal(cross.error,"CROSS_HOST_REDIRECT_BLOCKED");
});

test("safeGet enforces the redirect limit",async()=>{
  let calls=0;
  const result=await safeGet("https://example.com/start",{requestOnceImpl:async url=>{calls++;return {status:302,location:"/again",url};}});
  assert.equal(result.error,"REDIRECT_LIMIT_EXCEEDED");
  assert.equal(calls,MAX_REDIRECTS+1);
});

test("checkRobots allows only a real 404 or a matching allowed policy",async()=>{
  const missing=await checkRobots("https://example.com/page",{safeGetImpl:async(url,options)=>{
    assert.equal(url,"https://example.com/robots.txt");
    assert.equal(options.maxBytes,MAX_ROBOTS_BYTES);
    assert.ok(options.allowedTypes.has("text/plain"));
    return {status:404};
  }});
  assert.equal(missing.allowed,true);
  const denied=await checkRobots("https://example.com/private",{safeGetImpl:async()=>({status:200,body:Buffer.from("User-agent: *\nDisallow: /private")})});
  assert.equal(denied.allowed,false);
  const failed=await checkRobots("https://example.com/page",{safeGetImpl:async()=>{throw Error("offline");}});
  assert.equal(failed.allowed,false);
  assert.equal(failed.reason,"ROBOTS_FETCH_FAILED");
});

test("fetchPage checks robots before fetching HTML and returns bounded page data",async()=>{
  const order=[];
  const result=await fetchPage("https://example.com/page",{
    checkRobotsImpl:async url=>{order.push("robots");assert.equal(url,"https://example.com/page");return {allowed:true};},
    safeGetImpl:async(url,options)=>{
      order.push("page");
      assert.equal(url,"https://example.com/page");
      assert.equal(options.maxBytes,MAX_RESPONSE_BYTES);
      assert.ok(options.allowedTypes.has("text/html"));
      return {status:200,url,content_type:"text/html",body:Buffer.from("<html>OK</html>")};
    }
  });
  assert.deepEqual(order,["robots","page"]);
  assert.equal(result.ok,true);
  assert.equal(result.bytes,15);
  assert.equal(result.body.toString(),"<html>OK</html>");
});

test("fetchPage refuses page retrieval when robots policy denies access",async()=>{
  let pageRequested=false;
  const result=await fetchPage("https://example.com/private",{
    checkRobotsImpl:async()=>({allowed:false,reason:"ROBOTS_POLICY_CHECKED"}),
    safeGetImpl:async()=>{pageRequested=true;throw Error("must not fetch");}
  });
  assert.equal(result.ok,false);
  assert.equal(result.reason,"ROBOTS_POLICY_CHECKED");
  assert.equal(pageRequested,false);
});

test("fetchPage rejects non-200 responses and blocked content types",async()=>{
  const denied=await fetchPage("https://example.com/page",{
    checkRobotsImpl:async()=>({allowed:true}),
    safeGetImpl:async()=>({status:403})
  });
  assert.equal(denied.ok,false);
  assert.equal(denied.reason,"PAGE_HTTP_ERROR");
  const blocked=await fetchPage("https://example.com/page",{
    checkRobotsImpl:async()=>({allowed:true}),
    safeGetImpl:async()=>({error:"CONTENT_TYPE_BLOCKED"})
  });
  assert.equal(blocked.ok,false);
  assert.equal(blocked.reason,"CONTENT_TYPE_BLOCKED");
});


test("robots policy enforces the greatest applicable timing interval",()=>{
  const policy=parseRobotsPolicy(
    "User-agent: *\nCrawl-delay: 3\nRequest-rate: 1/5",
    "https://example.com/page"
  );
  assert.equal(policy.allowed,true);
  assert.equal(policy.minRequestIntervalMs,5000);
});

test("robots policy retains the global minimum for faster directives",()=>{
  const policy=parseRobotsPolicy(
    "User-agent: *\nCrawl-delay: 0.5\nRequest-rate: 3/2",
    "https://example.com/page"
  );
  assert.equal(policy.minRequestIntervalMs,MIN_REQUEST_INTERVAL_MS);
});

test("robots policy uses the selected specific user-agent group",()=>{
  const policy=parseRobotsPolicy(
    "User-agent: *\nCrawl-delay: 10\n\nUser-agent: MiniAfriREAResearchBot\nCrawl-delay: 4",
    "https://example.com/page"
  );
  assert.equal(policy.minRequestIntervalMs,4000);
});

test("robots policy ignores malformed timing directives",()=>{
  const policy=parseRobotsPolicy(
    "User-agent: *\nCrawl-delay: -5\nRequest-rate: 0/2\nRequest-rate: 2/0",
    "https://example.com/page"
  );
  assert.equal(policy.minRequestIntervalMs,MIN_REQUEST_INTERVAL_MS);
});

test("fetchPage passes robots timing policy to page retrieval",async()=>{
  let received;
  const {fetchPage}=await import("./AfriREAHttpTransport.js");
  const result=await fetchPage("https://example.com/page",{
    checkRobotsImpl:async()=>({allowed:true,minRequestIntervalMs:7000}),
    safeGetImpl:async(url,options)=>{
      received=options.minRequestIntervalMs;
      return {status:200,url,content_type:"text/html",body:Buffer.from("<html>OK</html>")};
    }
  });
  assert.equal(result.ok,true);
  assert.equal(received,7000);
});
