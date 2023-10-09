import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as c,c as l,a as n,d as s,b as o,e as p}from"./app-92bcc340.js";const i={},u=p(`<h2 id="codedeploy" tabindex="-1"><a class="header-anchor" href="#codedeploy" aria-hidden="true">#</a> CodeDeploy</h2><h2 id="설정파일" tabindex="-1"><a class="header-anchor" href="#설정파일" aria-hidden="true">#</a> 설정파일</h2><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">name</span><span class="token punctuation">:</span> Backend Deploy <span class="token comment"># action 명</span>

<span class="token key atrule">on</span><span class="token punctuation">:</span> <span class="token comment"># 이벤트 트리거</span>
	<span class="token key atrule">push</span><span class="token punctuation">:</span> <span class="token comment"># push event에 반응</span>
		<span class="token key atrule">paths</span><span class="token punctuation">:</span>
			<span class="token punctuation">-</span> <span class="token string">&quot;backend/**&quot;</span> <span class="token comment"># backend의 변경이 있을 때</span>
		<span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token comment"># github repository의 branch가</span>
			<span class="token punctuation">-</span> main <span class="token comment"># main 일 경우만</span>

<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
	<span class="token key atrule">deploy</span><span class="token punctuation">:</span> <span class="token comment"># GitHub-hosted runners env</span>
		<span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest <span class="token comment"># using Ubuntu</span>

		<span class="token key atrule">defaults</span><span class="token punctuation">:</span>
			<span class="token key atrule">run</span><span class="token punctuation">:</span>
				<span class="token key atrule">working-directory</span><span class="token punctuation">:</span> <span class="token string">&quot;backend&quot;</span> <span class="token comment"># backend 폴더에서 실행</span>

	<span class="token key atrule">steps</span><span class="token punctuation">:</span>
		<span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Authenticate AWS CLI
		  <span class="token key atrule">env</span><span class="token punctuation">:</span>
			<span class="token key atrule">AWS_ACCESS_KEY_ID</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_ACCESS_KEY_ID <span class="token punctuation">}</span><span class="token punctuation">}</span>
			<span class="token key atrule">AWS_SECRET_ACCESS_KEY</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_SECRET_ACCESS_KEY <span class="token punctuation">}</span><span class="token punctuation">}</span>
			<span class="token key atrule">AWS_REGION</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.AWS_REGION <span class="token punctuation">}</span><span class="token punctuation">}</span>
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
			aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
			aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
			aws configure set default.region $AWS_REGION</span>

		<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Create CodeDeploy Deployment
		  <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
			aws deploy create-deployment \\
				--application-name backendEC2Deploy \\
				--deployment-group-name yourDeployGroup \\
				--deployment-config-name CodeDeployDefault.AllAtOnce \\
				--file-exists-behavior OVERWRITE \\
				--github-location repository=\${{ github.repository }},commitId=\${{ github.sha }}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>on에서 main 브랜치에서 push 이벤트가 일어나고, backend폴더가 변경사항이 있으면 작업을 실행합니다.<br> jobs 아래의 steps를 보면 AWS 권한을 설정한 후 AWS CodeDeploy에서 미리 설정해놓은 작업을 실행합니다.</p><p>이렇게 설정하면 backend에서 변경사항이 있을 때 Github Actions를 실행해서 CodeDeploy로 보내는 과정을 실행하게됩니다.</p>`,5),d=n("code",null,"Create CodeDeploy Deployment",-1),r=n("code",null,"run",-1),k={href:"https://aws.amazon.com/ko/cli/",target:"_blank",rel:"noopener noreferrer"},m=n("br",null,null,-1),v=n("h2",{id:"배포-확인",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#배포-확인","aria-hidden":"true"},"#"),s(" 배포 확인")],-1),b=n("figure",null,[n("img",{src:"https://github.com/Zamoca42/vue-django-blog/assets/96982072/46c82e81-59d7-4f8f-8b84-0030be9ce3d3",alt:"스크린샷 2023-09-15 오후 4 18 45",tabindex:"0",loading:"lazy"}),n("figcaption",null,"스크린샷 2023-09-15 오후 4 18 45")],-1),_=n("p",null,"CodeDeploy에서도 배포된 것을 확인할 수 있습니다.",-1);function y(h,S){const a=t("ExternalLinkIcon");return c(),l("div",null,[u,n("p",null,[d,s("의 "),r,s("의 명령어들은"),n("a",k,[s(" AWS CLI"),o(a)]),s("입니다."),m,s(" 추가하거나 변경하고 싶은 작업이 있으면 AWS CLI 명령어들을 확인해서 변경하면 됩니다.")]),v,b,_])}const E=e(i,[["render",y],["__file","ec2-deploy.html.vue"]]);export{E as default};
