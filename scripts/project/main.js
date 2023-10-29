var expressions = {};
var curExpr = [];
var curExprKey;

var W;
var H;

var time = 0;
var isDone = 0;


function getRandomExpr(unique)
{
	let keys = Object.keys(expressions);
	
	if(unique && keys.length > 1)
		keys = keys.filter(key => key != curExprKey);
	
	let index = Math.floor(Math.random() * keys.length);
	curExprKey = keys[index];
	let exprs = expressions[curExprKey] ?? 0;
	
	if(exprs == 0)
	{
		isDone = 1;
		return;
	}
	
	index = Math.floor(Math.random() * exprs.length);
	curExpr = exprs[index];	
}

function initExpressions()
{
	for(let i = 1; i <= 10; i++) expressions[i] = [];
		
	for(let i = 0; i <= 10; i++)
	{
		for(let j = 0; j <= 10; j++)
		{
			if(i + j == 0) continue;
			if(i + j <= 10) expressions[i+j].push([i, j]);
		}
	}
	getRandomExpr();
}

function btnOnClicked(btn)
{
	if(curExprKey == btn.instVars['value'])
	{
		let index = expressions[curExprKey].indexOf(curExpr);
		
		if(index != -1)
		{
			expressions[curExprKey].splice(index, 1);
			if(!expressions[curExprKey].length) delete expressions[curExprKey];
		}
	}

	if(Date.now() - time < 3000) getRandomExpr(true);
	else getRandomExpr(false);

// 	let totalCount = 0;

// 	for (let key in expressions)
// 	{
// 		if (Array.isArray(expressions[key]))
// 		{
// 			totalCount += expressions[key].length;
// 		}
// 	}
// 	console.log(totalCount, '----', (Date.now()-time)/1000 )
// 	console.log(expressions);

	time = Date.now();
}

function createBtns(runtime)
{
	let x = 0;
	let y = 0;
	let w = 200;
	let h = 40;
	
	for(let i = 0; i < 10; i++)
	{
		if(i % 2 == 0)
		{
			x = W * 0.25 - w / 2;
			y = H * 0.3 + (i/2) * h * 1.25;
		}
		else x = W * 0.75 - w / 2;
		
		let btn = runtime.objects.Button.createInstance(0, x, y);
		
		btn.width = w;
		btn.height = h;
		btn.text = `${i+1}`;
		btn.instVars['value'] = i+1;
		btn.addEventListener("click", () => btnOnClicked(btn));
	}
}

runOnStartup(async runtime =>
{	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	W = runtime.viewportWidth;
	H = runtime.viewportHeight;
	
	initExpressions();
	createBtns(runtime);	
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	let text = runtime.objects.Text.getFirstInstance();
	
	if(!isDone) 
		text.text = `${curExpr[0]} + ${curExpr[1]}`;
	else 
		alert('Test is done')
}
