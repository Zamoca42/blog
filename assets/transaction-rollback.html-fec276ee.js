import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c,a as n,b as s,d as i,e as a}from"./app-ad4d1437.js";const l={},u=a(`<p>현재 진행중인 프로젝트에서 이벤트를 생성하고 수정하는 기능을 만들려고한다.</p><p>생성할때는 문제가 없었지만 이벤트를 수정하려고 할때 1:N 관계인 이벤트의 이미지와 해시태그를<br> 수정할 때 pk키를 못찾거나 수정에 실패해서 트랜잭션이 롤백되고 있었다.</p><figure><img src="https://github.com/Zamoca42/blog/assets/96982072/74f75939-7aad-418b-966f-d839c47c8bde" alt="이벤트 이미지 수정 시 트랜잭션 롤백이 발생한다" tabindex="0" loading="lazy"><figcaption>이벤트 이미지 수정 시 트랜잭션 롤백이 발생한다</figcaption></figure><figure><img src="https://github.com/Zamoca42/blog/assets/96982072/84b03205-12b1-44bd-ba2a-a55f4e12da42" alt="이벤트 관련 테이블" tabindex="0" loading="lazy"><figcaption>이벤트 관련 테이블</figcaption></figure><p><strong>src/event/event.entity.ts</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Entity</span></span><span class="token punctuation">(</span><span class="token string">&quot;event&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">Events</span> <span class="token keyword">extends</span> <span class="token class-name">BaseDateEntity</span> <span class="token punctuation">{</span>
  <span class="token comment">//...</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">OneToMany</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> EventImage<span class="token punctuation">,</span> <span class="token punctuation">(</span>eventImage<span class="token operator">:</span> EventImage<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> eventImage<span class="token punctuation">.</span>event<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    cascade<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  eventImages<span class="token operator">:</span> EventImage<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">//...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// GET api/event/28</span>
<span class="token punctuation">{</span>
  <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token string">&quot;요청한 이벤트 정보를 조회합니다.&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;success&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token number">28</span><span class="token punctuation">,</span>
    <span class="token property">&quot;title&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;content&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;mainThumbnailUrl&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;brandName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;hashtags&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;캐릭터&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">&quot;images&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;https://example.com&quot;</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// PATCH api/event/28</span>
<span class="token punctuation">{</span>
  <span class="token property">&quot;images&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;https://example2.com&quot;</span><span class="token punctuation">]</span> <span class="token comment">// 수정 시 트랜잭션 오류가 발생한다.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="트랜잭션이란" tabindex="-1"><a class="header-anchor" href="#트랜잭션이란" aria-hidden="true">#</a> 트랜잭션이란?</h2><p>트랜잭션에 대해서 설명하면 컴퓨터 과학 분야에서의 트랜잭션(Transaction)은 &quot;더이상 분할이 불가능한 업무처리의 단위&quot;를 의미한다.</p><p>이것은 하나의 작업을 위해 더이상 분할될 수 없는 명령들의 모음,<br> 즉, 한꺼번에 수행되어야 할 일련의 연산모음을 의미한다.</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">START</span> <span class="token keyword">TRANSACTION</span>
    <span class="token comment">-- 이 블록안의 명령어들은 마치 하나의 명령어 처럼 처리됨</span>
    <span class="token comment">-- 성공하던지, 다 실패하던지 둘중 하나가 됨.</span>
    A의 계좌로부터 인출<span class="token punctuation">;</span>
    B의 계좌로 입금<span class="token punctuation">;</span>
<span class="token keyword">COMMIT</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이와 같이, 데이터베이스와 어플리케이션의 데이터 거래(Transaction)에 있어서 안전성을 확보하기 위한 방법이 트랜잭션인 것이다.</p><p>따라서 데이터베이스에서 테이블의 데이터를 읽어 온 후 다른 테이블에 데이터를 입력하거나 갱신, 삭제하는 도중에 오류가 발생하면,<br> 결과를 재반영 하는 것이 아니라 모든 작업을 원상태로 복구하고, 처리 과정이 모두 성공하였을때 만 그 결과를 반영한다.<br> 트랜잭션(Transaction)의 사전적 의미는 거래이고,<br> 컴퓨터 과학 분야에서의 트랜잭션(Transaction)은 &quot;더이상 분할이 불가능한 업무처리의 단위&quot;를 의미한다.</p>`,14),r={href:"https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98Transaction-%EC%9D%B4%EB%9E%80-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC",target:"_blank",rel:"noopener noreferrer"},d=a(`<h2 id="원인" tabindex="-1"><a class="header-anchor" href="#원인" aria-hidden="true">#</a> 원인</h2><p>이벤트를 수정할 때 TypeORM 레포지토리에서 update 메서드를 사용하고 있었다.</p><p><strong>src/event/event.service.ts</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">EventService</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> <span class="token keyword">readonly</span> eventRepository<span class="token operator">:</span> EventRepository<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">/**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   */</span>
  <span class="token keyword">async</span> <span class="token function">updateEvent</span><span class="token punctuation">(</span>
    id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span>
    updateProps<span class="token operator">:</span> EventUpdateProps
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> eventId <span class="token operator">=</span> Events<span class="token punctuation">.</span><span class="token function">byId</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> isExistEvent <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>eventRepository<span class="token punctuation">.</span><span class="token function">hasId</span><span class="token punctuation">(</span>eventId<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isExistEvent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NotFoundException</span><span class="token punctuation">(</span><span class="token string">&quot;업데이트할 이벤트가 없습니다.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>eventRepository<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>eventId<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      id<span class="token punctuation">,</span>
      <span class="token operator">...</span>updateProps<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>update 메서드에 대한 설명을 읽어보면 다음과 같다</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">/**
 * Updates entity partially. Entity can be found by a given conditions.
 * Unlike save method executes a primitive operation without cascades, relations and other operations included.
 * Executes fast and efficient UPDATE query.
 * Does not check if entity exist in the database.
 */</span>
<span class="token function">update</span><span class="token punctuation">(</span>criteria<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token builtin">number</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> Date <span class="token operator">|</span> Date<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> ObjectId <span class="token operator">|</span> ObjectId<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> FindOptionsWhere<span class="token operator">&lt;</span>Entity<span class="token operator">&gt;</span><span class="token punctuation">,</span> partialEntity<span class="token operator">:</span> QueryDeepPartialEntity<span class="token operator">&lt;</span>Entity<span class="token operator">&gt;</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>UpdateResult<span class="token operator">&gt;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Unlike save method executes a primitive operation without cascades, relations and other operations included.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>update에 작성된 주석의 2번째에 cascades나 관계된 테이블을 포함한 수정은 지원하지 않는거같다.<br> 이벤트와 관계된 테이블의 row를 수정해야할 때는 save 메서드를 사용해야한다는 뜻이다.</p><p>사실 update -&gt; save로 변경한다고해도 바뀌는건 없다.<br><strong>save로 변경해야하는건 맞지만 여전히 쿼리에서 UPDATE를 실행해서 CONFLICT가 발생해 트랜잭션 롤백이 발생한다.</strong></p><h2 id="해결" tabindex="-1"><a class="header-anchor" href="#해결" aria-hidden="true">#</a> 해결</h2><figure><img src="https://github.com/Zamoca42/blog/assets/96982072/5b2623ff-756b-4381-9894-cbf6d4eb72c9" alt="TypeORM 깃헙 이슈에서 발견" tabindex="0" loading="lazy"><figcaption>TypeORM 깃헙 이슈에서 발견</figcaption></figure><p>관계된 테이블에서 CONFLICT를 해결할 옵션이 없다는게 아쉽지만 엔티티에서 <code>{orphanedRowAction: &#39;delete&#39;}</code> 옵션으로<br> UPDATE를 대신 관계된 Row를 모두 삭제하고 다시 INSERT 하는 방법을 선택했다.</p><p><strong>src/event/event.entity.ts</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Entity</span></span><span class="token punctuation">(</span><span class="token string">&quot;event&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">Events</span> <span class="token keyword">extends</span> <span class="token class-name">BaseDateEntity</span> <span class="token punctuation">{</span>
  <span class="token comment">//...</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">OneToMany</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> EventImage<span class="token punctuation">,</span> <span class="token punctuation">(</span>eventImage<span class="token operator">:</span> EventImage<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> eventImage<span class="token punctuation">.</span>event<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    cascade<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    orphanedRowAction<span class="token operator">:</span> <span class="token string">&quot;delete&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 옵션을 추가한다.</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  eventImages<span class="token operator">:</span> EventImage<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">//...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>src/event/event.service.ts</strong></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">EventService</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> <span class="token keyword">readonly</span> hashtagService<span class="token operator">:</span> HashtagService<span class="token punctuation">,</span>
    <span class="token keyword">private</span> <span class="token keyword">readonly</span> eventRepository<span class="token operator">:</span> EventRepository<span class="token punctuation">,</span>
    <span class="token keyword">private</span> <span class="token keyword">readonly</span> photoBoothService<span class="token operator">:</span> PhotoBoothService
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">/**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   */</span>
  <span class="token keyword">async</span> <span class="token function">updateEventWithHastags</span><span class="token punctuation">(</span>
    id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span>
    updateProps<span class="token operator">:</span> EventUpdateProps
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> eventId <span class="token operator">=</span> Events<span class="token punctuation">.</span><span class="token function">byId</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> isExistEvent <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>eventRepository<span class="token punctuation">.</span><span class="token function">hasId</span><span class="token punctuation">(</span>eventId<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isExistEvent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NotFoundException</span><span class="token punctuation">(</span><span class="token string">&quot;업데이트할 이벤트가 없습니다.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> <span class="token punctuation">[</span>photoBoothBrand<span class="token punctuation">,</span> eventImages<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">prepareEventAttributes</span><span class="token punctuation">(</span>
      updateProps
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>eventRepository<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>
      <span class="token comment">//-&gt; update에서 save로 변경</span>
      <span class="token punctuation">{</span>
        id<span class="token punctuation">,</span>
        eventImages<span class="token punctuation">,</span>
        photoBoothBrand<span class="token punctuation">,</span>
        <span class="token operator">...</span>updateProps<span class="token punctuation">,</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">/**
   * @param props - 이벤트 생성 및 수정에 필요한 속성들
   * @desc  - 이벤트 관련 업체명 가져오기
   *        - 이벤트 관련 해시태그 가져오기
   *        - 이벤트 이미지 엔티티에 이벤트 이미지를 삽입
   */</span>
  <span class="token keyword">private</span> <span class="token function">prepareEventAttributes</span><span class="token punctuation">(</span>
    props<span class="token operator">:</span> EventCreateProps <span class="token operator">|</span> EventUpdateProps
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token punctuation">[</span>PhotoBoothBrand<span class="token punctuation">,</span> EventImage<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token builtin">Promise</span><span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>photoBoothService<span class="token punctuation">.</span><span class="token function">findOneBrandByName</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>brandName<span class="token punctuation">)</span><span class="token punctuation">,</span>
      props<span class="token punctuation">.</span>images<span class="token operator">?.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>image<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> EventImage<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>image<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다시 한번 수정을 요청해보면 트랜잭션이 성공한 것을 볼 수 있다.</p><figure><img src="https://github.com/Zamoca42/blog/assets/96982072/9ee842f3-c26e-4fc5-b6b6-09bded4f3339" alt="커밋된 트랜잭션 확인" tabindex="0" loading="lazy"><figcaption>커밋된 트랜잭션 확인</figcaption></figure>`,18);function k(v,m){const t=p("ExternalLinkIcon");return o(),c("div",null,[u,n("p",null,[s("출처: "),n("a",r,[s("https://inpa.tistory.com/entry/MYSQL-📚-트랜잭션Transaction-이란-💯-정리"),i(t)])]),d])}const y=e(l,[["render",k],["__file","transaction-rollback.html.vue"]]);export{y as default};
