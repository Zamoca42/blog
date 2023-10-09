import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,e as t}from"./app-92bcc340.js";const e={},p=t(`<h2 id="정적-웹-호스팅-배포" tabindex="-1"><a class="header-anchor" href="#정적-웹-호스팅-배포" aria-hidden="true">#</a> 정적 웹 호스팅 배포</h2><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">name</span><span class="token punctuation">:</span> Frontend Deploy <span class="token comment"># action 명</span>

<span class="token key atrule">on</span><span class="token punctuation">:</span> <span class="token comment"># 이벤트 트리거</span>
	<span class="token key atrule">push</span><span class="token punctuation">:</span> <span class="token comment"># push event에 반응</span>
		<span class="token key atrule">paths</span><span class="token punctuation">:</span>
			<span class="token punctuation">-</span> <span class="token string">&quot;frontend/**&quot;</span> <span class="token comment"># frontend의 변경이 있을 때</span>
		<span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token comment"># github repository의 branch가</span>
			<span class="token punctuation">-</span> main <span class="token comment"># main 일 경우만</span>

<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
	<span class="token key atrule">deploy</span><span class="token punctuation">:</span> <span class="token comment"># GitHub-hosted runners env</span>
		<span class="token key atrule">runs-on</span><span class="token punctuation">:</span> macos<span class="token punctuation">-</span>latest <span class="token comment"># using MacOS</span>

	<span class="token key atrule">defaults</span><span class="token punctuation">:</span>
		<span class="token key atrule">run</span><span class="token punctuation">:</span>
			<span class="token key atrule">working-directory</span><span class="token punctuation">:</span> <span class="token string">&quot;frontend&quot;</span> <span class="token comment"># frontend 폴더에서 실행</span>
	
	<span class="token key atrule">steps</span><span class="token punctuation">:</span>
		<span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Set Node.js 18.x
		  <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/setup<span class="token punctuation">-</span>node@v3
		  <span class="token key atrule">with</span><span class="token punctuation">:</span>
			<span class="token key atrule">node-version</span><span class="token punctuation">:</span> 18.x

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Install dependencies
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> npm install

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build page
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> npm run build

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Authenticate AWS CLI
		  <span class="token key atrule">env</span><span class="token punctuation">:</span>
			<span class="token key atrule">AWS_ACCESS_KEY_ID</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_ACCESS_KEY_ID <span class="token punctuation">}</span><span class="token punctuation">}</span>
			<span class="token key atrule">AWS_SECRET_ACCESS_KEY</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_SECRET_ACCESS_KEY <span class="token punctuation">}</span><span class="token punctuation">}</span>
			<span class="token key atrule">AWS_REGION</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_REGION <span class="token punctuation">}</span><span class="token punctuation">}</span>

		  <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
			aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
			aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
			aws configure set default.region $AWS_REGION</span>

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> remove <span class="token comment"># 삭제</span>
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
			aws s3 rm s3://my-site/assets/ --recursive
			aws s3 rm s3://my-site/blog/ --recursive</span>
		
		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> deploy <span class="token comment"># 배포</span>
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
			aws s3 cp --recursive dist s3://my-site</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="배포-확인" tabindex="-1"><a class="header-anchor" href="#배포-확인" aria-hidden="true">#</a> 배포 확인</h2><figure><img src="https://github.com/Zamoca42/vue-django-blog/assets/96982072/536400d1-9c93-4e3d-845e-53e5222a1c1a" alt="스크린샷 2023-09-15 오후 4 16 03" tabindex="0" loading="lazy"><figcaption>스크린샷 2023-09-15 오후 4 16 03</figcaption></figure><p>S3에서 변경사항이 업데이트 되고있는지 확인할 수 있습니다</p>`,5),c=[p];function l(i,u){return s(),a("div",null,c)}const d=n(e,[["render",l],["__file","s3-deploy.html.vue"]]);export{d as default};
