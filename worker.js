export default {

async fetch(request, env) {

if(request.method !== "POST"){
return new Response("OK");
}

const body =
await request.json();

const userMessage =
body.message;

const openai =
await fetch(
"https://api.openai.com/v1/chat/completions",
{
method:"POST",
headers:{
Authorization:
`Bearer ${env.OPENAI_API_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:`
You are the Lives In Motion AI Receptionist.

You help families exploring:

- Care homes
- Retirement villages
- Assisted living
- Home care

Be warm, professional and concise.

When someone asks about:
pricing,
availability,
viewings,
or tours

politely ask for:

Name
Email
Phone
`
},
{
role:"user",
content:userMessage
}
]
})
}
);

const data =
await openai.json();

const reply =
data.choices[0].message.content;

const emailPattern =
/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

if(emailPattern.test(userMessage)){

await fetch(
"https://api.resend.com/emails",
{
method:"POST",
headers:{
Authorization:
`Bearer ${env.RESEND_API_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
from:
"leads@livesinmotion.co.uk",
to:[
"hello@livesinmotion.co.uk"
],
subject:
"New Lives In Motion Lead",
html:
`<p>${userMessage}</p>`
})
}
);

}

return Response.json({
reply
});

}

}
